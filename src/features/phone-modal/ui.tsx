'use client';

import { useState, useRef, useEffect } from 'react';

import ArrowIcon from '@/shared/assets/icons/arrow.svg';
import KgFlag from '@/shared/assets/icons/flags/kg.svg';
import KzFlag from '@/shared/assets/icons/flags/kz.svg';
import RuFlag from '@/shared/assets/icons/flags/ru.svg';
import type { ApiPhoneCountry } from '@/shared/mock';

interface Country {
  name: string;
  flag: React.ElementType | null;
  code: string;
}

const FLAG_MAP: Record<string, React.ElementType> = {
  KG: KgFlag,
  KZ: KzFlag,
  RU: RuFlag,
};

const DEFAULT_COUNTRIES: Country[] = [
  { name: 'Кыргызстан', flag: KgFlag, code: '+996' },
  { name: 'Россия', flag: RuFlag, code: '+7' },
  { name: 'Казахстан', flag: KzFlag, code: '+7' },
];

function mapApiCountries(apiCountries: ApiPhoneCountry[]): Country[] {
  return apiCountries.map((c) => ({
    name: c.name,
    flag: FLAG_MAP[c.code] ?? null,
    code: c.dial_code,
  }));
}

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (phoneNumber: string, fullName: string) => void;
  error?: string;
  isLoading?: boolean;
  countries?: ApiPhoneCountry[];
}

export function PhoneModal({ isOpen, onClose, onContinue, error, isLoading, countries }: PhoneModalProps) {
  const resolvedCountries = countries && countries.length > 0 ? mapApiCountries(countries) : DEFAULT_COUNTRIES;
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    resolvedCountries.find((c) => c.code === '+996') ?? resolvedCountries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Автофокус при открытии: на ФИО, если оно ещё не заполнено, иначе на номер
  useEffect(() => {
    if (!isOpen) return;
    if (localStorage.getItem('saved_name')) {
      phoneInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const savedPhone = localStorage.getItem('saved_phone');
    if (savedPhone) {
      const matched = resolvedCountries.find((c) => savedPhone.startsWith(c.code));
      if (matched) {
        setSelectedCountry(matched);
        setPhoneNumber(savedPhone.slice(matched.code.length));
      }
    }
    const savedName = localStorage.getItem('saved_name');
    if (savedName) setFullName(savedName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
    setPhoneNumber(value);
  };

  const handleContinue = () => {
    if (phoneNumber.length > 0 && fullName.trim().length > 0) {
      onContinue(selectedCountry.code + phoneNumber, fullName.trim());
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen
          ? 'opacity-100 pointer-events-auto bg-black/50'
          : 'opacity-0 pointer-events-none bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-100 p-6 relative flex flex-col items-center gap-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className='text-sm text-center text-[#333] mb-4'>
          Введите ФИО и номер телефона, чтобы продолжить запись
        </p>

        <div className='border border-gray-200 rounded-lg p-3 w-full'>
          <input
            ref={nameInputRef}
            type='text'
            name='name'
            autoComplete='name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='ФИО'
            className='w-full text-base text-[#333] placeholder:text-gray-300 focus:outline-none'
          />
        </div>

        <div className='border border-gray-200 rounded-lg p-3 flex items-center gap-2 w-full'>
          <div
            className='flex items-center gap-2 cursor-pointer relative'
            ref={dropdownRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCountry.flag ? (
              <selectedCountry.flag className='w-6 h-4 shrink-0 rounded-xs object-cover' />
            ) : (
              <span className='w-6 h-4 shrink-0 flex items-center justify-center text-xs font-medium text-gray-600'>{selectedCountry.code}</span>
            )}

            {/* Иконка стрелки с анимацией поворота */}
            <span
              className={`text-gray-400 transition-transform duration-200 flex items-center justify-center ${
                isDropdownOpen ? 'rotate-90' : '-rotate-90'
              }`}
            >
              <ArrowIcon className='w-3 h-3' />
            </span>

            {/* Выпадающий список */}
            {isDropdownOpen && (
              <div className='absolute top-full left-[-12px] mt-4 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-10 w-[180px] py-2'>
                {resolvedCountries.map((country) => (
                  <div
                    key={country.name}
                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCountry(country);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {country.flag ? (
                      <country.flag className='w-6 h-4 shrink-0 rounded-xs object-cover' />
                    ) : (
                      <span className='w-6 h-4 shrink-0 flex items-center justify-center text-xs font-medium text-gray-600'>{country.code}</span>
                    )}
                    <span className='text-sm text-[#333]'>{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className='text-base text-[#333] font-medium ml-1'>
            {selectedCountry.code}
          </span>

          <input
            ref={phoneInputRef}
            type='tel'
            name='phone'
            autoComplete='tel'
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder='000 000 000'
            className='flex-1 text-base text-[#333] placeholder:text-gray-300 focus:outline-none'
          />
        </div>

        {error && (
          <p className='w-full text-sm text-red-500 text-center -mt-2'>{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={isLoading || phoneNumber.length === 0 || fullName.trim().length === 0}
          className='w-full bg-[#007BFF] hover:bg-[#0069D9] disabled:opacity-60 transition-colors text-white text-base font-semibold py-3.5 rounded-full mt-2'
        >
          {isLoading ? 'Отправка...' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}
