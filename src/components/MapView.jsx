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
  selectedItem,
  onSelectItem
}) {
  return (
    <MapContainer
      center={[-7.705, 110.603]}
      zoom={18}
      style={{ height: "100vh", width: "100vw" }}
    >
      <MeasureControl />
      <GeocoderControl />
      <DrawingControl data={data}
        onAnalysis={(result) => console.log("Hasil analisis:", result)} 
      />

      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </BaseLayer>
        <BaseLayer name="Google Satellite">
          <TileLayer url="http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        </BaseLayer>
        <BaseLayer name="Carto Light">
          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
        </BaseLayer>

        <Overlay checked name="Kecamatan">
          <LayerKecamatan data={dataKecamatan} />
        </Overlay>

        <Overlay name="Desa">
          <LayerDesa data={dataDesa} />
        </Overlay>

        <Overlay checked name="UMKM (GeoJSON)">
          <LayerUMKM data={dataUmkm} />
        </Overlay>

        <Overlay checked name="Wisata (GeoJSON)">
          <LayerWisata data={dataWisata} />
        </Overlay>

        <Overlay checked name="Pertanian">
          <LayerPertanian
            data={dataPertanian}
            selectedItem={selectedItem}
            onSelectItem={onSelectItem}
          />
        </Overlay>

        <Overlay name="Heatmap UMKM">
          <LayerHeatmap data={data} kategori="umkm" />
        </Overlay>
        <Overlay name="Heatmap Wisata">
          <LayerHeatmap data={data} kategori="wisata" />
        </Overlay>
        <Overlay name="Heatmap Pertanian">
          <LayerHeatmap data={data} kategori="pertanian" />
        </Overlay>
      </LayersControl>

      <Legend />
    </MapContainer>
  );
}
