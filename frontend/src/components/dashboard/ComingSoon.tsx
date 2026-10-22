import Typography from '@/components/commons/typography/Typography';

type Props = {
  description: string;
};

// Temporary content for dashboard widgets whose data is not wired yet
export default function ComingSoon({ description }: Props) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2 text-center'>
      <Typography className='text-light_green font-semibold'>
        Bientôt disponible
      </Typography>
      <Typography className='text-white/70'>{description}</Typography>
    </div>
  );
}
