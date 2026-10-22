import { ReactNode } from 'react';
import clsx from 'clsx';
import Typography from '@/components/commons/typography/Typography';

type Props = {
  title: string;
  children: ReactNode;
  // Optional element shown on the right of the title (button, link...)
  action?: ReactNode;
  className?: string;
};

// Shared glass card shell for dashboard widgets: same padding, heading and spacing everywhere
export default function DashboardCard({
  title,
  children,
  action,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'glassCard shadow-2xl p-7 flex flex-col h-full',
        className,
      )}
    >
      <div className='mb-4 flex items-center justify-between'>
        <Typography as='h2' variant='heading'>
          {title}
        </Typography>
        {action}
      </div>
      <div className='flex-1 min-h-0'>{children}</div>
    </div>
  );
}
