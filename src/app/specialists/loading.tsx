const Loading = () => (
  <div className='max-w-7xl mx-auto px-4 animate-pulse'>
    <div className='h-5 bg-gray-200 rounded w-72 mt-6 mb-3' />

    <div className='flex flex-col items-start mt-3 lg:flex-row lg:gap-7.5'>
      <div className='w-full lg:w-[33%]'>
        <div className='h-11 bg-gray-200 rounded-xl w-full' />
      </div>

      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 lg:mt-0'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE]'>
            <div className='w-full h-52 bg-gray-200' />
            <div className='p-2.5 flex flex-col gap-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-3 bg-gray-200 rounded w-1/2' />
              <div className='h-7 bg-gray-200 rounded-full mt-2' />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
