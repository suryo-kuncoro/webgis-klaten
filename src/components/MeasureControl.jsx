import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-measure";
import L from "leaflet";

export default function MeasureControl() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const measureControl = new L.Control.Measure({
      position: "topleft",
      primaryLengthUnit: "meters",
      secondaryLengthUnit: "kilometers",
      primaryAreaUnit: "sqmeters",
      secondaryAreaUnit: "hectares",
      activeColor: "#db4a29",
      completedColor: "#9b2d14",
    });

    measureControl.addTo(map);

    const disableInteractions = () => {
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.touchZoom) map.touchZoom.disable();
      map._container.style.cursor = "crosshair"; // ubah cursor
    };

    const enableInteractions = () => {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if (map.touchZoom) map.touchZoom.enable();
      map._container.style.cursor = ""; // kembali default
    };

    // Event dari leaflet-measure toolbar
    map.on("toolbar:activated", disableInteractions);
    map.on("toolbar:deactivated", enableInteractions);

    // fallback jika plugin tetap kirim measurestart/finish
    map.on("measurestart", disableInteractions);
    map.on("measurefinish", enableInteractions);

    return () => {
      map.off("toolbar:activated", disableInteractions);
      map.off("toolbar:deactivated", enableInteractions);
      map.off("measurestart", disableInteractions);
      map.off("measurefinish", enableInteractions);
      measureControl.remove();
    };
  }, [map]);

  return null;
}
