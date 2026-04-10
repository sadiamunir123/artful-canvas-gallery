
-- Allow public insert on artworks
CREATE POLICY "Anyone can insert artworks"
ON public.artworks
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public update on artworks
CREATE POLICY "Anyone can update artworks"
ON public.artworks
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow public delete on artworks
CREATE POLICY "Anyone can delete artworks"
ON public.artworks
FOR DELETE
TO public
USING (true);
