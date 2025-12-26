import { supabase } from "./supabaseClient";

/**
 * Utility untuk membentuk FeatureCollection dari hasil query Supabase
 */
function toFeatureCollection(rows, propsMapper) {
  return {
    type: "FeatureCollection",
    features: rows.map((row) => ({
      type: "Feature",
      geometry: row.geom, // sudah JSON dari ST_AsGeoJSON
      properties: propsMapper(row),
    })),
  };
}

/**
 * Ambil data kecamatan
 */
export async function getKecamatanGeoJSON() {
  const { data, error } = await supabase
    .from("kecamatan_geojson")
    .select("id, kode, nama, luas, jumlah_desa, jumlah_penduduk, kepadatan, geom");
  if (error) throw error;

  return toFeatureCollection(data, (r) => ({
    id: r.id,
    kode: r.kode,
    nama: r.nama,
    luas: r.luas,
    jumlah_desa: r.jumlah_desa,
    jumlah_penduduk: r.jumlah_penduduk,
    kepadatan: r.kepadatan,
  }));
}

/**
 * Ambil data desa
 */
export async function getDesaGeoJSON() {
  const { data, error } = await supabase
    .from("desa_geojson")
    .select("id, kecamatan_id, nama, geom");
  if (error) throw error;

  return toFeatureCollection(data, (r) => ({
    id: r.id,
    kecamatan_id: r.kecamatan_id,
    nama: r.nama,
  }));
}

/**
 * Ambil data UMKM
 */
export async function getUmkmGeoJSON() {
  const { data, error } = await supabase
    .from("umkm_geojson")
    .select("id, nama, jenis, alamat, geom");
  if (error) throw error;

  return toFeatureCollection(data, (r) => ({
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    alamat: r.alamat,
  }));
}

/**
 * Ambil data Wisata
 */
export async function getWisataGeoJSON() {
  const { data, error } = await supabase
    .from("wisata_geojson")
    .select("id, nama, jenis, alamat, geom");
  if (error) throw error;

  return toFeatureCollection(data, (r) => ({
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    alamat: r.alamat,
  }));
}

/**
 * Ambil data Pertanian
 */
export async function getPertanianGeoJSON() {
  const { data, error } = await supabase
    .from("pertanian_geojson")
    .select("id, nama, jenis, alamat, geom");
  if (error) throw error;

  return toFeatureCollection(data, (r) => ({
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    alamat: r.alamat,
  }));
}
