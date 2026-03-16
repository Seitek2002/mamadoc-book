import Image from 'next/image';
import Link from 'next/link';
import { DoctorPreview } from '@/shared/assets/images/doctors';

export const Doctors = ({ el }: { el: DoctorPreview }) => {
  return (
    <Link
      href={'/doctor/' + el.id}
      className='flex lg:flex-col lg:w-57.5 rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE]'
    >
      <div className='w-32.25 h-42 relative lg:w-full lg:h-52.25 shrink-0 flex justify-center items-center'>
        <Image
          src={el.photo}
          alt={el.fullName}
          className='shrink-0 object-cover w-full h-full'
        />
        <span className='absolute right-0 bottom-0 px-2 py-1.5 rounded-tl-[10px] hidden lg:inline text-xs font-semibold text-gray bg-white'>
          {el.specialty}
        </span>
      </div>
      <div className='p-2.5 flex flex-col flex-1'>
        <div>
          <h2 className='text-sm font-medium line-clamp-2'>{el.fullName}</h2>
          <span className='lg:hidden text-xs font-semibold text-gray'>
            {el.specialty}
          </span>
        </div>
        <div className='mt-auto'>
          <div className='mb-1.5'>
            <span className='text-xs font-medium text-green mb-1'>
              Свободные окна{' '}
              <span className='lowercase'>{el.availability.label}:</span>
            </span>
            <div className='text-xs font-medium text-success flex gap-1'>
              {el.availability.slots.map((el, i) => (
                <span className='bg-mint-100 rounded-full px-2 py-0.5' key={i}>
                  {el}
                </span>
              ))}
              {el.availability.moreCount > 0 && (
                <span className='bg-[#A0A0A0] rounded-full px-2 py-0.5 text-white flex items-center gap-0.5 ml-auto'>
                  +{el.availability.moreCount}
                  <ArrowIcon />
                </span>
              )}
            </div>
          </div>
          <button className='text-xs border w-full rounded-full py-1.5 border-[#C7C7C7]'>
            Записаться
          </button>
        </div>
      </div>
    </Link>
  );
};

const ArrowIcon = () => (
  <svg
    width='9'
    height='14'
    viewBox='0 0 9 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7.27852 7.30953L2.90352 11.6845C2.86288 11.7252 2.81462 11.7574 2.76151 11.7794C2.7084 11.8014 2.65148 11.8127 2.59399 11.8127C2.53651 11.8127 2.47959 11.8014 2.42648 11.7794C2.37337 11.7574 2.32511 11.7252 2.28446 11.6845C2.24381 11.6439 2.21157 11.5956 2.18957 11.5425C2.16757 11.4894 2.15625 11.4325 2.15625 11.375C2.15625 11.3175 2.16757 11.2606 2.18957 11.2075C2.21157 11.1544 2.24381 11.1061 2.28446 11.0655L6.35048 7L2.28446 2.93453C2.20237 2.85244 2.15625 2.7411 2.15625 2.625C2.15625 2.5089 2.20237 2.39756 2.28446 2.31547C2.36655 2.23338 2.4779 2.18726 2.59399 2.18726C2.71009 2.18726 2.82143 2.23338 2.90352 2.31547L7.27852 6.69047C7.3192 6.7311 7.35147 6.77935 7.37349 6.83246C7.3955 6.88557 7.40684 6.9425 7.40684 7C7.40684 7.05749 7.3955 7.11442 7.37349 7.16754C7.35147 7.22065 7.3192 7.2689 7.27852 7.30953Z'
      fill='white'
    />
  </svg>
);
