-- Batch swap requests with optional atomicity
-- Creates swap_requests and best-effort notifications in one call
-- SECURITY DEFINER: enforces custom checks using auth.uid(); bypasses RLS for inserts where required

CREATE OR REPLACE FUNCTION public.batch_create_swap_requests(
  requests jsonb,
  global_message text DEFAULT NULL,
  atomic boolean DEFAULT true
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req jsonb;
  idx integer := 0;
  res_arr jsonb := '[]'::jsonb;
  sender uuid := auth.uid();
  item_sender_duty uuid;
  item_target_duty uuid;
  item_receiver uuid;
  item_message text;
  new_swap_id uuid;
BEGIN
  IF sender IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF requests IS NULL OR jsonb_typeof(requests) <> 'array' OR jsonb_array_length(requests) = 0 THEN
    RAISE EXCEPTION 'Invalid requests payload';
  END IF;

  FOR req IN SELECT jsonb_array_elements(requests)
  LOOP
    idx := idx + 1;
    new_swap_id := NULL;
    item_sender_duty := NULL;
    item_target_duty := NULL;
    item_receiver := NULL;
    item_message := NULL;

    -- Parse fields
    item_sender_duty := NULLIF(req->>'senderDutyId', '')::uuid;
    item_target_duty := NULLIF(req->>'targetDutyId', '')::uuid;
    item_receiver := NULLIF(req->>'receiverId', '')::uuid;
    item_message := COALESCE(NULLIF(req->>'message', ''), global_message);

    IF atomic THEN
      -- Atomic mode: let failures bubble; we still collect per-item errors using subtransaction
      BEGIN
        PERFORM 1;
        -- Validate inputs
        IF item_sender_duty IS NULL OR item_target_duty IS NULL OR item_receiver IS NULL THEN
          RAISE EXCEPTION 'Missing required fields';
        END IF;

        -- Verify sender owns the offered duty
        PERFORM 1 FROM public.duties d WHERE d.id = item_sender_duty AND d.user_id = sender;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Invalid sender duty';
        END IF;

        -- Verify target duty belongs to receiver
        PERFORM 1 FROM public.duties d WHERE d.id = item_target_duty AND d.user_id = item_receiver;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Invalid target duty';
        END IF;

        -- Prevent duplicate pending request between same duties
        PERFORM 1 FROM public.swap_requests s
         WHERE s.sender_duty_id = item_sender_duty
           AND s.target_duty_id = item_target_duty
           AND s.status = 'PENDING'::"SwapRequestStatus";
        IF FOUND THEN
          RAISE EXCEPTION 'A swap request already exists for these duties';
        END IF;

        -- Insert swap request
        INSERT INTO public.swap_requests (sender_id, receiver_id, sender_duty_id, target_duty_id, message, status)
        VALUES (sender, item_receiver, item_sender_duty, item_target_duty, item_message, 'PENDING'::"SwapRequestStatus")
        RETURNING id INTO new_swap_id;

        -- Best-effort notification (do not abort item on notification failure)
        BEGIN
          INSERT INTO public.notifications (user_id, type, title, message, swap_request_id, is_read)
          VALUES (item_receiver, 'SWAP_REQUEST_RECEIVED'::"NotificationType", 'New Swap Request', 'You have a new swap request', new_swap_id, false);
        EXCEPTION WHEN OTHERS THEN
          -- ignore notification errors
          NULL;
        END;

        -- Success result
        res_arr := res_arr || jsonb_build_array(jsonb_build_object(
          'index', idx,
          'senderDutyId', item_sender_duty,
          'targetDutyId', item_target_duty,
          'receiverId', item_receiver,
          'success', true,
          'swapRequestId', new_swap_id
        ));
      EXCEPTION WHEN OTHERS THEN
        -- Record failure; will re-raise after loop to rollback all
        res_arr := res_arr || jsonb_build_array(jsonb_build_object(
          'index', idx,
          'senderDutyId', item_sender_duty,
          'targetDutyId', item_target_duty,
          'receiverId', item_receiver,
          'success', false,
          'error', SQLERRM
        ));
      END;
    ELSE
      -- Non-atomic mode: run in per-item subtransactions to allow partial success
      BEGIN
        PERFORM 1;
        -- Validate inputs
        IF item_sender_duty IS NULL OR item_target_duty IS NULL OR item_receiver IS NULL THEN
          RAISE EXCEPTION 'Missing required fields';
        END IF;

        -- Verify sender owns the offered duty
        PERFORM 1 FROM public.duties d WHERE d.id = item_sender_duty AND d.user_id = sender;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Invalid sender duty';
        END IF;

        -- Verify target duty belongs to receiver
        PERFORM 1 FROM public.duties d WHERE d.id = item_target_duty AND d.user_id = item_receiver;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Invalid target duty';
        END IF;

        -- Prevent duplicate pending request between same duties
        PERFORM 1 FROM public.swap_requests s
         WHERE s.sender_duty_id = item_sender_duty
           AND s.target_duty_id = item_target_duty
           AND s.status = 'PENDING'::"SwapRequestStatus";
        IF FOUND THEN
          RAISE EXCEPTION 'A swap request already exists for these duties';
        END IF;

        -- Insert swap request
        INSERT INTO public.swap_requests (sender_id, receiver_id, sender_duty_id, target_duty_id, message, status)
        VALUES (sender, item_receiver, item_sender_duty, item_target_duty, item_message, 'PENDING'::"SwapRequestStatus")
        RETURNING id INTO new_swap_id;

        -- Best-effort notification
        BEGIN
          INSERT INTO public.notifications (user_id, type, title, message, swap_request_id, is_read)
          VALUES (item_receiver, 'SWAP_REQUEST_RECEIVED'::"NotificationType", 'New Swap Request', 'You have a new swap request', new_swap_id, false);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;

        res_arr := res_arr || jsonb_build_array(jsonb_build_object(
          'index', idx,
          'senderDutyId', item_sender_duty,
          'targetDutyId', item_target_duty,
          'receiverId', item_receiver,
          'success', true,
          'swapRequestId', new_swap_id
        ));
      EXCEPTION WHEN OTHERS THEN
        -- Capture error but continue
        res_arr := res_arr || jsonb_build_array(jsonb_build_object(
          'index', idx,
          'senderDutyId', item_sender_duty,
          'targetDutyId', item_target_duty,
          'receiverId', item_receiver,
          'success', false,
          'error', SQLERRM
        ));
      END;
    END IF;
  END LOOP;

  IF atomic THEN
    -- If any failure recorded, abort entire batch (rollback all successful inserts in this call)
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(res_arr) e WHERE (e->>'success')::boolean = false) THEN
      RAISE EXCEPTION 'Atomic batch failed' USING DETAIL = res_arr::text;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'results', res_arr,
    'successCount', (SELECT count(*) FROM jsonb_array_elements(res_arr) e WHERE (e->>'success')::boolean = true),
    'failureCount', (SELECT count(*) FROM jsonb_array_elements(res_arr) e WHERE (e->>'success')::boolean = false)
  );
END;
$$;
