import React from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { FeaturedProperties } from './components/home/FeaturedProperties';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FeaturedProperties />
    </div>
  );
}

export default App;