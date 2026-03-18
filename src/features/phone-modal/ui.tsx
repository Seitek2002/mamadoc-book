'use client';

import { useState, useRef, useEffect } from 'react';
// import clsx from 'clsx';
// Предполагаю, что иконки из библиотеки shared/ui/icons.
// Если нет, используйте простой svg или символ. Использую символ ▼.
import ArrowIcon from '@/shared/assets/icons/arrow.svg';

interface Country {
  name: string;
  flag: string; // Временная заглушка, использую эмодзи. Замените на путь к изображению.
  code: string;
}

const COUNTRIES: Country[] = [
  { name: 'КГ', flag: '🇰🇬', code: '+996' },
  { name: 'КЗ', flag: '🇰🇿', code: '+7' },
  { name: 'РУ', flag: '🇷🇺', code: '+7' },
];

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (phoneNumber: string) => void;
}

export function PhoneModal({ isOpen, onClose, onContinue }: PhoneModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Запретить 0 первым символом
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
    setPhoneNumber(value);
  };

  const handleContinue = () => {
    // Можно добавить валидацию длины номера
    if (phoneNumber.length > 0) {
      onContinue(selectedCountry.code + phoneNumber);
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-xl w-full max-w-100 p-6 relative flex flex-col items-center gap-4'
        onClick={(e) => e.stopPropagation()}
      >
        <p className='text-sm text-center text-[#333] mb-4'>
          Введите номер телефона, чтобы продолжить запись
        </p>

        <div className='border border-gray-200 rounded-lg p-3 flex items-center gap-2 w-full'>
          <div
            className='flex items-center gap-1.5 cursor-pointer relative'
            ref={dropdownRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Временная заглушка для флага, использую эмодзи. Замените на Image с правильным путем. */}
            <span className='w-5 h-4 text-sm'>{selectedCountry.flag}</span>
            {/* Временная заглушка для иконки стрелки, использую символ. Замените на ArrowIcon из библиотеки. */}
            <span className='size-4 text-gray-400'><ArrowIcon className='rotate-90' /></span>

            {isDropdownOpen && (
              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-10 w-40 max-h-40 overflow-y-auto'>
                {COUNTRIES.map((country) => (
                  <div
                    key={country.name}
                    className='flex items-center gap-2 p-2.5 hover:bg-gray-50 cursor-pointer'
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className='w-5 h-4 text-sm'>{country.flag}</span>
                    <span className='text-sm text-[#333]'>{country.name}</span>
                    <span className='text-sm text-gray-400 ml-auto'>
                      {country.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className='text-base text-[#333] font-medium'>
            {selectedCountry.code}
          </span>

          <input
            type='tel'
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder='000 000 000'
            className='flex-1 text-base text-[#333] placeholder:text-gray-300 focus:outline-none'
          />
        </div>

        <button
          onClick={handleContinue}
          className='w-full bg-[#007BFF] hover:bg-[#0069D9] transition-colors text-white text-base font-semibold py-3.5 rounded-full mt-2'
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
