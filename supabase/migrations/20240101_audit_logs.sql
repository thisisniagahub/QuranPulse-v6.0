-- Audit Logs for Act 326 Compliance
-- Tracks access to Quranic text to ensure integrity and usage monitoring

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('READ', 'COPY', 'SHARE', 'SEARCH')),
    resource_id TEXT NOT NULL, -- Format: "surah:ayah"
    checksum_verified BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert logs (for their own actions)
CREATE POLICY "Users can insert audit logs" 
ON audit_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Only admins can read logs (No public access)
-- Note: This requires a service role or admin user to view
CREATE POLICY "Admins can view audit logs" 
ON audit_logs FOR SELECT 
USING (false); -- Deny all by default for now, can be opened to specific roles later

-- Index for faster querying by user or resource
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
