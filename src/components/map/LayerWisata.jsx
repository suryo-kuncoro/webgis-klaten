import { GeoJSON } from "react-leaflet";
import L from "leaflet";

/**
 * LayerWisata
 * Menampilkan data wisata (point) dalam bentuk GeoJSON.
 * Props:
 *  - data: FeatureCollection GeoJSON dari tabel/view wisata
 */
export default function LayerWisata({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      // setiap point ditampilkan sebagai circle marker hijau
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          color: "#2ecc71",     // hijau
          fillColor: "#2ecc71",
          fillOpacity: 0.8
        })
      }
      onEachFeature={(feature, layer) => {
        const { nama, jenis, alamat } = feature.properties;
        layer.bindPopup(
          `<strong>${nama}</strong><br/>
           ${jenis ?? "-"}<br/>
           ${alamat ?? "-"}`
        );
      }}
    />
  );
}
