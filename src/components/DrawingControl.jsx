import { useMap } from "react-leaflet";
import { useEffect } from "react";
import * as turf from "@turf/turf";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import L from "leaflet";
import "./DrawingControl.css";

function DrawingControl({ onAnalysis, data }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polygon: {
          shapeOptions: {
            color: "var(--color-pertanian)", // hijau untuk polygon
            weight: 2,
          },
        },
        polyline: {
          shapeOptions: {
            color: "var(--color-wisata)", // oranye untuk garis
            weight: 3,
          },
        },
        rectangle: {
          shapeOptions: {
            color: "var(--color-kecamatan)", // biru untuk rectangle
            weight: 2,
          },
        },
        circle: {
          shapeOptions: {
            color: "var(--color-umkm)", // merah untuk circle
            weight: 2,
          },
        },
        marker: {
          icon: new L.Icon.Default(),
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      const geojson = layer.toGeoJSON();
      let result = {};

      if (geojson.geometry.type === "Polygon" || geojson.geometry.type === "MultiPolygon") {
        const area = turf.area(geojson); // m²
        result = { type: "Polygon", area: area.toFixed(2) + " m²" };

        const points = data.map((item) =>
          turf.point([...item.geom.coordinates].reverse())
        );
        const poly = turf.polygon(geojson.geometry.coordinates);
        const inside = points.filter((p) => turf.booleanPointInPolygon(p, poly));
        result.count = inside.length;
      }

      if (geojson.geometry.type === "LineString") {
        const length = turf.length(geojson, { units: "kilometers" });
        result = { type: "LineString", length: length.toFixed(2) + " km" };
      }

      if (geojson.geometry.type === "Point") {
        result = { type: "Point", coords: geojson.geometry.coordinates };
      }

      if (onAnalysis) onAnalysis(result);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onAnalysis, data]);

  return null;
}

export default DrawingControl;
