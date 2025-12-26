import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DetailPanel from './DetailPanel';

describe('DetailPanel Component', () => {
  describe('when no item is selected', () => {
    it('should render a placeholder message if selectedItem is null', () => {
      render(<DetailPanel selectedItem={null} />);
      expect(
        screen.getByText(
          'Pilih marker di peta atau nama dari daftar untuk melihat detail.'
        )
      ).toBeInTheDocument();
    });

    it('should render a placeholder message if selectedItem is undefined', () => {
      render(<DetailPanel />);
      expect(
        screen.getByText(
          'Pilih marker di peta atau nama dari daftar untuk melihat detail.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when an item is selected', () => {
    const mockItem = {
      nama: 'Toko Roti Enak',
      foto: 'https://example.com/roti.jpg',
      kategori: 'UMKM',
      jenis: 'Kuliner',
      alamat: 'Jl. Merdeka No. 10, Klaten',
      deskripsi: 'Menjual aneka roti dan kue.',
      kontak: '08123456789',
      website: 'https://tokoroti.com',
    };

    beforeEach(() => {
      render(<DetailPanel selectedItem={mockItem} />);
    });

    it('should render the item name and image', () => {
      expect(screen.getByRole('heading', { name: 'Toko Roti Enak' })).toBeInTheDocument();
      const image = screen.getByAltText('Toko Roti Enak');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockItem.foto);
    });

    it('should render all basic details', () => {
      expect(screen.getByText('Kategori:')).toBeInTheDocument();
      expect(screen.getByText(mockItem.kategori)).toBeInTheDocument();
      expect(screen.getByText('Jenis:')).toBeInTheDocument();
      expect(screen.getByText(mockItem.jenis)).toBeInTheDocument();
      expect(screen.getByText('Alamat:')).toBeInTheDocument();
      expect(screen.getByText(mockItem.alamat)).toBeInTheDocument();
    });

    it('should render optional fields like description and contact', () => {
      expect(screen.getByText('Deskripsi:')).toBeInTheDocument();
      expect(screen.getByText(mockItem.deskripsi)).toBeInTheDocument();
      expect(screen.getByText('Kontak:')).toBeInTheDocument();
      expect(screen.getByText(mockItem.kontak)).toBeInTheDocument();
    });

    it('should render the website as a clickable link', () => {
      const websiteLink = screen.getByRole('link', { name: mockItem.website });
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink).toHaveAttribute('href', mockItem.website);
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('when an item with missing optional fields is selected', () => {
    it('should not render the missing optional fields', () => {
      const minimalItem = {
        nama: 'Warung Sederhana',
        kategori: 'UMKM',
        jenis: 'Kuliner',
        alamat: 'Jl. Desa No. 1',
        // No foto, deskripsi, kontak, or website
      };
      render(<DetailPanel selectedItem={minimalItem} />);

      expect(screen.queryByAltText(minimalItem.nama)).not.toBeInTheDocument();
      expect(screen.queryByText('Deskripsi:')).not.toBeInTheDocument();
      expect(screen.queryByText('Kontak:')).not.toBeInTheDocument();
      expect(screen.queryByText('Website:')).not.toBeInTheDocument();
    });
  });
});