import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import PotensiCard from './PotensiCard';

describe('PotensiCard Component', () => {
  const mockOnSelect = jest.fn();

  const fullItem = {
    nama: 'Toko Kopi Mantap',
    foto: 'https://example.com/kopi.jpg',
    jenis: 'Kuliner',
    kecamatan: 'Cawas',
    alamat: 'Jl. Kopi No. 1',
  };

  const minimalItem = {
    nama: 'Warung Bakso',
    jenis: 'Kuliner',
    kecamatan: 'Wedi',
    // No foto or alamat
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all details when a full item is provided', () => {
    render(<PotensiCard item={fullItem} onSelect={mockOnSelect} />);

    const image = screen.getByAltText(fullItem.nama);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', fullItem.foto);

    expect(screen.getByRole('heading', { name: fullItem.nama })).toBeInTheDocument();
    expect(screen.getByText(`${fullItem.jenis} • ${fullItem.kecamatan}`)).toBeInTheDocument();
    expect(screen.getByText(fullItem.alamat)).toBeInTheDocument();
  });

  it('should render correctly when optional fields are missing', () => {
    render(<PotensiCard item={minimalItem} onSelect={mockOnSelect} />);

    expect(screen.queryByAltText(minimalItem.nama)).not.toBeInTheDocument();
    expect(screen.queryByText(fullItem.alamat)).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: minimalItem.nama })).toBeInTheDocument();
    expect(screen.getByText(`${minimalItem.jenis} • ${minimalItem.kecamatan}`)).toBeInTheDocument();
  });

  it('should call onSelect with the correct item name when clicked', () => {
    render(<PotensiCard item={fullItem} onSelect={mockOnSelect} />);

    const cardElement = screen.getByText(fullItem.nama).closest('.potensi-card');
    fireEvent.click(cardElement);

    expect(mockOnSelect).toHaveBeenCalledWith(fullItem.nama);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});