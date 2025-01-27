import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parseFile } from '../../utils/csvParser';
import { transformPropertyData, validateTransformedData } from '../../utils/dataTransformer';
import { csvLogger } from '../../utils/csvLogger';
import { Property } from '../../types';
import { useProperties } from '../../contexts/PropertyContext';

export function CsvUploader() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { properties, addProperty } = useProperties();

  const isDuplicate = (newProperty: Partial<Property>) => {
    return properties.some(existingProperty => 
      existingProperty.address.toLowerCase() === newProperty.address?.toLowerCase() &&
      existingProperty.city.toLowerCase() === newProperty.city?.toLowerCase() &&
      existingProperty.postalCode.toLowerCase() === newProperty.postalCode?.toLowerCase()
    );
  };

  const processData = async (data: any[]) => {
    let addedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const row of data) {
      const property = transformPropertyData(row);
      
      if (!property) {
        errorCount++;
        continue;
      }

      const validationErrors = validateTransformedData(property);
      if (validationErrors.length > 0) {
        csvLogger.log('error', `Validatiefouten voor ${property.address}:`, validationErrors);
        errorCount++;
        continue;
      }

      if (isDuplicate(property)) {
        duplicateCount++;
        csvLogger.log('warning', `Duplicaat overgeslagen: ${property.address}, ${property.city}`);
        continue;
      }

      try {
        await addProperty(property);
        addedCount++;
      } catch (error) {
        errorCount++;
        csvLogger.log('error', `Fout bij toevoegen van woning: ${property.address}`, error);
      }
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} woningen konden niet worden toegevoegd`);
    }
    if (duplicateCount > 0) {
      toast(`${addedCount} woningen toegevoegd, ${duplicateCount} overgeslagen (reeds bestaand)`, { icon: '⚠️' });
    }
    if (addedCount > 0) {
      toast.success(`${addedCount} woningen succesvol toegevoegd`);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    csvLogger.clear();
    
    try {
      const data = await parseFile(file);
      if (data) {
        await processData(data);
      }
    } catch (error: any) {
      csvLogger.log('error', `Fout bij verwerken van bestand: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Bestand uploaden</h2>
          <p className="text-gray-600">
            Upload een CSV of Excel bestand om meerdere woningen tegelijk toe te voegen
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              Sleep een bestand hierheen of{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
                type="button"
              >
                klik om te uploaden
              </button>
            </p>
            <p className="text-sm text-gray-500">CSV of Excel bestanden</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-600">
              <p className="font-semibold mb-2">Vereiste kolommen in het bestand:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>title - Titel van de woning</li>
                <li>price - Prijs (numeriek)</li>
                <li>address - Adres</li>
                <li>city - Stad</li>
                <li>country - Land</li>
                <li>postalCode - Postcode</li>
                <li>bedrooms - Aantal slaapkamers (numeriek)</li>
                <li>bathrooms - Aantal badkamers (numeriek)</li>
                <li>size - Woonoppervlak in m² (numeriek)</li>
                <li>images - Afbeelding URLs (komma-gescheiden)</li>
                <li>description - Beschrijving</li>
                <li>type - Type (koop/huur)</li>
                <li>category - Categorie (appartementen/huizen/vakantiewoningen/nieuwbouw)</li>
                <li>features - Kenmerken (komma-gescheiden)</li>
                <li>status - Status (actief/concept/verkocht/verhuurd/ingetrokken)</li>
                <li>makelaarId - ID van de makelaar (optioneel)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}