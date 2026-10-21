import {
  //   Donation,
  GetLastDonationsQuery,
  GetPotQuery,
} from '@/graphql/generated/schema';
import Typography from '../commons/typography/Typography';

type DonationSummaryProps = {
  pot: GetPotQuery | undefined;
  isPotLoading: boolean;
  lastDonations: GetLastDonationsQuery | undefined;
  isLastDonationsLoading: boolean;
};

type DonationUser = {
  email: string;
  name?: string | null | undefined;
};

type Donation = {
  amount: number;
  createdAt?: Date;
  id: number;
  isAnonymous: boolean;
  user: DonationUser;
};

export default function DonationSummary({
  pot,
  isPotLoading,
  lastDonations,
  isLastDonationsLoading,
}: DonationSummaryProps) {
  const getDonorName = (donation: Donation) => {
    if (donation.isAnonymous) {
      return 'Anonymous';
    }
    if (donation.user && donation.user.name) {
      return donation.user.name;
    }
    return 'Unknown';
  };

  // replace by loader component
  if (isPotLoading && isLastDonationsLoading) return null;

  return (
    <section className='mt-4 flex glassCard shadow-2xl p-7'>
      <div className='flex flex-col'>
        <Typography variant='subheading' className='font-semibold'>
          Cagnotte Globale
        </Typography>
        <Typography variant='heading' className='pt-2'>
          {pot?.getPot}€
        </Typography>
      </div>
      <div className='flex flex-col pl-20'>
        <Typography variant='subheading' className='font-semibold'>
          Derniers Dons
        </Typography>
        <div className='flex pt-2'>
          <div className='flex flex-col'>
            {lastDonations?.getLastDonations.slice(0, 4).map((donation) => (
              <Typography key={donation.id}>
                <span className='text-light_green font-medium pr-4'>
                  +{donation.amount}€
                </span>{' '}
                par {getDonorName(donation)}
              </Typography>
            ))}
          </div>
          <div className='flex flex-col ml-4'>
            {lastDonations?.getLastDonations.slice(4, 8).map((donation) => (
              <Typography key={donation.id}>
                <span className='text-light_green font-medium pr-4'>
                  +{donation.amount}€
                </span>{' '}
                par {getDonorName(donation)}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
