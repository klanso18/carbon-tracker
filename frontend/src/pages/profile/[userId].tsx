import { useRouter } from 'next/router';
import {
  useGetSumByCategoryQuery,
  useGetSumByMonthQuery,
  useGetUserByIdQuery,
  useGetUserPostsQuery,
} from '@/graphql/generated/schema';
import Layout from '@/components/layout';
import CategoryChart from '@/components/dashboard/dataViz/CategoryChart';
import ByMonthChart from '@/components/dashboard/dataViz/ByMonthChart';
import LastPostWidget from '@/components/dashboard/lastPost/LastPostWidget';
import Typography from '@/components/commons/typography/Typography';

const ProfileStats = ({ userId }: { userId: string }) => {
  const { data: sumsByCategories, loading: loadingByCategory } =
    useGetSumByCategoryQuery({
      variables: { userId },
    });

  const { data: sumsByMonth, loading: loadingByMonth } = useGetSumByMonthQuery({
    variables: { userId },
  });

  const { data, refetch: handleRefetchPosts } = useGetUserPostsQuery({
    variables: { userId },
  });

  const totalCO2 =
    sumsByCategories?.getSumByCategory.reduce((total, category) => {
      return total + category.sumKgCO2;
    }, 0) || 0;

  const RECOMMENDED_CO2_EMISSION = 2300;

  const percentOfRecommendedEmissions = Math.round(
    ((totalCO2 ?? 0) / RECOMMENDED_CO2_EMISSION) * 100,
  );

  return (
    <div className='w-full h-full'>
      <div className='w-full h-[35%] p-3 flex gap-4 items-center'>
        <div className='w-3/4 h-full glassCard shadow-2xl p-7'>
          <h1 className='text-xl poppins-bold'>
            Répartition des émissons de CO2 par catégories
          </h1>

          <CategoryChart
            dataByCategory={sumsByCategories?.getSumByCategory ?? []}
            loading={loadingByCategory}
          />
        </div>
        <div className='flex flex-col items-center justify-center w-1/4 h-full glassCard shadow-2xl p-7'>
          <div className='flex items-end'>
            <Typography customClass='text-4xl lg:text-3xl xl:text-5xl font-bold mr-1 text-medium_orange'>
              {totalCO2}
            </Typography>
            <Typography customClass='text-lg lg:text-xl xl:text-3xl font-semibold text-white'>
              kgCO2
            </Typography>
          </div>
          <div>
            <Typography customClass='text-md font-light text-light_green text-center'>
              {percentOfRecommendedEmissions} % du total annuel recommandé
            </Typography>
          </div>
        </div>
      </div>

      <div className='h-[28%]  p-3'>
        <div className='h-full glassCard shadow-2xl p-7'>
          <div className='text-xl poppins-bold'>Dépenses annuelles</div>
          <ByMonthChart
            dataByMonth={sumsByMonth?.getSumByMonth ?? []}
            loading={loadingByMonth}
          />
        </div>
      </div>
      <div className='h-[28%]  p-3'>
        <LastPostWidget
          posts={data?.getUserPosts ?? []}
          handleRefetchPosts={handleRefetchPosts}
          readOnly
        />
      </div>
    </div>
  );
};

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;

  const userIdString = Array.isArray(userId) ? userId[0] : userId;

  const { data, loading } = useGetUserByIdQuery({
    variables: {
      id: userIdString ?? '',
    },
    skip: !userIdString,
  });

  return (
    <Layout title='Liste des activités' themed>
      <div className='h-[15vh] max-h-[128px] flex items-center px-7'>
        <Typography customClass='pageTitle'>
          Profil de {data?.userById?.name}
        </Typography>
      </div>
      <div className='flex h-screen'>
        {!loading && data?.userById && (
          <ProfileStats userId={data.userById?.id} />
        )}
      </div>
    </Layout>
  );
}
