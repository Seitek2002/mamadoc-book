'use client';

import { useState, useEffect, useRef } from 'react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  phoneNumber: string;
}

// Маскировка номера
const maskPhoneNumber = (phone: string) => {
  if (!phone) return '';
  return `${phone.slice(0, 10)}* ***`;
};

export function OTPModal({
  isOpen,
  onClose,
  onSubmit,
  phoneNumber,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [wasOpen, setWasOpen] = useState(isOpen);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Сброс состояния при открытии
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setTimeLeft(60);
      setOtp(Array(6).fill(''));
    }
  }

  // Таймер
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onSubmit(otpString);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    // Логика повторной отправки
    console.log('Код отправлен повторно на', phoneNumber);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity'
      onClick={onClose}
    >
      <div
        // Размеры и отступы враппера (Мобилка: 290px, ПК: 525px)
        className='bg-white rounded-[10px] w-full max-w-[290px] md:max-w-[525px] p-[30px] flex flex-col items-center'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия (без absolute position, выстроена по правому краю) */}
        <div className='w-full flex justify-end mb-2 md:mb-4'>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-[#312E2E] transition-colors p-1'
            aria-label='Закрыть'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Заголовок */}
        <div className='text-center w-full md:w-[465px] mb-[16px]'>
          <p className='text-[14px] font-medium leading-[100%] text-[#312E2E]'>
            Введите код OTP, отправленный на номер{' '}
            {maskPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* Поля ввода OTP */}
        <div className='flex w-full justify-between md:justify-center md:gap-[10px] mb-[16px]'>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              // Стили инпутов (Мобилка: 35x34, ПК: 70.83x54)
              className='w-full max-w-[35px] md:max-w-[70.83px] h-[34px] md:h-[54px] bg-[#F8F7F7] border border-[#DBE0E6] rounded-[4px] md:rounded-[8px] text-center text-lg md:text-2xl font-medium text-[#312E2E] focus:border-[#0088FF] focus:outline-none focus:bg-white transition-colors'
            />
          ))}
        </div>

        {/* Кнопка "Продолжить" */}
        <button
          onClick={handleSubmit}
          disabled={otp.join('').length !== 6}
          // Размеры кнопки (ПК: w-308px, h-41px | Мобилка: full, h-38px)
          className='w-full md:w-[308px] h-[38px] md:h-[41px] bg-[#0088FF] disabled:opacity-50 hover:bg-[#0070d1] transition-colors text-white text-[14px] md:text-[16px] font-medium rounded-[10px] mb-[16px]'
        >
          Продолжить
        </button>

        {/* Таймер / Повторный запрос */}
        <div className='w-full text-center'>
          {timeLeft > 0 ? (
            <span className='text-[12px] md:text-[14px] font-normal leading-[130%] text-[#7A7878]'>
              Запросить новый код через {formatTime(timeLeft)}
            </span>
          ) : (
            <button
              onClick={handleResend}
              className='text-[12px] md:text-[14px] font-normal leading-[130%] text-[#0088FF] hover:underline cursor-pointer'
            >
              Запросить код снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
