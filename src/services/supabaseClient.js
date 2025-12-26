import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qrubqwrsgljqlucygnef.supabase.co";
const supabaseKey = "sb_publishable_6QEWO8DUVPiVJrfp2v-16g_2Dvr5QkH";
export const supabase = createClient(supabaseUrl, supabaseKey);
