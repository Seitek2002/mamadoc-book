'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchIcon from '@/shared/assets/icons/search/search-icon.svg';
import type { ApiSpecialist } from '@/shared/mock';
import { Specialists } from '../specialists';

interface SearchBarProps {
  specialists: ApiSpecialist[];
  org?: string;
  branch?: string;
  specialty?: string;
  initialQuery?: string;
}

export const SearchBar = ({ specialists, org, branch, specialty, initialQuery = '' }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = query.trim()
    ? specialists.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : specialists;

  const buildSpecialtyHref = (specialistSlug: string) => {
    const params = new URLSearchParams();
    if (org) params.set('org', org);
    if (branch) params.set('branch', branch);
    params.set('specialty', specialistSlug);
    return `${pathname}?${params}`;
  };

  const resetHref = (() => {
    const params = new URLSearchParams();
    if (org) params.set('org', org);
    if (branch) params.set('branch', branch);
    return `${pathname}?${params}`;
  })();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set('q', query.trim());
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params}`);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className='w-full flex-1 lg:bg-white lg:p-4 rounded-[10px]'>
      <label
        htmlFor='search'
        className='border border-[#DADADE] w-full flex items-center rounded-lg relative'
      >
        <input
          type='text'
          placeholder='Поиск'
          id='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full font-medium px-4 py-2.5'
        />
        <SearchIcon className='shrink-0 absolute right-2.5' />
      </label>

      <div className='hidden lg:flex flex-col gap-2.5 mt-3'>
        {specialty && (
          <Link
            href={resetHref}
            className='text-xs font-medium text-[#007BFF] self-end hover:underline'
          >
            Сбросить
          </Link>
        )}
        {filtered.map((el) => (
          <Specialists
            key={el.id}
            id={el.id}
            title={el.title}
            img={el.icon_url}
            href={buildSpecialtyHref(el.slug)}
            isActive={el.slug === specialty}
          />
        ))}
      </div>
    </div>
  );
};
