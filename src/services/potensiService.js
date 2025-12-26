import { supabase } from './supabaseClient';

export async function getUMKM() {
  const { data, error } = await supabase
    .from('umkm')
    .select('id,nama,jenis,alamat,geom');
  if (error) throw error;
  return data;
}
