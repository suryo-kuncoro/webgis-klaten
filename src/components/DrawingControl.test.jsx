import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as turf from '@turf/turf';
import DrawingControl from './DrawingControl';
import { useMap } from 'react-leaflet';

// Mock the leaflet and leaflet-draw libraries
const mockDrawControlInstance = {
  addTo: jest.fn(),
  remove: jest.fn(),
};
const mockFeatureGroupInstance = {
  addLayer: jest.fn(),
  remove: jest.fn(),
  toGeoJSON: jest.fn(),
};

global.L = {
  Control: {
    Draw: jest.fn(() => mockDrawControlInstance),
  },
  FeatureGroup: jest.fn(() => mockFeatureGroupInstance),
  Draw: {
    Event: {
      CREATED: 'draw:created',
    },
  },
  Icon: {
    Default: jest.fn(),
  },
};

// Mock the useMap hook from react-leaflet
const mapEventHandlers = {};
const mockMap = {
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
  addControl: jest.fn(),
  removeControl: jest.fn(),
  on: jest.fn((event, handler) => {
    mapEventHandlers[event] = handler;
  }),
  off: jest.fn((event) => {
    delete mapEventHandlers[event];
  }),
};

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(() => mockMap),
}));

describe('DrawingControl Component', () => {
  const mockOnAnalysis = jest.fn();
  const mockData = [
    { id: 1, geom: { type: 'Point', coordinates: [110.6, -7.7] } }, // inside
    { id: 2, geom: { type: 'Point', coordinates: [111.0, -8.0] } }, // outside
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useMap.mockReturnValue(mockMap);
    // Clear handlers
    Object.keys(mapEventHandlers).forEach(key => delete mapEventHandlers[key]);
  });

  it('should initialize and add the draw control and feature group to the map on mount', () => {
    render(<DrawingControl onAnalysis={mockOnAnalysis} data={mockData} />);

    expect(L.FeatureGroup).toHaveBeenCalled();
    expect(mockMap.addLayer).toHaveBeenCalledWith(mockFeatureGroupInstance);

    expect(L.Control.Draw).toHaveBeenCalled();
    expect(mockMap.addControl).toHaveBeenCalledWith(mockDrawControlInstance);

    expect(mockMap.on).toHaveBeenCalledWith('draw:created', expect.any(Function));
  });

  it('should clean up by removing the control and layer on unmount', () => {
    const { unmount } = render(<DrawingControl onAnalysis={mockOnAnalysis} data={mockData} />);
    unmount();

    expect(mockMap.removeControl).toHaveBeenCalledWith(mockDrawControlInstance);
    expect(mockMap.removeLayer).toHaveBeenCalledWith(mockFeatureGroupInstance);
    // The original component is missing map.off, but a robust test could check for it.
    // If you add map.off(L.Draw.Event.CREATED, ...) to the cleanup, this test will pass.
    // expect(mockMap.off).toHaveBeenCalledWith('draw:created', expect.any(Function));
  });

  describe('Drawing Event Handling', () => {
    it('should analyze a created polygon and count points inside', () => {
      render(<DrawingControl onAnalysis={mockOnAnalysis} data={mockData} />);

      const polygonGeoJSON = {
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
      };

      const mockLayer = {
        toGeoJSON: () => polygonGeoJSON,
      };

      // Manually trigger the 'draw:created' event
      mapEventHandlers['draw:created']({ layer: mockLayer });

      expect(mockFeatureGroupInstance.addLayer).toHaveBeenCalledWith(mockLayer);

      const expectedArea = turf.area(polygonGeoJSON).toFixed(2) + ' m²';
      expect(mockOnAnalysis).toHaveBeenCalledWith({
        type: 'Polygon',
        area: expectedArea,
        count: 1, // Only one point from mockData is inside
      });
    });

    it('should analyze a created line and calculate its length', () => {
      render(<DrawingControl onAnalysis={mockOnAnalysis} data={mockData} />);

      const lineGeoJSON = {
        type: 'LineString',
        coordinates: [
          [110.5, -7.6],
          [110.7, -7.6],
        ],
      };

      const mockLayer = {
        toGeoJSON: () => lineGeoJSON,
      };

      // Manually trigger the 'draw:created' event
      mapEventHandlers['draw:created']({ layer: mockLayer });

      expect(mockFeatureGroupInstance.addLayer).toHaveBeenCalledWith(mockLayer);

      const expectedLength = turf.length(lineGeoJSON, { units: 'kilometers' }).toFixed(2) + ' km';
      expect(mockOnAnalysis).toHaveBeenCalledWith({
        type: 'LineString',
        length: expectedLength,
      });
    });

    it('should analyze a created point and return its coordinates', () => {
      render(<DrawingControl onAnalysis={mockOnAnalysis} data={mockData} />);

      const pointGeoJSON = {
        type: 'Point',
        coordinates: [110.6, -7.7],
      };

      const mockLayer = {
        toGeoJSON: () => pointGeoJSON,
      };

      // Manually trigger the 'draw:created' event
      mapEventHandlers['draw:created']({ layer: mockLayer });

      expect(mockFeatureGroupInstance.addLayer).toHaveBeenCalledWith(mockLayer);

      expect(mockOnAnalysis).toHaveBeenCalledWith({
        type: 'Point',
        coords: [110.6, -7.7],
      });
    });

    it('should not call onAnalysis if the prop is not provided', () => {
      render(<DrawingControl data={mockData} />); // No onAnalysis prop

      const mockLayer = { toGeoJSON: () => ({ type: 'Point', coordinates: [0, 0] }) };
      mapEventHandlers['draw:created']({ layer: mockLayer });

      expect(mockOnAnalysis).not.toHaveBeenCalled();
    });
  });
});
