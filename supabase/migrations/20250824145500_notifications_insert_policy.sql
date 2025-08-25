-- Allow senders to create notifications for receivers tied to their swap requests
-- Ensures that when inserting a notification referencing a swap_request created by the sender,
-- the row is permitted even though user_id is not auth.uid().

CREATE POLICY "Senders can create notifications for their swap requests"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.swap_requests sr
    WHERE sr.id = notifications.swap_request_id
      AND sr.sender_id = auth.uid()
      AND sr.receiver_id = notifications.user_id
  )
);
