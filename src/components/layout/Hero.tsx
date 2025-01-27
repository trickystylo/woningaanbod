import React from 'react';
import { SearchBar } from '../ui/SearchBar';

export function Hero() {
  return (
    <div className="relative h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Vind uw Droomhuis in Europa
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Ontdek duizenden woningen te koop en te huur in heel Europa
        </p>
        <SearchBar />
      </div>
    </div>
  );
}