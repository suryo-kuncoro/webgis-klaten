import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";

/**
 * Legend dengan inline styling
 * Tidak perlu file CSS eksternal.
 */
export default function Legend() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "");
      ReactDOM.createRoot(div).render(
        <div
          style={{
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            fontSize: "0.9rem",
          }}
        >
          <h4 style={{ margin: "0 0 0.5rem 0" }}>Legenda</h4>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
            <div style={{ width: 15, height: 15, background: "#1e90ff", marginRight: 5 }}></div>
            Kecamatan
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
            <div style={{ width: 15, height: 15, background: "#ffa500", marginRight: 5 }}></div>
            Desa
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
            <div style={{ width: 15, height: 15, background: "#e74c3c", marginRight: 5 }}></div>
            UMKM
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
            <div style={{ width: 15, height: 15, background: "#2ecc71", marginRight: 5 }}></div>
            Wisata
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 15, height: 15, background: "#27ae60", marginRight: 5 }}></div>
            Pertanian
          </div>
        </div>
      );
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
