import { GeoJSON } from "react-leaflet";

/**
 * LayerDesa
 * Menampilkan data polygon desa dalam bentuk GeoJSON.
 * Props:
 *  - data: FeatureCollection GeoJSON dari tabel/view desa
 */
export default function LayerDesa({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={{
        color: "#ffa500",     // warna oranye
        weight: 1,            // garis lebih tipis
        fillOpacity: 0.1      // isi lebih transparan
      }}
      onEachFeature={(feature, layer) => {
        const { nama } = feature.properties;
        layer.bindPopup(`<strong>${nama}</strong>`);
      }}
    />
  );
}
