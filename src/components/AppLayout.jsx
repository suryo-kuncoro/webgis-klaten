import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";
import DetailPanel from "./DetailPanel";
import MapView from "./MapView";
import "./Panel.css";

export default function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetail, setShowDetail] = useState(true);
  const [filters, setFilters] = useState({
    kategori: "",
    kecamatan: "",
    jenis: "",
    nama: ""
  });
  const [data, setData] = useState([]);
  const [radius, setRadius] = useState(1000);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive Handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-layout">
      {/* CSS INTERNAL - Menyatukan Panel.css ke dalam file */}
      <style>{`
        .app-layout {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #e5e7eb;
          font-family: 'Inter', sans-serif;
        }

        .map-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* SIDEBAR STYLING */
        .sidebar {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 280px;
          max-height: calc(100vh - 40px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 2000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.closed {
          transform: translateX(calc(-100% - 20px));
        }

        .sidebar-content {
          padding: 16px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        /* DETAIL PANEL STYLING */
        .detail-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 320px;
          max-height: calc(100vh - 40px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 2000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .detail-panel.closed {
          transform: translateX(calc(100% + 20px));
        }

        .detail-panel-content {
          padding: 16px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        /* TOGGLE BUTTONS */
        .sidebar-toggle-btn, .detail-toggle-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 60px;
          background: white;
          border: 1px solid #e5e5e5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2100;
          transition: all 0.2s ease;
          color: #666;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-toggle-btn { right: -40px; border-left: none; border-radius: 0 8px 8px 0; }
        .detail-toggle-btn { left: -40px; border-right: none; border-radius: 8px 0 0 8px; }

        .sidebar-toggle-btn:hover { right: -42px; background: #f9fafb; }
        .detail-toggle-btn:hover { left: -42px; background: #f9fafb; }

        /* LEAFLET OVERRIDES */
        .leaflet-container { z-index: 1 !important; }
        .leaflet-control-container { z-index: 500 !important; }

        /* SCROLLBAR */
        .sidebar-content::-webkit-scrollbar, .detail-panel-content::-webkit-scrollbar { width: 6px; }
        .sidebar-content::-webkit-scrollbar-thumb, .detail-panel-content::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1); border-radius: 10px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .sidebar {
            bottom: 0; top: auto; left: 0; right: 0; width: 100%;
            max-height: 50vh; border-radius: 16px 16px 0 0;
          }
          .sidebar.closed { transform: translateY(calc(100% - 30px)); }
          .sidebar-toggle-btn {
            top: -30px; left: 50%; right: auto; transform: translateX(-50%);
            width: 60px; height: 30px; border-radius: 8px 8px 0 0; border-bottom: none;
          }
          .detail-panel { display: none; }
        }
      `}</style>

      {/* Map Layer */}
      <div className="map-layer">
        <MapView
          filters={filters}
          data={data}
          radius={radius}
          onDataUpdate={setData}
          onSelectItem={setSelectedItem}
        />
      </div>

      {/* Sidebar Panel */}
      <div className={`sidebar ${showSidebar ? "open" : "closed"}`}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
        >
          {showSidebar 
            ? (isMobile ? <ChevronDown size={20} /> : <ChevronLeft size={20} />) 
            : (isMobile ? <ChevronUp size={20} /> : <ChevronRight size={20} />)
          }
        </button>
        
        <div className="sidebar-content">
          <Sidebar
            filters={filters}
            onFilterChange={setFilters}
            data={data}
            radius={radius}
            setRadius={setRadius}
            onSelectNama={(nama) => {
              const item = data.find((d) => d.nama === nama);
              setSelectedItem(item);
            }}
          />
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`detail-panel ${showDetail ? "open" : "closed"}`}>
        <button
          className="detail-toggle-btn"
          onClick={() => setShowDetail(!showDetail)}
          aria-label={showDetail ? "Close detail panel" : "Open detail panel"}
        >
          {showDetail 
            ? (isMobile ? <ChevronDown size={20} /> : <ChevronRight size={20} />) 
            : (isMobile ? <ChevronUp size={20} /> : <ChevronLeft size={20} />)
          }
        </button>
        
        <div className="detail-panel-content">
          <DetailPanel selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  );
}