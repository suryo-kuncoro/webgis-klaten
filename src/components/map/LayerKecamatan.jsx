import { GeoJSON } from "react-leaflet";

/**
 * LayerKecamatan
 * Menampilkan data polygon kecamatan dalam bentuk GeoJSON.
 * Props:
 *  - data: FeatureCollection GeoJSON dari tabel/view kecamatan
 */
export default function LayerKecamatan({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={{
        color: "#1e90ff",      // warna garis polygon
        weight: 2,             // ketebalan garis
        fillOpacity: 0.2       // transparansi isi
      }}
      onEachFeature={(feature, layer) => {
        const { nama, kepadatan, jumlah_penduduk, luas } = feature.properties;
        layer.bindPopup(
          `<strong>${nama}</strong><br/>
           Luas: ${luas ?? "-"} km²<br/>
           Penduduk: ${jumlah_penduduk ?? "-"} jiwa<br/>
           Kepadatan: ${kepadatan ?? "-"} jiwa/km²`
        );
      }}
    />
  );
}
