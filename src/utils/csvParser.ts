import Papa from 'papaparse';
import { read, utils } from 'xlsx';
import { csvLogger } from './csvLogger';
import { validateFileSize, validateFileType, validateHeaders } from './fileValidation';

export async function parseFile(file: File) {
  try {
    if (!validateFileSize(file) || !validateFileType(file)) {
      return null;
    }

    if (file.name.endsWith('.csv')) {
      return await parseCsv(file);
    } else if (file.name.endsWith('.xlsx')) {
      return await parseExcel(file);
    }
  } catch (error: any) {
    csvLogger.log('error', `Fout bij het verwerken van bestand: ${error.message}`);
    return null;
  }
}

async function parseCsv(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      encoding: 'UTF-8',
      transformHeader: (header) => {
        return header.trim().toLowerCase();
      },
      transform: (value) => {
        return value.toString().trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          const errorMessages = results.errors
            .map(err => `Regel ${err.row + 2}: ${err.message}`)
            .join('\n');
          csvLogger.log('error', `CSV parsing fouten:\n${errorMessages}`);
          reject(new Error(errorMessages));
          return;
        }

        const headers = Object.keys(results.data[0] || {});
        const missingHeaders = validateHeaders(headers);
        
        if (missingHeaders.length > 0) {
          reject(new Error(`Ontbrekende kolommen: ${missingHeaders.join(', ')}`));
          return;
        }

        resolve(results.data);
      },
      error: (error) => {
        csvLogger.log('error', 'CSV parsing fout:', error);
        reject(error);
      }
    });
  });
}

async function parseExcel(file: File): Promise<any[]> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: 'array', cellDates: true });

    if (!workbook.SheetNames?.length) {
      throw new Error('Geen werkbladen gevonden in het Excel-bestand');
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) {
      throw new Error('Geen data gevonden in het eerste werkblad');
    }

    const data = utils.sheet_to_json(worksheet, {
      raw: false,
      defval: '',
      blankrows: false
    });

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Geen data gevonden in het Excel-bestand');
    }

    // Normalize headers
    const normalizedData = data.map(row => {
      const newRow: Record<string, any> = {};
      Object.entries(row).forEach(([key, value]) => {
        const normalizedKey = key.toLowerCase().trim();
        newRow[normalizedKey] = value?.toString().trim() || '';
      });
      return newRow;
    });

    const headers = Object.keys(normalizedData[0] || {});
    const missingHeaders = validateHeaders(headers);
    
    if (missingHeaders.length > 0) {
      throw new Error(`Ontbrekende kolommen: ${missingHeaders.join(', ')}`);
    }

    return normalizedData;
  } catch (error: any) {
    csvLogger.log('error', 'Excel parsing fout:', error);
    throw error;
  }
}