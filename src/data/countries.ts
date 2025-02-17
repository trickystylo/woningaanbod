export const EUROPEAN_COUNTRIES = [
  { name: 'Nederland', flag: '🇳🇱' },
  { name: 'België', flag: '🇧🇪' },
  { name: 'Bulgarije', flag: '🇧🇬' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Denemarken', flag: '🇩🇰' },
  { name: 'Duitsland', flag: '🇩🇪' },
  { name: 'Estland', flag: '🇪🇪' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'Frankrijk', flag: '🇫🇷' },
  { name: 'Griekenland', flag: '🇬🇷' },
  { name: 'Hongarije', flag: '🇭🇺' },
  { name: 'Ierland', flag: '🇮🇪' },
  { name: 'Italië', flag: '🇮🇹' },
  { name: 'Kroatië', flag: '🇭🇷' },
  { name: 'Letland', flag: '🇱🇻' },
  { name: 'Litouwen', flag: '🇱🇹' },
  { name: 'Luxemburg', flag: '🇱🇺' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Oostenrijk', flag: '🇦🇹' },
  { name: 'Polen', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Roemenië', flag: '🇷🇴' },
  { name: 'Slovenië', flag: '🇸🇮' },
  { name: 'Slowakije', flag: '🇸🇰' },
  { name: 'Spanje', flag: '🇪🇸' },
  { name: 'Tsjechië', flag: '🇨🇿' },
  { name: 'Zweden', flag: '🇸🇪' },
  { name: 'Albanië', flag: '🇦🇱' },
  { name: 'Andorra', flag: '🇦🇩' },
  { name: 'Armenië', flag: '🇦🇲' },
  { name: 'Azerbeidzjan', flag: '🇦🇿' },
  { name: 'Bosnië en Herzegovina', flag: '🇧🇦' },
  { name: 'Georgië', flag: '🇬🇪' },
  { name: 'IJsland', flag: '🇮🇸' },
  { name: 'Liechtenstein', flag: '🇱🇮' },
  { name: 'Moldavië', flag: '🇲🇩' },
  { name: 'Monaco', flag: '🇲🇨' },
  { name: 'Montenegro', flag: '🇲🇪' },
  { name: 'Noord-Macedonië', flag: '🇲🇰' },
  { name: 'Noorwegen', flag: '🇳🇴' },
  { name: 'Oekraïne', flag: '🇺🇦' },
  { name: 'San Marino', flag: '🇸🇲' },
  { name: 'Servië', flag: '🇷🇸' },
  { name: 'Turkije', flag: '🇹🇷' },
  { name: 'Verenigd Koninkrijk', flag: '🇬🇧' },
  { name: 'Zwitserland', flag: '🇨🇭' },
  { name: 'Belarus', flag: '🇧🇾' },
  { name: 'Kazachstan', flag: '🇰🇿' },
  { name: 'Kosovo', flag: '🇽🇰' },
  { name: 'Rusland', flag: '🇷🇺' },
  { name: 'Vaticaanstad', flag: '🇻🇦' }
].sort((a, b) => a.name.localeCompare(b));

export const TOP_COUNTRIES = [
  'Spanje',
  'Frankrijk',
  'Italië',
  'Portugal',
  'Griekenland',
  'Kroatië',
  'Nederland',
  'Duitsland',
  'België',
  'Oostenrijk'
];

export function getCountryFlag(countryName: string): string {
  const country = EUROPEAN_COUNTRIES.find(c => c.name === countryName);
  return country?.flag || '';
}