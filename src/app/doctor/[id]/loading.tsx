const Loading = () => (
  <div className='max-w-7xl mx-auto md:pt-0 animate-pulse'>
    <div className='px-0 lg:px-4 mb-4'>
      <div className='h-5 bg-gray-200 rounded w-64 md:mt-6' />
    </div>

    <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24 lg:pb-0'>
      <div className='lg:col-start-1 lg:row-start-1 mx-4'>
        <div className='flex items-stretch gap-3 bg-white md:p-5 mt-6 lg:mt-0 rounded-2xl'>
          <div className='w-[36%] h-40 shrink-0 bg-gray-200 rounded-l-[5px]' />
          <div className='flex flex-col justify-between py-2.5 flex-1 gap-2'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-1/2' />
            <div className='h-3 bg-gray-200 rounded w-1/3' />
          </div>
        </div>
      </div>

      <div className='lg:col-start-2 lg:row-start-1 lg:row-span-2 bg-white rounded-2xl p-4'>
        <div className='flex gap-2 mb-4'>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-1'>
              <div className='h-4 w-8 bg-gray-200 rounded' />
              <div className='h-3 w-6 bg-gray-200 rounded' />
            </div>
          ))}
        </div>
        <div className='grid grid-cols-4 gap-2 mt-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='h-8 bg-gray-200 rounded-full' />
          ))}
        </div>
      </div>

      <div className='lg:col-start-1 lg:row-start-2 bg-white rounded-2xl p-4 mx-4'>
        <div className='h-4 bg-gray-200 rounded w-40 mb-3' />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 py-3 border-b border-gray-100'>
            <div className='h-4 w-4 rounded-full bg-gray-200' />
            <div className='h-4 bg-gray-200 rounded flex-1' />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
