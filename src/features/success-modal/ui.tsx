'use client';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4 transition-opacity'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-85 p-6 relative flex flex-col items-center gap-4 text-center'>
        <div className='w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2'>
          <svg
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M20 6L9 17l-5-5' />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-[#333]'>
          Запись подтверждена!
        </h3>
        <p className='text-sm text-gray-500 mb-2'>
          Вы успешно записаны на прием. Ждем вас в назначенное время.
        </p>
        <button
          onClick={onClose}
          className='w-full bg-[#007BFF] hover:bg-[#0069D9] transition-colors text-white text-base font-semibold py-3 rounded-xl'
        >
          Отлично
        </button>
      </div>
    </div>
  );
}
