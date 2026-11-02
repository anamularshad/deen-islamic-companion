import React, { useState } from 'react';
import { X, Search, Navigation, Check } from 'lucide-react';
import { CityLocation, Language } from '../../types';
import { POPULAR_CITIES } from '../../data/cities';
import { getTranslation } from '../../i18n/translations';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  language: Language;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const t = getTranslation(language);

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        const gpsCity: CityLocation = {
          id: 'gps-custom',
          name: 'My Exact Location',
          country: 'GPS Detected',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          defaultMethod: 'MuslimWorldLeague',
        };
        onSelectCity(gpsCity);
        onClose();
      },
      (error) => {
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please select your city manually from the list below.');
        } else {
          setGpsError('Unable to retrieve location. Please choose a city below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#19251F] w-full max-w-md rounded-2xl shadow-xl border border-[#E4EAE5] dark:border-[#23332B] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#17231F] dark:text-[#E4EAE5]">
              {t.location}
            </h3>
            <p className="text-xs text-[#68756E] dark:text-[#8E9D95]">
              Used for accurate prayer times and Qibla direction
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#68756E] hover:text-[#17231F] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Option */}
        <div className="p-4 border-b border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16]/50">
          <button
            onClick={handleUseGps}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Detecting Coordinates...' : t.useDeviceGps}</span>
          </button>
          {gpsError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 text-center">
              {gpsError}
            </p>
          )}
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-[#E4EAE5] dark:border-[#23332B]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#68756E] dark:text-[#8E9D95] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search world city or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-[#17231F] dark:text-[#E4EAE5] focus:outline-none focus:border-[#087F5B]"
            />
          </div>
        </div>

        {/* Cities list */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#E4EAE5] dark:divide-[#23332B]">
          {filteredCities.map((city) => {
            const isSelected = currentCity.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#087F5B]/10 dark:bg-[#C9A45C]/15 text-[#087F5B] dark:text-[#C9A45C]'
                    : 'hover:bg-[#F7F9F6] dark:hover:bg-[#101A16] text-[#17231F] dark:text-[#E4EAE5]'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold">{city.name}</p>
                  <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">{city.country}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
