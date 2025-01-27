import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { COMMON_FEATURES } from '../../data/properties';

interface FeatureSelectorProps {
  selectedFeatures: string[];
  onFeatureAdd: (feature: string) => void;
  onFeatureRemove: (feature: string) => void;
}

export function FeatureSelector({ selectedFeatures, onFeatureAdd, onFeatureRemove }: FeatureSelectorProps) {
  const [customFeature, setCustomFeature] = useState('');

  const availableFeatures = COMMON_FEATURES.filter(
    feature => !selectedFeatures.includes(feature)
  );

  const handleCustomFeatureAdd = () => {
    if (customFeature && !selectedFeatures.includes(customFeature)) {
      onFeatureAdd(customFeature);
      setCustomFeature('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Features */}
      <div className="flex flex-wrap gap-2">
        {selectedFeatures.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
          >
            {feature}
            <button
              type="button"
              onClick={() => onFeatureRemove(feature)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      {/* Suggested Features */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Suggesties:</h4>
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => (
            <button
              key={feature}
              onClick={() => onFeatureAdd(feature)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Feature Input */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Of voeg een eigen kenmerk toe:</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            placeholder="Typ een nieuw kenmerk..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleCustomFeatureAdd}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}