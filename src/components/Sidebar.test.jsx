import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Sidebar from './Sidebar';

// Mock the child component to isolate the Sidebar
jest.mock('./PotensiCard', () => (props) => (
  <div data-testid="potensi-card" onClick={() => props.onSelect(props.item.nama)}>
    {props.item.nama}
  </div>
));

describe('Sidebar Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnSelectNama = jest.fn();
  const mockSetRadius = jest.fn();
  const mockData = [
    { id: 1, nama: 'Toko A', jenis: 'Kuliner', alamat: 'Jalan 1' },
    { id: 2, nama: 'Toko B', jenis: 'Kerajinan', alamat: 'Jalan 2' },
    { id: 3, nama: 'Warung C', jenis: 'Kuliner', alamat: 'Jalan 3' },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render all filter controls and an empty list by default', () => {
    render(<Sidebar />);
    expect(screen.getByLabelText('Kategori')).toBeInTheDocument();
    expect(screen.getByLabelText('Kecamatan')).toBeInTheDocument();
    expect(screen.getByLabelText('Jenis')).toBeInTheDocument();
    expect(screen.getByLabelText('Radius (meter)')).toBeInTheDocument();
    expect(screen.getByLabelText('Cari Nama')).toBeInTheDocument();
    expect(screen.getByText('Tidak ada data')).toBeInTheDocument();
  });

  it('should call onFilterChange when a filter is changed', () => {
    const initialFilters = { kategori: '', kecamatan: '', jenis: '', nama: '' };
    render(<Sidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    // Test Kategori filter
    fireEvent.change(screen.getByLabelText('Kategori'), { target: { value: 'umkm' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...initialFilters, kategori: 'umkm' });

    // Test Kecamatan filter
    fireEvent.change(screen.getByLabelText('Kecamatan'), { target: { value: 'Cawas' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...initialFilters, kecamatan: 'Cawas' });

    // Test Jenis filter
    fireEvent.change(screen.getByLabelText('Jenis'), { target: { value: 'Kuliner' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...initialFilters, jenis: 'Kuliner' });

    // Test Nama filter
    fireEvent.change(screen.getByLabelText('Cari Nama'), { target: { value: 'Toko' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...initialFilters, nama: 'Toko' });
  });

  it('should call setRadius when the radius input is changed', () => {
    render(<Sidebar radius={1000} setRadius={mockSetRadius} />);
    const radiusInput = screen.getByLabelText('Radius (meter)');

    fireEvent.change(radiusInput, { target: { value: '1500' } });
    expect(mockSetRadius).toHaveBeenCalledWith(1500);
  });

  it('should display a list of PotensiCard components when data is provided', () => {
    render(<Sidebar data={mockData} />);
    const cards = screen.getAllByTestId('potensi-card');
    expect(cards).toHaveLength(mockData.length);
    expect(screen.getByText('Toko A')).toBeInTheDocument();
    expect(screen.getByText('Warung C')).toBeInTheDocument();
    expect(screen.queryByText('Tidak ada data')).not.toBeInTheDocument();
  });

  it('should call onSelectNama when a PotensiCard is clicked', () => {
    render(<Sidebar data={mockData} onSelectNama={mockOnSelectNama} />);
    const firstCard = screen.getByText('Toko A');

    fireEvent.click(firstCard);
    expect(mockOnSelectNama).toHaveBeenCalledWith('Toko A');
    expect(mockOnSelectNama).toHaveBeenCalledTimes(1);
  });

  describe('Autocomplete functionality', () => {
    it('should not show autocomplete when search input is empty', () => {
      render(<Sidebar filters={{ nama: '' }} data={mockData} />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Assuming autocomplete has a listbox role
    });

    it('should show and filter autocomplete suggestions when typing in search input', () => {
      render(<Sidebar filters={{ nama: 'Toko' }} data={mockData} />);
      const suggestions = screen.getAllByRole('strong'); // The text inside the autocomplete item
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]).toHaveTextContent('Toko A');
      expect(suggestions[1]).toHaveTextContent('Toko B');
      expect(screen.queryByText('Warung C')).not.toBeInTheDocument();
    });

    it('should be case-insensitive', () => {
      render(<Sidebar filters={{ nama: 'toko' }} data={mockData} />);
      const suggestions = screen.getAllByRole('strong');
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]).toHaveTextContent('Toko A');
    });

    it('should call onSelectNama and onFilterChange when an autocomplete item is clicked', () => {
      const initialFilters = { kategori: '', kecamatan: '', jenis: '', nama: 'Toko' };
      render(
        <Sidebar
          filters={initialFilters}
          data={mockData}
          onFilterChange={mockOnFilterChange}
          onSelectNama={mockOnSelectNama}
        />
      );

      const autocompleteItem = screen.getByText('Toko B').closest('.autocomplete-item');
      fireEvent.click(autocompleteItem);

      // It should call onSelectNama with the full name
      expect(mockOnSelectNama).toHaveBeenCalledWith('Toko B');

      // It should also update the filter to the selected name
      expect(mockOnFilterChange).toHaveBeenCalledWith({ ...initialFilters, nama: 'Toko B' });
    });

    it('should not show autocomplete if no data matches', () => {
      render(<Sidebar filters={{ nama: 'NonExistent' }} data={mockData} />);
      expect(screen.queryByRole('strong')).not.toBeInTheDocument();
    });
  });
});

