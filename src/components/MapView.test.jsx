import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MapView from './MapView';

// Mock react-leaflet components
jest.mock('react-leaflet', () => {
  const originalModule = jest.requireActual('react-leaflet');
  const LayersControl = ({ children }) => <div data-testid="layers-control">{children}</div>;
  LayersControl.BaseLayer = ({ name, children }) => <div data-testid={`baselayer-${name}`}>{children}</div>;
  LayersControl.Overlay = ({ name, children }) => <div data-testid={`overlay-${name}`}>{children}</div>;

  return {
    ...originalModule,
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: (props) => <div data-testid="tile-layer" data-url={props.url}></div>,
    LayersControl,
  };
});

// Mock custom child components
jest.mock('./MeasureControl', () => () => <div data-testid="measure-control"></div>);
jest.mock('./GeocoderControl', () => () => <div data-testid="geocoder-control"></div>);
jest.mock('./DrawingControl', () => (props) => <div data-testid="drawing-control" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerKecamatan', () => (props) => <div data-testid="layer-kecamatan" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerDesa', () => (props) => <div data-testid="layer-desa" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerUMKM', () => (props) => <div data-testid="layer-umkm" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerWisata', () => (props) => <div data-testid="layer-wisata" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerPertanian', () => (props) => <div data-testid="layer-pertanian" data-props={JSON.stringify(props)}></div>);
jest.mock('./map/LayerHeatmap', () => (props) => <div data-testid={`layer-heatmap-${props.kategori}`} data-props={JSON.stringify(props)}></div>);
jest.mock('./map/Legend', () => () => <div data-testid="legend"></div>);

describe('MapView Component', () => {
  const mockData = { id: 1, name: 'Test Data' };
  const mockDataKecamatan = { id: 1, name: 'Cawas' };
  const mockDataDesa = { id: 1, name: 'Tugu' };
  const mockDataUmkm = { id: 1, type: 'umkm' };
  const mockDataWisata = { id: 1, type: 'wisata' };
  const mockDataPertanian = { id: 1, type: 'pertanian' };
  const mockSelectedItem = { id: 2, name: 'Selected Item' };
  const mockOnSelectItem = jest.fn();

  beforeEach(() => {
    render(
      <MapView
        data={[mockData]}
        dataKecamatan={[mockDataKecamatan]}
        dataDesa={[mockDataDesa]}
        dataUmkm={[mockDataUmkm]}
        dataWisata={[mockDataWisata]}
        dataPertanian={[mockDataPertanian]}
        selectedItem={mockSelectedItem}
        onSelectItem={mockOnSelectItem}
      />
    );
  });

  it('should render the MapContainer and its main controls', () => {
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('measure-control')).toBeInTheDocument();
    expect(screen.getByTestId('geocoder-control')).toBeInTheDocument();
    expect(screen.getByTestId('drawing-control')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should render the LayersControl with all base layers', () => {
    expect(screen.getByTestId('layers-control')).toBeInTheDocument();
    expect(screen.getByTestId('baselayer-OpenStreetMap')).toBeInTheDocument();
    expect(screen.getByTestId('baselayer-Google Satellite')).toBeInTheDocument();
    expect(screen.getByTestId('baselayer-Carto Light')).toBeInTheDocument();
  });

  it('should render all overlay layers', () => {
    expect(screen.getByTestId('overlay-Kecamatan')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Desa')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-UMKM (GeoJSON)')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Wisata (GeoJSON)')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Pertanian')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Heatmap UMKM')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Heatmap Wisata')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-Heatmap Pertanian')).toBeInTheDocument();
  });

  it('should pass correct props to LayerKecamatan', () => {
    const layer = screen.getByTestId('layer-kecamatan');
    const props = JSON.parse(layer.getAttribute('data-props'));
    expect(props.data).toEqual([mockDataKecamatan]);
  });

  it('should pass correct props to LayerUMKM', () => {
    const layer = screen.getByTestId('layer-umkm');
    const props = JSON.parse(layer.getAttribute('data-props'));
    expect(props.data).toEqual([mockDataUmkm]);
  });

  it('should pass correct props to LayerPertanian', () => {
    const layer = screen.getByTestId('layer-pertanian');
    const props = JSON.parse(layer.getAttribute('data-props'));
    expect(props.data).toEqual([mockDataPertanian]);
    expect(props.selectedItem).toEqual(mockSelectedItem);
    // Note: Functions can't be serialized in JSON, so we just check for its existence
    expect(props).toHaveProperty('onSelectItem');
  });

  it('should pass correct props to DrawingControl', () => {
    const control = screen.getByTestId('drawing-control');
    const props = JSON.parse(control.getAttribute('data-props'));
    expect(props.data).toEqual([mockData]);
    expect(props).toHaveProperty('onAnalysis');
  });

  it('should pass correct props to each LayerHeatmap', () => {
    const heatmapUMKM = screen.getByTestId('layer-heatmap-umkm');
    const propsUMKM = JSON.parse(heatmapUMKM.getAttribute('data-props'));
    expect(propsUMKM.data).toEqual([mockData]);
    expect(propsUMKM.kategori).toBe('umkm');

    const heatmapWisata = screen.getByTestId('layer-heatmap-wisata');
    const propsWisata = JSON.parse(heatmapWisata.getAttribute('data-props'));
    expect(propsWisata.data).toEqual([mockData]);
    expect(propsWisata.kategori).toBe('wisata');
  });
});
