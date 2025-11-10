-- Remove public read access from newsletter_subscribers
DROP POLICY IF EXISTS "Enable read access for all users" ON newsletter_subscribers;

-- Create admin-only read access policy for newsletter_subscribers
CREATE POLICY "Enable read access for admins only"
ON newsletter_subscribers
FOR SELECT
USING (auth.email() = 'maxwellowuor52@gmail.com'::text);