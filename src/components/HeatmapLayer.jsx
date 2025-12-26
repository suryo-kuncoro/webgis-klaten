import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Buat layer heatmap
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    // Bersihkan saat komponen unmount
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
