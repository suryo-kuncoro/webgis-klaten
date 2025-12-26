import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import MeasureControl from "./MeasureControl";
import GeocoderControl from "./GeocoderControl";
import DrawingControl from "./DrawingControl";

import LayerKecamatan from "./map/LayerKecamatan";
import LayerDesa from "./map/LayerDesa";
import LayerUMKM from "./map/LayerUMKM";
import LayerWisata from "./map/LayerWisata";
import LayerPertanian from "./map/LayerPertanian";
import LayerHeatmap from "./map/LayerHeatmap";
import Legend from "./map/Legend";

const { BaseLayer, Overlay } = LayersControl;

export default function MapView({
  data,
  dataKecamatan,
  dataDesa,
  dataUmkm,
  dataWisata,
  dataPertanian,
  filters,
  radius,
  selectedItem,
  onSelectItem,
  onDataUpdate
}) {
  // Terapkan filter sederhana ke data (contoh: kategori, kecamatan, jenis, nama)
  const filteredData = data.filter((item) => {
    const matchKategori = !filters.kategori || item.kategori === filters.kategori;
    const matchKecamatan = !filters.kecamatan || item.kecamatan === filters.kecamatan;
    const matchJenis = !filters.jenis || item.jenis === filters.jenis;
    const matchNama = !filters.nama || item.nama.toLowerCase().includes(filters.nama.toLowerCase());
    return matchKategori && matchKecamatan && matchJenis && matchNama;
  });

  // Update data yang ditampilkan (opsional, untuk sinkronisasi ke AppLayout)
  if (onDataUpdate) {
    onDataUpdate(filteredData);
  }

  return (
    <MapContainer
      center={[-7.705, 110.603]}
      zoom={14}
      style={{ height: "100vh", width: "100vw" }}
    >
      <MeasureControl />
      <GeocoderControl />
      <DrawingControl
        data={filteredData}
        radius={radius}
        onAnalysis={(result) => console.log("Hasil analisis:", result)}
      />

      <LayersControl position="topright">
        {/* Base Layers */}
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </BaseLayer>
        <BaseLayer name="Google Satellite">
          <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        </BaseLayer>
        <BaseLayer name="Carto Light">
          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
        </BaseLayer>

        {/* Overlay Layers */}
        <Overlay checked name="Kecamatan">
          <LayerKecamatan data={dataKecamatan} />
        </Overlay>

        <Overlay name="Desa">
          <LayerDesa data={dataDesa} />
        </Overlay>

        <Overlay checked name="UMKM (GeoJSON)">
          <LayerUMKM
            data={dataUmkm}
            filters={filters}
            onSelectItem={onSelectItem}
            selectedItem={selectedItem}
          />
        </Overlay>

        <Overlay checked name="Wisata (GeoJSON)">
          <LayerWisata
            data={dataWisata}
            filters={filters}
            onSelectItem={onSelectItem}
            selectedItem={selectedItem}
          />
        </Overlay>

        <Overlay checked name="Pertanian">
          <LayerPertanian
            data={dataPertanian}
            filters={filters}
            selectedItem={selectedItem}
            onSelectItem={onSelectItem}
          />
        </Overlay>

        {/* Heatmaps */}
        <Overlay name="Heatmap UMKM">
          <LayerHeatmap data={filteredData} kategori="umkm" />
        </Overlay>
        <Overlay name="Heatmap Wisata">
          <LayerHeatmap data={filteredData} kategori="wisata" />
        </Overlay>
        <Overlay name="Heatmap Pertanian">
          <LayerHeatmap data={filteredData} kategori="pertanian" />
        </Overlay>
      </LayersControl>

      <Legend />
    </MapContainer>
  );
}