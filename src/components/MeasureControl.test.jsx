import React from 'react';
import { render, cleanup } from '@testing-library/react';
import MeasureControl from './MeasureControl';
import { useMap } from 'react-leaflet';

// Mock the leaflet-measure plugin, which extends the global L object
const mockMeasureControlInstance = {
  addTo: jest.fn(),
  remove: jest.fn(),
};
global.L = {
  Control: {
    Measure: jest.fn(() => mockMeasureControlInstance),
  },
};

// Mock the useMap hook from react-leaflet
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  dragging: { enable: jest.fn(), disable: jest.fn() },
  doubleClickZoom: { enable: jest.fn(), disable: jest.fn() },
  scrollWheelZoom: { enable: jest.fn(), disable: jest.fn() },
  boxZoom: { enable: jest.fn(), disable: jest.fn() },
  keyboard: { enable: jest.fn(), disable: jest.fn() },
  touchZoom: { enable: jest.fn(), disable: jest.fn() },
  _container: { style: { cursor: '' } },
};

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(() => mockMap),
}));

describe('MeasureControl Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useMap.mockReturnValue(mockMap);
  });

  it('should not do anything if map is not available', () => {
    useMap.mockReturnValue(null);
    render(<MeasureControl />);
    expect(L.Control.Measure).not.toHaveBeenCalled();
  });

  it('should initialize and add the measure control to the map on mount', () => {
    render(<MeasureControl />);

    // Check if the control was instantiated with the correct options
    expect(L.Control.Measure).toHaveBeenCalledWith({
      position: 'topleft',
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      activeColor: '#db4a29',
      completedColor: '#9b2d14',
    });

    // Check if the control was added to the map
    expect(mockMeasureControlInstance.addTo).toHaveBeenCalledWith(mockMap);
  });

  it('should register event listeners on the map', () => {
    render(<MeasureControl />);

    expect(mockMap.on).toHaveBeenCalledWith('toolbar:activated', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('toolbar:deactivated', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('measurestart', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith('measurefinish', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledTimes(4);
  });

  it('should disable map interactions when measure tool is activated', () => {
    render(<MeasureControl />);

    // Find the 'toolbar:activated' event handler and call it
    const onActivate = mockMap.on.mock.calls.find(call => call[0] === 'toolbar:activated')[1];
    onActivate();

    expect(mockMap.dragging.disable).toHaveBeenCalled();
    expect(mockMap.doubleClickZoom.disable).toHaveBeenCalled();
    expect(mockMap.scrollWheelZoom.disable).toHaveBeenCalled();
    expect(mockMap.boxZoom.disable).toHaveBeenCalled();
    expect(mockMap.keyboard.disable).toHaveBeenCalled();
    expect(mockMap.touchZoom.disable).toHaveBeenCalled();
    expect(mockMap._container.style.cursor).toBe('crosshair');
  });

  it('should enable map interactions when measure tool is deactivated', () => {
    render(<MeasureControl />);

    // Find the 'toolbar:deactivated' event handler and call it
    const onDeactivate = mockMap.on.mock.calls.find(call => call[0] === 'toolbar:deactivated')[1];
    onDeactivate();

    expect(mockMap.dragging.enable).toHaveBeenCalled();
    expect(mockMap.doubleClickZoom.enable).toHaveBeenCalled();
    expect(mockMap.scrollWheelZoom.enable).toHaveBeenCalled();
    expect(mockMap.boxZoom.enable).toHaveBeenCalled();
    expect(mockMap.keyboard.enable).toHaveBeenCalled();
    expect(mockMap.touchZoom.enable).toHaveBeenCalled();
    expect(mockMap._container.style.cursor).toBe('');
  });

  it('should clean up by removing the control and event listeners on unmount', () => {
    const { unmount } = render(<MeasureControl />);
    unmount();

    // Check if event listeners were removed
    expect(mockMap.off).toHaveBeenCalledWith('toolbar:activated', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('toolbar:deactivated', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('measurestart', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith('measurefinish', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledTimes(4);

    // Check if the control was removed from the map
    expect(mockMeasureControlInstance.remove).toHaveBeenCalled();
  });
});