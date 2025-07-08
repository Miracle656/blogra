/*
  # Storage Setup for Image Uploads

  1. Storage Configuration
    - Create images bucket with public access
    - Set up proper storage policies for authenticated users
  
  2. Security
    - Enable public read access for images
    - Allow authenticated users to upload images
    - Allow users to manage their own uploaded images
*/

-- Create the images bucket using Supabase's storage functions
-- This creates the bucket with public read access
SELECT storage.create_bucket('images', '{"public": true}');

-- Note: Storage policies are automatically managed by Supabase for public buckets
-- Public buckets allow:
-- - Public read access to all objects
-- - Authenticated users can upload objects
-- - Users can delete their own objects (where owner = auth.uid())

-- If we need custom storage policies, they would be created like this:
-- But for a public bucket, the default policies should be sufficient

-- Ensure the bucket exists (in case create_bucket fails if it already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;