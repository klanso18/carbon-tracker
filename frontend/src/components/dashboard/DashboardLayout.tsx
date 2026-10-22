import {
  useGetAllPostsQuery,
  useGetSumByCategoryQuery,
  useGetSumByMonthQuery,
} from '@/graphql/generated/schema';
import ByMonthChart from './dataViz/ByMonthChart';
import CategoryChart from './dataViz/CategoryChart';
import LastActivitiesListWidget from './lastActivitiesList/LastActivitiesListWidget';
import LastPostWidget from './lastPost/LastPostWidget';
import Button from '../commons/buttons/Button';
import Typography from '../commons/typography/Typography';
import { useUser } from '@/contexts/UserContext';
import { useAlert } from '@/contexts/AlertContext';

export default function DashboardLayout() {
  const { showAlert } = useAlert();
  const { user } = useUser();

  const {
    data: sumsByCategories,
    loading: loadingByCategory,
    refetch: refetchTotalsByCategories,
  } = useGetSumByCategoryQuery();

  const {
    data: sumsByMonth,
    loading: loadingByMonth,
    refetch: refetchTotalsByMonth,
  } = useGetSumByMonthQuery();
  refetchTotalsByMonth();
  refetchTotalsByCategories();

  const { data, refetch: handleRefetchPosts } = useGetAllPostsQuery();

  const userHasName = user?.name != null;

  const copyToClipboard = () => {
    const userId = user?.id;
    navigator.clipboard.writeText(
      `https://develop.carbon-tracker.0923-bleu-1.wns.wilders.dev/profile/${userId}`,
    );
    showAlert('Copier dans le presse-papier !', 'success');
  };

  return (
    <div className='flex h-full text-white max-[960px]:flex-col'>
      <div className='w-7/12 h-full min-h-fit max-[960px]:w-full'>
        <div className='h-[44%] p-3 max-[960px]: min-h-fit'>
          <div className='h-full glassCard shadow-2xl p-7 min-h-fit flex flex-col'>
            <div className='mb-4 flex items-center justify-between'>
              <Typography as='h1' variant='heading'>
                Bienvenue{' '}
                <span className='text-sm font-light text-white/70'>
                  Répartition d&apos;émissions par catégories
                </span>
              </Typography>
              {userHasName ? (
                <Button variant='outline' onClick={copyToClipboard}>
                  Partager mon profil
                </Button>
              ) : null}
            </div>
            <div className='flex-1 min-h-0'>
              <CategoryChart
                dataByCategory={sumsByCategories?.getSumByCategory ?? []}
                loading={loadingByCategory}
              />
            </div>
          </div>
        </div>
        <div className='h-[28%]  p-3'>
          <div className='h-full glassCard shadow-2xl p-7 flex flex-col'>
            <div className='mb-4 flex items-center justify-between'>
              <Typography as='h2' variant='heading'>
                Dépenses annuelles
              </Typography>
            </div>
            <div className='flex-1 min-h-0'>
              <ByMonthChart
                dataByMonth={sumsByMonth?.getSumByMonth ?? []}
                loading={loadingByMonth}
              />
            </div>
          </div>
        </div>
        <div className='h-[28%]  p-3'>
          <LastPostWidget
            posts={data?.getAllPosts ?? []}
            handleRefetchPosts={handleRefetchPosts}
          />
        </div>
      </div>
      <div className='w-5/12 p-3  h-full max-[960px]:w-full'>
        <LastActivitiesListWidget
          handleRefetch={() => {
            refetchTotalsByCategories();
            refetchTotalsByMonth();
          }}
        />
      </div>
    </div>
  );
}
