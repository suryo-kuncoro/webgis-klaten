import { GeoJSON } from "react-leaflet";
import L from "leaflet";

/**
 * LayerPertanian
 * Menampilkan data pertanian sebagai GeoJSON point layer.
 */
export default function LayerPertanian({ dataPertanian }) {
  if (!dataPertanian) return null;

  return (
    <GeoJSON
      data={dataPertanian}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          color: "#27ae60",   // hijau tua untuk pertanian
          fillColor: "#27ae60",
          fillOpacity: 0.8,
        })
      }
      onEachFeature={(feature, layer) => {
        const { nama, jenis, alamat } = feature.properties;
        layer.bindPopup(
          `<strong>${nama}</strong><br/>${jenis || ""}<br/>${alamat || ""}`
        );
      }}
    />
  );
}
