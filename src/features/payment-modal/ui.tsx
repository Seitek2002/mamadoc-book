'use client';

import Link from 'next/link';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaid: () => void;
  paylinkUrl: string;
  amount: number;
  /** Полная стоимость брони — передаётся при депозитной модели оплаты */
  totalPrice?: number;
  error?: string;
  isLoading?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  onPaid,
  paylinkUrl,
  amount,
  totalPrice,
  error,
  isLoading,
}: PaymentModalProps) {
  const isDeposit = totalPrice != null && totalPrice > amount;
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
        <div className='size-12 rounded-full bg-[#F0F8FF] flex items-center justify-center'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#007BFF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <rect x='1' y='4' width='22' height='16' rx='2' ry='2' />
            <line x1='1' y1='10' x2='23' y2='10' />
          </svg>
        </div>

        <div className='text-center'>
          <h2 className='text-base font-semibold text-[#333]'>Требуется предоплата</h2>
          <p className='text-sm text-[#6B6B6B] mt-1'>
            Для подтверждения записи необходимо внести депозит
            {amount > 0 && (
              <>
                {' '}
                <span className='font-semibold text-[#333]'>
                  {amount.toLocaleString('ru-RU')} сом
                </span>
              </>
            )}
          </p>
          {isDeposit && (
            <p className='text-xs text-[#9E9E9E] mt-2'>
              Оставшаяся сумма —{' '}
              {(totalPrice - amount).toLocaleString('ru-RU')} сом — оплачивается
              на месте после приёма
            </p>
          )}
        </div>

        {error && (
          <p className='w-full text-sm text-red-500 text-center'>{error}</p>
        )}

        {paylinkUrl && (
          <a
            href={paylinkUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='w-full bg-[#007BFF] hover:bg-[#0069D9] transition-colors text-white text-base font-semibold py-3.5 rounded-full text-center'
          >
            Перейти к оплате
          </a>
        )}

        <button
          onClick={onPaid}
          disabled={isLoading}
          className='w-full border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 disabled:opacity-60 transition-colors text-base font-semibold py-3.5 rounded-full'
        >
          {isLoading ? 'Проверяем оплату...' : 'Я оплатил(а)'}
        </button>

        <p className='text-xs text-[#9E9E9E] text-center'>
          После оплаты вернитесь на эту страницу и нажмите «Я оплатил(а)», чтобы завершить запись
        </p>

        <Link
          href='/bookings'
          className='text-sm font-medium text-[#6B6B6B] underline underline-offset-2 hover:text-[#333] transition-colors'
        >
          Мои записи
        </Link>
      </div>
    </div>
  );
}
