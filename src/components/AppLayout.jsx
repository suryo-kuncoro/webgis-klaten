import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"; 
import Sidebar from "./Sidebar";
import DetailPanel from "./DetailPanel";
import MapView from "./MapView";
import "./Panel.css";

export default function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetail, setShowDetail] = useState(true);

  const [filters, setFilters] = useState({ kategori: "", kecamatan: "", jenis: "", nama: "" });
  const [data, setData] = useState([]);
  const [radius, setRadius] = useState(1000);

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "visible" }}>
      
      {/* MAPVIEW - Layer paling bawah */}
      <MapView
        filters={filters}
        data={data}
        radius={radius}
        onDataUpdate={setData}
      />

      {/* SIDEBAR - Melayang Kiri */}
      <div className={`sidebar ${showSidebar ? "open" : "closed"}`}>
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? (
            isMobile ? <ChevronDown /> : <ChevronLeft />
          ) : (
            isMobile ? <ChevronUp /> : <ChevronRight />
          )}
        </button>
        <div className="sidebar-content">
          <Sidebar
            filters={filters}
            onFilterChange={setFilters}
            data={data}
            radius={radius}
            setRadius={setRadius}
          />
        </div>
      </div>

      {/* DETAIL PANEL - Melayang Kanan */}
      <div className={`detail-panel ${showDetail ? "open" : "closed"}`}>
        <button 
          className="detail-toggle-btn" 
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? (
            isMobile ? <ChevronDown /> : <ChevronRight />
          ) : (
            isMobile ? <ChevronUp /> : <ChevronLeft />
          )}
        </button>
        <div className="detail-panel-content">
          <DetailPanel data={data} filters={filters} />
        </div>
      </div>

    </div>
  );
}
