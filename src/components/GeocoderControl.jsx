import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import L from "leaflet";

export default function GeocoderControl() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // gunakan Nominatim sebagai geocoder default
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
      position: "topleft",
    })
      .on("markgeocode", function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

    return () => {
      geocoder.remove();
    };
  }, [map]);

  return null;
}
