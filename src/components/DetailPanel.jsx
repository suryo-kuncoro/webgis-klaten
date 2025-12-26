import { useState } from "react";
import "./DetailPanel.css";

export default function DetailPanel({ selectedItem }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`detail-panel ${isOpen ? "open" : "closed"}`}>
      {/* Tombol toggle di sisi kiri panel */}
      <button className="toggle-btn right" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "⮞" : "⮜"}
      </button>

      {isOpen && (
        <>
          <h2>Detail Potensi</h2>
          {!selectedItem ? (
            <p className="no-selection">
              Pilih marker di peta atau nama dari daftar untuk melihat detail.
            </p>
          ) : (
            <div className="detail-card">
              <h3>{selectedItem.nama}</h3>

              {/* Foto */}
              {selectedItem.foto && (
                <img
                  src={selectedItem.foto}
                  alt={selectedItem.nama}
                  className="detail-image"
                />
              )}

              <p><strong>Kategori:</strong> {selectedItem.kategori}</p>
              <p><strong>Jenis:</strong> {selectedItem.jenis}</p>
              <p><strong>Alamat:</strong> {selectedItem.alamat}</p>

              {selectedItem.deskripsi && (
                <p><strong>Deskripsi:</strong> {selectedItem.deskripsi}</p>
              )}
              {selectedItem.kontak && (
                <p><strong>Kontak:</strong> {selectedItem.kontak}</p>
              )}
              {selectedItem.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={selectedItem.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedItem.website}
                  </a>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}