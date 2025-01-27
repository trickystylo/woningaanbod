import React from 'react';
import { Hero } from '../components/layout/Hero';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { PopularCountries } from '../components/home/PopularCountries';
import { WhyChooseUs } from '../components/home/WhyChooseUs';

export function HomePage() {
  return (
    <main>
      <Hero />
      <PopularCountries />
      <FeaturedProperties />
      <WhyChooseUs />
    </main>
  );
}