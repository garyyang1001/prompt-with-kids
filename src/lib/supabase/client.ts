import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable SUPABASE_SERVICE_ROLE_KEY");
}

// It's generally recommended to use the anon key for client-side Supabase access
// and the service role key only for server-side operations where row-level security (RLS)
// might be bypassed or for admin tasks.
// For server-side API routes, using the service role key is common if you need to bypass RLS
// or perform operations not allowed by user policies.
// Ensure RLS is properly configured if using anon key from client-side in the future.
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // autoRefreshToken: true, // Enable if you manage user sessions and refresh tokens
    // persistSession: false, // Recommended for server-side if not managing sessions here
    // detectSessionInUrl: false, // Recommended for server-side
  }
});

export default supabase;
