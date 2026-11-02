import React, { useState, useEffect } from 'react';
import { Compass, Navigation, RefreshCw, AlertCircle, Info, MapPin } from 'lucide-react';
import { CityLocation, Language } from '../../../types';
import { calculateDistanceToKaaba, calculateQiblaBearing, getBearingDirectionName } from '../../../utils/qibla';
import { getTranslation } from '../../../i18n/translations';

interface QiblaCompassViewProps {
  language: Language;
  currentCity: CityLocation;
  onOpenLocationModal: () => void;
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({
  language,
  currentCity,
  onOpenLocationModal,
}) => {
  const t = getTranslation(language);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [manualOffset, setManualOffset] = useState<number>(0);

  const qiblaBearing = calculateQiblaBearing(currentCity.latitude, currentCity.longitude);
  const distanceKm = calculateDistanceToKaaba(currentCity.latitude, currentCity.longitude);
  const directionName = getBearingDirectionName(qiblaBearing);

  // Setup device orientation listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      let heading: number | null = null;
      if ((e as any).webkitCompassHeading !== undefined) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setSensorAvailable(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setSensorAvailable(false);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const requestSensorPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setSensorAvailable(true);
        } else {
          setSensorAvailable(false);
        }
      } catch (err) {
        setSensorAvailable(false);
      }
    } else {
      alert('Sensors are active or your device does not require explicit permission.');
    }
  };

  // The angle to rotate the needle
  // If sensor is available, relative bearing = qiblaBearing - deviceHeading
  const dialRotation = deviceHeading !== null ? (qiblaBearing - deviceHeading + 360) % 360 : qiblaBearing;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E3B] to-[#087F5B] text-white shadow-sm border border-[#E4EAE5] dark:border-[#23332B]">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
            Sacred Direction
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t.findQibla}
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Exact astronomical direction to the Holy Kaaba in Makkah al-Mukarramah.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-center shadow-xs">
          <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.qiblaDirection}</p>
          <p className="text-xl sm:text-2xl font-bold text-[#087F5B] dark:text-[#C9A45C] mt-1 tabular-nums">
            {qiblaBearing}° {directionName}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-center shadow-xs">
          <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.distanceToKaaba}</p>
          <p className="text-xl sm:text-2xl font-bold text-[#17231F] dark:text-[#E4EAE5] mt-1 tabular-nums">
            {distanceKm.toLocaleString()} <span className="text-xs font-normal text-[#68756E]">km</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] text-center shadow-xs flex flex-col justify-between">
          <p className="text-[11px] text-[#68756E] dark:text-[#8E9D95] font-medium">{t.location}</p>
          <button
            onClick={onOpenLocationModal}
            className="text-xs font-bold text-[#087F5B] dark:text-[#C9A45C] hover:underline truncate"
          >
            {currentCity.name}
          </button>
        </div>
      </div>

      {/* Compass Dial Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm flex flex-col items-center">
        {/* SVG Compass */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] shadow-inner flex items-center justify-center">
            {/* Cardinal Marks */}
            <span className="absolute top-2 text-xs font-bold text-rose-600">N</span>
            <span className="absolute right-3 text-xs font-bold text-[#68756E] dark:text-[#8E9D95]">E</span>
            <span className="absolute bottom-2 text-xs font-bold text-[#68756E] dark:text-[#8E9D95]">S</span>
            <span className="absolute left-3 text-xs font-bold text-[#68756E] dark:text-[#8E9D95]">W</span>

            {/* Degree ticks */}
            <div className="w-48 h-48 rounded-full border border-dashed border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-center">
              {/* Rotating Needle / Arrow pointing to Kaaba */}
              <div
                className="w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `rotate(${dialRotation}deg)` }}
              >
                {/* Kaaba Direction Gold Pointer */}
                <div className="absolute top-4 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-[#C9A45C] filter drop-shadow-sm" />
                  <div className="w-5 h-5 rounded-md bg-[#17231F] border border-[#C9A45C] flex items-center justify-center text-[10px] text-[#C9A45C] font-bold mt-1 shadow-sm">
                    🕋
                  </div>
                </div>

                {/* Center Hub */}
                <div className="w-10 h-10 rounded-full bg-[#087F5B] text-white flex items-center justify-center shadow-md font-bold text-xs border-2 border-white dark:border-[#19251F]">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bearing readout */}
        <div className="text-center mt-2">
          <p className="text-sm font-bold text-[#17231F] dark:text-[#E4EAE5]">
            Turn your device until the gold Kaaba arrow points straight ahead
          </p>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] mt-1">
            Qibla Bearing: <strong className="text-[#087F5B] dark:text-[#C9A45C]">{qiblaBearing}°</strong> from True North
            {deviceHeading !== null && ` · Current Heading: ${deviceHeading}°`}
          </p>
        </div>

        {/* Sensor activation button if iOS */}
        {sensorAvailable === false && (
          <button
            onClick={requestSensorPermission}
            className="mt-4 px-4 py-2 rounded-xl bg-[#087F5B] text-white text-xs font-semibold hover:bg-[#064E3B] transition-colors"
          >
            Enable Compass Sensors
          </button>
        )}
      </div>

      {/* Kaaba Mecca Visual Spotlight */}
      <div className="rounded-2xl overflow-hidden border border-[#E4EAE5] dark:border-[#23332B] bg-white dark:bg-[#19251F] flex flex-col sm:flex-row items-center gap-4 p-4 shadow-xs">
        <img
          src="/src/assets/images/kaaba_mecca_serene_1793584912378.jpg"
          alt="Holy Kaaba Mecca"
          referrerPolicy="no-referrer"
          className="w-full sm:w-36 h-28 object-cover rounded-xl"
        />
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#17231F] dark:text-[#E4EAE5] uppercase tracking-wider">
            Al-Masjid al-Haram, Makkah
          </h3>
          <p className="text-xs text-[#68756E] dark:text-[#8E9D95] leading-relaxed">
            Coordinates: 21°25'21.0"N 39°49'34.3"E. The focal direction toward which Muslims worldwide unite five times a day in humble devotion to Allah.
          </p>
          <p className="text-[11px] text-[#087F5B] dark:text-[#C9A45C] font-semibold pt-1">
            "So turn your face toward the Sacred Mosque (Al-Masjid al-Haram)" — Surah Al-Baqarah 2:144
          </p>
        </div>
      </div>

      {/* Calibration Notice */}
      <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] text-xs text-[#68756E] dark:text-[#8E9D95] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#087F5B] dark:text-[#C9A45C] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#17231F] dark:text-[#E4EAE5] mb-0.5">Compass Calibration Guidance</p>
          <p>{t.calibratingCompass}. Keep your device away from metallic objects and magnets for greatest accuracy.</p>
        </div>
      </div>
    </div>
  );
};
