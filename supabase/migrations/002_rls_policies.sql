-- Users policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Duties policies
CREATE POLICY "Users can view all duties" ON public.duties FOR SELECT USING (true);
CREATE POLICY "Users can manage own duties" ON public.duties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all duties" ON public.duties FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Flight legs policies
CREATE POLICY "Users can view all flight legs" ON public.flight_legs FOR SELECT USING (true);
CREATE POLICY "Users can manage flight legs of own duties" ON public.flight_legs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.duties WHERE id = flight_legs.duty_id AND user_id = auth.uid())
);

-- Swap requests policies
CREATE POLICY "Users can view swap requests they're involved in" ON public.swap_requests FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can create swap requests" ON public.swap_requests FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);
CREATE POLICY "Users can update swap requests they received" ON public.swap_requests FOR UPDATE USING (
    auth.uid() = receiver_id
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    auth.uid() = user_id
);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
    auth.uid() = user_id
);