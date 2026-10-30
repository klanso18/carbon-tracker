import Link from 'next/link';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Typography from '@/components/commons/typography/Typography';
import { GetProfileQuery } from '@/graphql/generated/schema';

type Props = {
  donations?: GetProfileQuery['getMyDonations'];
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

export default function MyDonations({ donations }: Props) {
  return (
    <DashboardCard
      title='Mes derniers dons'
      action={
        <Link
          href='/donation'
          className='font-poppins text-sm text-light_green underline underline-offset-4 hover:text-white'
        >
          Faire un don
        </Link>
      }
    >
      {donations?.length === 0 && (
        <Typography className='text-white/70'>
          Vos dons apparaîtront ici.
        </Typography>
      )}
      <ul>
        {donations?.map((donation) => (
          <li
            key={donation.id}
            className='flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-b-0'
          >
            <Typography className='font-light'>
              {dateFormatter.format(new Date(donation.createdAt))}
              {donation.isAnonymous && (
                <span className='ml-2 text-white/70'>(anonyme)</span>
              )}
            </Typography>
            <Typography customClass='font-semibold text-light_green shrink-0'>
              {donation.amount} €
            </Typography>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
