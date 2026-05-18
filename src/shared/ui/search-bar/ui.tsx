'use client';

import { useState } from 'react';
import SearchIcon from '@/shared/assets/icons/search/search-icon.svg';
import { MOCK_SPECIALISTS } from '@/shared/mock';
import { Specialists } from '../specialists';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MOCK_SPECIALISTS.data.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase()),
      )
    : MOCK_SPECIALISTS.data;

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
      <div className='hidden lg:flex flex-col gap-2.5 my-3'>
        {filtered.map((el) => (
          <Specialists key={el.id} id={el.id} title={el.title} img={el.icon_url} />
        ))}
      </div>
    </div>
  );
};
