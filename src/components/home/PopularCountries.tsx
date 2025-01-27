import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPropertyCountByCountry } from '../../data/properties';
import { TOP_COUNTRIES } from '../../data/countries';

const POPULAR_COUNTRIES = [
  {
    name: 'Nederland',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇳🇱'
  },
  {
    name: 'Spanje',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇪🇸'
  },
  {
    name: 'Frankrijk',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇫🇷'
  },
  {
    name: 'Italië',
    image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇮🇹'
  },
  {
    name: 'Portugal',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇵🇹'
  },
  {
    name: 'Griekenland',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇬🇷'
  },
  {
    name: 'Kroatië',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇭🇷'
  },
  {
    name: 'Oostenrijk',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇦🇹'
  },
  {
    name: 'Duitsland',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇩🇪'
  },
  {
    name: 'België',
    image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    flag: '🇧🇪'
  }
];

export function PopularCountries() {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Populaire Landen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {POPULAR_COUNTRIES.map((country) => {
            const propertyCount = getPropertyCountByCountry(country.name);
            
            return (
              <div
                key={country.name}
                onClick={() => navigate(`/zoeken?country=${encodeURIComponent(country.name)}`)}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
              >
                <div className="aspect-[4/3] sm:aspect-[3/2]">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white">
                  <h3 className="text-sm sm:text-base font-semibold mb-0.5 flex items-center gap-1 sm:gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {propertyCount} {propertyCount === 1 ? 'woning' : 'woningen'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}