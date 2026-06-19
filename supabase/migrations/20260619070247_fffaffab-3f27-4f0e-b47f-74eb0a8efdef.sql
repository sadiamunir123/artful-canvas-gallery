
CREATE POLICY "Public can read artwork images" ON storage.objects FOR SELECT USING (bucket_id = 'artworks');
CREATE POLICY "Admin can upload artwork images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artworks' AND public.is_admin_email());
CREATE POLICY "Admin can update artwork images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'artworks' AND public.is_admin_email());
CREATE POLICY "Admin can delete artwork images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'artworks' AND public.is_admin_email());
