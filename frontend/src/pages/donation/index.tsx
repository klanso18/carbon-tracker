import Layout from '@/components/layout';
import {
  useCreateDonationMutation,
  useGetLastDonationsQuery,
  useGetPotQuery,
} from '@/graphql/generated/schema';
import DonationForm from '@/components/donation/DonationForm';
import DonationSummary from '@/components/donation/DonationSummary';

export default function DonationSection() {
  const {
    data: pot,
    loading: isPotLoading,
    refetch: refetchPot,
  } = useGetPotQuery();

  const {
    data: lastDonations,
    loading: isLastDonationsLoading,
    refetch: refetchDonations,
  } = useGetLastDonationsQuery();

  const [createDonationMutation] = useCreateDonationMutation();

  const handleSubmitNewDonation = async (amount: number) => {
    try {
      const { data } = await createDonationMutation({
        variables: {
          amount,
        },
      });

      if (data) {
        refetchPot();
        refetchDonations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title='Faire un don' themed>
      <main className='w-full flex flex-col p-10 pb-0 max-[1710px]:p-2'>
        <DonationForm handleSubmitNewDonation={handleSubmitNewDonation} />
        <DonationSummary
          pot={pot}
          isPotLoading={isPotLoading}
          lastDonations={lastDonations}
          isLastDonationsLoading={isLastDonationsLoading}
        />
      </main>
    </Layout>
  );
}
