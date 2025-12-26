import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Supabase config
const supabaseUrl = "https://qrubqwrsgljqlucygnef.supabase.co";
const supabaseKey = "sb_publishable_6QEWO8DUVPiVJrfp2v-16g_2Dvr5QkH";

// Fetch GeoJSON from Supabase
async function fetchGeojson(viewName: string): Promise<any> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${viewName}?select=geojson`, {
      headers: {
        apikey: supabaseKey, // gunakan hanya apikey untuk anon/publishable key
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${viewName}: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    // Jika kosong
    if (!Array.isArray(json) || json.length === 0) return null;

    // Gabungkan semua baris menjadi FeatureCollection
    const features = json
      .map((row: any) => (typeof row.geojson === 'string' ? JSON.parse(row.geojson) : row.geojson))
      .filter(Boolean);

    if (features.length === 0) return null;

    return {
      type: 'FeatureCollection',
      features,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function MapGeojson() {
  const [geojsonUmkm, setGeojsonUmkm] = useState<any | null>(null);
  const [geojsonKecamatan, setGeojsonKecamatan] = useState<any | null>(null);

  useEffect(() => {
    fetchGeojson("umkm_geojson").then(setGeojsonUmkm);
    fetchGeojson("kecamatan_geojson").then(setGeojsonKecamatan);
  }, []);

  return (
    <MapContainer center={[-7.705, 110.603]} zoom={13} style={{ height: "100vh", width: "100%vw" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* UMKM Point Layer */}
      {geojsonUmkm && (
        <GeoJSON
          data={geojsonUmkm}
          pointToLayer={(feature, latlng) =>
            L.circleMarker(latlng, { radius: 6, color: "#e74c3c" })
          }
          onEachFeature={(feature, layer) => {
            const { nama = "-", jenis = "-", alamat = "-" } = feature.properties || {};
            layer.bindPopup(`<strong>${nama}</strong><br/>${jenis}<br/>${alamat}`);
          }}
        />
      )}

      {/* Kecamatan Polygon Layer */}
      {geojsonKecamatan && (
        <GeoJSON
          data={geojsonKecamatan}
          style={{ color: "#1e90ff", weight: 2, fillOpacity: 0.2 }}
          onEachFeature={(feature, layer) => {
            const { nama = "-", kepadatan = "-" } = feature.properties || {};
            layer.bindPopup(`<strong>${nama}</strong><br/>Kepadatan: ${kepadatan}`);
          }}
        />
      )}
    </MapContainer>
  );
}