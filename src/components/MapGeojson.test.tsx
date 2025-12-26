import { render, screen, waitFor } from '@testing-library/react';
import MapGeojson from './MapGeojson';

// Mock react-leaflet
jest.mock('react-leaflet');

// Mock leaflet
jest.mock('leaflet', () => ({
  circleMarker: jest.fn(),
  divIcon: jest.fn(),
  geoJSON: jest.fn(),
}));

const mockUmkmGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.6, -7.7] },
      properties: { nama: 'UMKM A', jenis: 'Kuliner', alamat: 'Jl. A' },
    },
  ],
};

const mockKecamatanGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.5, -7.6],
            [110.7, -7.6],
            [110.7, -7.8],
            [110.5, -7.8],
            [110.5, -7.6],
          ],
        ],
      },
      properties: { nama: 'Kecamatan X', kepadatan: 1000 },
    },
  ],
};

beforeEach(() => {
  // Mock global fetch
  global.fetch = jest.fn((url) => {
    if (url.toString().includes('umkm_geojson')) {
      return Promise.resolve({
        json: () => Promise.resolve([{ geojson: mockUmkmGeojson }]),
      });
    }
    if (url.toString().includes('kecamatan_geojson')) {
      return Promise.resolve({
        json: () => Promise.resolve([{ geojson: mockKecamatanGeojson }]),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve([]) });
  }) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders map container and tile layer initially', () => {
  render(<MapGeojson />);
  expect(screen.getByTestId('map-container')).toBeInTheDocument();
  expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
});

test('does not render GeoJSON layers initially', () => {
  render(<MapGeojson />);
  expect(screen.queryByTestId('geojson-layer')).not.toBeInTheDocument();
});

test('fetches and renders GeoJSON layers', async () => {
  render(<MapGeojson />);

  await waitFor(() => {
    expect(screen.getAllByTestId('geojson-layer')).toHaveLength(2);
  });
});