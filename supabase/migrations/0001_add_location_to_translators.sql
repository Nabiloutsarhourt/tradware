-- Add location and pricing data to translators table for the interactive map feature
ALTER TABLE public.translators
ADD COLUMN latitude NUMERIC(10, 8),
ADD COLUMN longitude NUMERIC(11, 8),
ADD COLUMN address TEXT,
ADD COLUMN price_per_page NUMERIC(10, 2) DEFAULT 20.00;

-- Optionally, we can set default coordinates for existing users (e.g., Paris center)
UPDATE public.translators
SET latitude = 48.8566, longitude = 2.3522, address = 'Paris, France'
WHERE latitude IS NULL AND is_verified = true;
