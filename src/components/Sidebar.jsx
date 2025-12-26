import PotensiCard from './PotensiCard';
import "./Sidebar.css";

export default function Sidebar({
  filters = { kategori: "", kecamatan: "", jenis: "", nama: "" },
  onFilterChange = () => {},
  data = [],
  onSelectNama = () => {},
  radius = 0,
  setRadius = () => {}
}) {
  return (
    <div className="sidebar">
      <h2>Filter Potensi</h2>

      {/* Filter kategori */}
      <div className="filter-group">
        <label>Kategori</label>
        <select
          value={filters.kategori}
          onChange={(e) => onFilterChange({ ...filters, kategori: e.target.value })}
        >
          <option value="">Semua</option>
          <option value="umkm">UMKM</option>
          <option value="wisata">Wisata</option>
          <option value="pertanian">Pertanian</option>
        </select>
      </div>

      {/* Filter kecamatan */}
      <div className="filter-group">
        <label>Kecamatan</label>
        <select
          value={filters.kecamatan}
          onChange={(e) => onFilterChange({ ...filters, kecamatan: e.target.value })}
        >
          <option value="">Semua</option>
          <option value="Cawas">Cawas</option>
          <option value="Wedi">Wedi</option>
          <option value="Delanggu">Delanggu</option>
        </select>
      </div>

      {/* Filter jenis */}
      <div className="filter-group">
        <label>Jenis</label>
        <select
          value={filters.jenis}
          onChange={(e) => onFilterChange({ ...filters, jenis: e.target.value })}
        >
          <option value="">Semua</option>
          <option value="Kuliner">Kuliner</option>
          <option value="Kerajinan">Kerajinan</option>
          <option value="Edukasi">Edukasi</option>
        </select>
      </div>

      {/* Input radius */}
      <div className="filter-group">
        <label>Radius (meter)</label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          placeholder="Contoh: 1000"
        />
      </div>

      {/* Pencarian nama */}
      <div className="filter-group">
        <label>Cari Nama</label>
        <input
          type="text"
          value={filters.nama}
          onChange={(e) => onFilterChange({ ...filters, nama: e.target.value })}
          placeholder="Ketik nama UMKM/Wisata..."
        />
      </div>

      {/* Autocomplete suggestion */}
      {filters.nama && (
        <div className="autocomplete">
          {data
            .filter((item) =>
              item?.nama?.toLowerCase().includes(filters.nama.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.id}
                className="autocomplete-item"
                onClick={() => {
                  onSelectNama(item.nama);
                  onFilterChange({ ...filters, nama: item.nama });
                }}
              >
                <strong>{item.nama}</strong><br />
                <span>{item.jenis} • {item.alamat}</span>
              </div>
            ))}
        </div>
      )}

      {/* Daftar Potensi */}
      <h2>Daftar Potensi</h2>
      <div className="potensi-list">
        {data.length === 0 ? (
          <p className="no-data">Tidak ada data</p>
        ) : (
          data.map((item) => (
            <PotensiCard
              key={item.id}
              item={item}
              onSelect={onSelectNama}
            />
          ))
        )}
      </div>
    </div>
  );
}
