import { GeoJSON } from "react-leaflet";
import L from "leaflet";

/**
 * LayerUMKM
 * Menampilkan data UMKM (point) dalam bentuk GeoJSON.
 * Props:
 *  - data: FeatureCollection GeoJSON dari tabel/view umkm
 */
export default function LayerUMKM({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      // setiap point ditampilkan sebagai circle marker
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          color: "#e74c3c",   // merah
          fillColor: "#e74c3c",
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
