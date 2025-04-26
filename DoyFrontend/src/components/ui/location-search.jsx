import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const LocationSearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Gerçek bir uygulamada burada API çağrısı yapılır
      // Şimdilik dummy data kullanıyoruz
      onLocationSelect && onLocationSelect({
        address: searchQuery,
        latitude: 41.0082, // İstanbul örnek koordinatları
        longitude: 28.9784
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        placeholder="Adres girin (ör. Beşiktaş, İstanbul)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">Ara</Button>
    </form>
  );
};

export { LocationSearch };