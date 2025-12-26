import "./PotensiCard.css";

export default function PotensiCard({ item, onSelect }) {
  return (
    <div
      className="potensi-card"
      onClick={() => onSelect(item.nama)}
    >
      {/* Foto thumbnail jika ada */}
      {item.foto && (
        <img
          src={item.foto}
          alt={item.nama}
          className="potensi-thumbnail"
        />
      )}

      <div className="potensi-info">
        <h4 className="potensi-title">{item.nama}</h4>
        <p className="potensi-meta">
          {item.jenis} • {item.kecamatan}
        </p>
        {item.alamat && (
          <p className="potensi-address">{item.alamat}</p>
        )}
      </div>
    </div>
  );
}

