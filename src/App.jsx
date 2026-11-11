import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListView from './ListView';
import ListingDetail from './ListingDetail';
import FavoritesPage from './FavoritesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="*" element={<div className="p-6 text-white">404 — страница не найдена</div>} />
    </Routes>
  );
}
