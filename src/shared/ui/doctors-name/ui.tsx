import clsx, { ClassValue } from 'clsx';

export const DoctorsName = ({
  fullName,
  className,
}: {
  fullName: string;
  className?: ClassValue;
}) => {
  return (
    <h2 className={clsx('text-sm font-medium line-clamp-2', className)}>
      {fullName}
    </h2>
  );
};
