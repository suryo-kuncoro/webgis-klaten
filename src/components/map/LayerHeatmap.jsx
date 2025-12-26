import { GeoJSON } from "react-leaflet";

export default function KecamatanLayer({ dataKecamatan }) {
  if (!dataKecamatan) return null;

  return (
    <GeoJSON
      data={dataKecamatan}
      style={{ color: "#1e90ff", weight: 2, fillOpacity: 0.2 }}
      onEachFeature={(feature, layer) => {
        const { nama, kepadatan } = feature.properties;
        layer.bindPopup(`<strong>${nama}</strong><br/>Kepadatan: ${kepadatan}`);
      }}
    />
  );
}
