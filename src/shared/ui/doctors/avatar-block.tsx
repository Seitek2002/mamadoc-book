import Image, { StaticImageData } from 'next/image';

export const AvatarBlock = ({
  photo,
  fullName,
  specialty,
}: {
  photo: StaticImageData;
  fullName: string;
  specialty: string;
}) => {
  return (
    <div className='w-32.25 relative lg:w-full lg:h-52.25 shrink-0 flex justify-center items-stretch'>
      <Image
        src={photo}
        alt={fullName}
        className='shrink-0 object-cover w-full h-full'
        placeholder='blur' // Встроенный "скелетон" от Next.js
      />
      <span className='absolute right-0 bottom-0 px-2 py-1.5 rounded-tl-[10px] hidden lg:inline text-xs font-semibold text-gray bg-white'>
        {specialty}
      </span>
    </div>
  );
};
