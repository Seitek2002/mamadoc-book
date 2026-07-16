'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken, setToken } from '@/shared/api/token';
import {
  getMyBookings,
  cancelBooking,
  sendOtp,
  verifyOtp,
  completeProfile,
  type MyBooking,
  type BookingStatus,
  type ApiError,
} from '@/shared/api';
import { PhoneModal, OTPModal } from '@/features';

const STATUS_MAP: Record<BookingStatus, { label: string; className: string }> = {
  pending:   { label: 'Ожидает',     className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Подтверждён', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменён',     className: 'bg-red-100 text-red-700' },
  completed: { label: 'Завершён',    className: 'bg-blue-100 text-blue-700' },
  no_show:   { label: 'Не явился',   className: 'bg-gray-100 text-gray-500' },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

function StatusBadge({ status }: { status?: BookingStatus }) {
  if (!status) return null;
  const s = STATUS_MAP[status];
  if (!s) return null;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}

function BookingCard({
  booking,
  onCancel,
  cancelling,
}: {
  booking: MyBooking;
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className='bg-white rounded-2xl border border-[#E7E7EE] p-4 flex flex-col gap-3 shadow-sm'>
      <div className='flex items-start justify-between gap-2'>
        <div>
          <p className='text-sm font-semibold text-[#333] leading-snug'>{booking.professional_name}</p>
          <p className='text-xs text-[#6B6B6B] mt-0.5'>#{booking.confirmation_code}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className='flex items-center gap-4 text-sm text-[#333]'>
        <div className='flex items-center gap-1.5'>
          <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
            <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
            <line x1='16' y1='2' x2='16' y2='6' />
            <line x1='8' y1='2' x2='8' y2='6' />
            <line x1='3' y1='10' x2='21' y2='10' />
          </svg>
          <span className='font-medium'>{formatDate(booking.date)}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' />
            <polyline points='12 6 12 12 16 14' />
          </svg>
          <span className='font-medium'>{booking.time}</span>
        </div>
      </div>

      {booking.total_price != null && (
        <p className='text-sm font-semibold text-[#007BFF]'>
          {booking.total_price.toLocaleString('ru-RU')} сом
        </p>
      )}

      {canCancel && (
        <button
          onClick={() => onCancel(booking.id)}
          disabled={cancelling}
          className='self-start text-xs font-medium text-red-500 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50'
        >
          {cancelling ? 'Отмена...' : 'Отменить запись'}
        </button>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className='bg-white rounded-2xl border border-[#E7E7EE] p-4 flex flex-col gap-3 animate-pulse'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-4 w-40 bg-gray-200 rounded' />
          <div className='h-3 w-24 bg-gray-200 rounded' />
        </div>
        <div className='h-6 w-20 bg-gray-200 rounded-full' />
      </div>
      <div className='flex gap-4'>
        <div className='h-4 w-24 bg-gray-200 rounded' />
        <div className='h-4 w-16 bg-gray-200 rounded' />
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const fetchBookings = async (t: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getMyBookings(t);
      setBookings(res.data);
    } catch {
      if (!silent) setBookings([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    if (!t) { setLoading(false); return; }
    fetchBookings(t);

    // Обновляем статусы, когда пользователь возвращается на вкладку
    // (например, после оплаты брони на странице банка)
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      const current = getToken();
      if (current) fetchBookings(current, true);
    };
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  const handlePhoneSubmit = async (phone: string, fullName: string) => {
    setPhoneError('');
    setIsPhoneLoading(true);
    try {
      await sendOtp({ phone, full_name: fullName });
      setCurrentPhone(phone);
      setCurrentName(fullName);
      setIsPhoneModalOpen(false);
      setIsOtpModalOpen(true);
    } catch (err) {
      setPhoneError((err as ApiError).message ?? 'Ошибка отправки кода');
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpError('');
    try {
      await sendOtp({ phone: currentPhone, full_name: currentName });
    } catch (err) {
      setOtpError((err as ApiError).message ?? 'Ошибка повторной отправки');
    }
  };

  const handleOtpSubmit = async (code: string) => {
    setOtpError('');
    setIsOtpLoading(true);
    try {
      const verifyResult = await verifyOtp({ phone: currentPhone, code });
      let access_token: string;
      if (!verifyResult.needs_profile) {
        access_token = verifyResult.access_token!;
      } else {
        const profileRes = await completeProfile(
          { phone: currentPhone, full_name: currentName },
          verifyResult.code!,
        );
        access_token = profileRes.access_token;
      }
      setToken(access_token);
      setTokenState(access_token);
      localStorage.setItem('saved_phone', currentPhone);
      localStorage.setItem('saved_name', currentName);
      setIsOtpModalOpen(false);
      await fetchBookings(access_token);
    } catch (err) {
      setOtpError((err as ApiError).message ?? 'Неверный код');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!token) return;
    setCancellingId(id);
    try {
      await cancelBooking(id, token);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b)),
      );
    } catch {
      // silent
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <div className='max-w-2xl mx-auto px-4 py-6'>
        <div className='flex items-center gap-3 mb-6'>
          <Link
            href='/'
            className='flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Назад'
          >
            <svg width='18' height='18' viewBox='0 0 16 16' fill='none'>
              <path d='M10 12L6 8L10 4' stroke='#333' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </Link>
          <h1 className='text-lg font-semibold text-[#333]'>История записей</h1>
        </div>

        {!loading && !token && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <svg width='56' height='56' viewBox='0 0 56 56' fill='none'>
              <circle cx='28' cy='28' r='28' fill='#F6F6F6' />
              <path d='M28 18a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 12c7.18 0 13 2.91 13 6.5V38H15v-1.5C15 32.91 20.82 30 28 30Z' fill='#C7C7C7' />
            </svg>
            <p className='mt-4 text-sm font-semibold text-[#333]'>Вы не авторизованы</p>
            <p className='mt-1 text-xs text-[#6B6B6B]'>Войдите, чтобы увидеть историю записей</p>
            <button
              onClick={() => setIsPhoneModalOpen(true)}
              className='mt-5 bg-[#007BFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#0069D9] transition-colors'
            >
              Войти
            </button>
          </div>
        )}

        {loading && (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && token && bookings.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <svg width='56' height='56' viewBox='0 0 56 56' fill='none'>
              <circle cx='28' cy='28' r='28' fill='#F6F6F6' />
              <rect x='18' y='17' width='20' height='22' rx='3' fill='#C7C7C7' />
              <rect x='22' y='22' width='12' height='2' rx='1' fill='white' />
              <rect x='22' y='26' width='8' height='2' rx='1' fill='white' />
            </svg>
            <p className='mt-4 text-sm font-semibold text-[#333]'>Записей пока нет</p>
            <p className='mt-1 text-xs text-[#6B6B6B]'>Ваши записи к специалистам появятся здесь</p>
            <Link
              href='/'
              className='mt-5 bg-[#007BFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#0069D9] transition-colors'
            >
              Записаться
            </Link>
          </div>
        )}

        {!loading && token && bookings.length > 0 && (
          <div className='flex flex-col gap-3'>
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={handleCancel}
                cancelling={cancellingId === b.id}
              />
            ))}
          </div>
        )}
      </div>

      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => { setIsPhoneModalOpen(false); setPhoneError(''); }}
        onContinue={handlePhoneSubmit}
        error={phoneError}
        isLoading={isPhoneLoading}
      />

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => { setIsOtpModalOpen(false); setOtpError(''); }}
        onSubmit={handleOtpSubmit}
        onResend={handleResend}
        phoneNumber={currentPhone}
        error={otpError}
        isLoading={isOtpLoading}
      />
    </>
  );
}
