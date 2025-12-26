import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import AppLayout from './AppLayout';

// Mock child components to isolate AppLayout
jest.mock('./Sidebar', () => (props) => (
  <div data-testid="sidebar" {...props}>
    Sidebar
  </div>
));
jest.mock('./DetailPanel', () => (props) => (
  <div data-testid="detail-panel" {...props}>
    DetailPanel
  </div>
));
jest.mock('./MapView', () => (props) => (
  <div data-testid="map-view" {...props}>
    MapView
  </div>
));

describe('AppLayout Component', () => {
  beforeEach(() => {
    render(<AppLayout />);
  });

  it('should render all main components initially', () => {
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('map-view')).toBeInTheDocument();
    expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
  });

  it('should render toggle buttons with initial text', () => {
    expect(screen.getByRole('button', { name: 'Hide Sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide Detail' })).toBeInTheDocument();
  });

  it('should have sidebar and detail panel open by default', () => {
    // The parent div of Sidebar has the 'open' class
    expect(screen.getByTestId('sidebar').parentElement).toHaveClass('sidebar open');
    expect(screen.getByTestId('detail-panel').parentElement).toHaveClass('detail open');
  });

  describe('Sidebar Toggle', () => {
    it('should hide the sidebar when the toggle button is clicked', () => {
      const toggleButton = screen.getByRole('button', { name: 'Hide Sidebar' });
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('sidebar').parentElement).toHaveClass('closed');
      expect(screen.getByTestId('sidebar').parentElement).not.toHaveClass('open');
      expect(screen.getByRole('button', { name: 'Show Sidebar' })).toBeInTheDocument();
    });

    it('should show the sidebar again after a second click', () => {
      const toggleButton = screen.getByRole('button', { name: 'Hide Sidebar' });
      fireEvent.click(toggleButton); // Hide
      fireEvent.click(toggleButton); // Show

      expect(screen.getByTestId('sidebar').parentElement).toHaveClass('open');
      expect(screen.getByTestId('sidebar').parentElement).not.toHaveClass('closed');
      expect(screen.getByRole('button', { name: 'Hide Sidebar' })).toBeInTheDocument();
    });
  });

  describe('Detail Panel Toggle', () => {
    it('should hide the detail panel when the toggle button is clicked', () => {
      const toggleButton = screen.getByRole('button', { name: 'Hide Detail' });
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('detail-panel').parentElement).toHaveClass('closed');
      expect(screen.getByTestId('detail-panel').parentElement).not.toHaveClass('open');
      expect(screen.getByRole('button', { name: 'Show Detail' })).toBeInTheDocument();
    });

    it('should show the detail panel again after a second click', () => {
      const toggleButton = screen.getByRole('button', { name: 'Hide Detail' });
      fireEvent.click(toggleButton); // Hide
      fireEvent.click(toggleButton); // Show

      expect(screen.getByTestId('detail-panel').parentElement).toHaveClass('open');
      expect(screen.getByTestId('detail-panel').parentElement).not.toHaveClass('closed');
      expect(screen.getByRole('button', { name: 'Hide Detail' })).toBeInTheDocument();
    });
  });
});
