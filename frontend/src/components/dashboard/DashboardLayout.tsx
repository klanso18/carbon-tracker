import {
  useGetSumByCategoryQuery,
  useGetSumByMonthQuery,
} from '@/graphql/generated/schema';
import ByMonthChart from './dataViz/ByMonthChart';
import CategoryChart from './dataViz/CategoryChart';
import LastActivitiesListWidget from './lastActivitiesList/LastActivitiesListWidget';
import DashboardCard from './DashboardCard';
import EquivalencesWidget from './equivalences/EquivalencesWidget';
import CarbonGoalWidget from './carbonGoal/CarbonGoalWidget';
import TipsWidget from './tips/TipsWidget';
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

  const userHasName = user?.name != null;

  const copyToClipboard = () => {
    const userId = user?.id;
    navigator.clipboard.writeText(
      `https://develop.carbon-tracker.0923-bleu-1.wns.wilders.dev/profile/${userId}`,
    );
    showAlert('Copier dans le presse-papier !', 'success');
  };

  // Desktop: named grid areas place the widgets (charts in the wide left column,
  // equivalences and goal side by side below them). Mobile: one column in DOM order.
  // Height is only locked to the viewport on desktop: between 768px and 960px the layout
  // shell is already h-screen, and a viewport-high stacked column made the widgets overlap.
  return (
    <div className='grid min-[961px]:h-full grid-cols-1 text-white min-[961px]:grid-cols-[7fr_7fr_10fr] min-[961px]:grid-rows-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,3fr)] min-[961px]:[grid-template-areas:"welcome_welcome_activities""yearly_yearly_activities""equivalences_goal_tips"]'>
      <div className='p-3 min-h-fit min-[961px]:[grid-area:welcome]'>
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
      <div className='p-3 min-[961px]:[grid-area:equivalences]'>
        <EquivalencesWidget />
      </div>
      <div className='p-3 min-[961px]:[grid-area:goal]'>
        <CarbonGoalWidget />
      </div>
      {/* Chart.js runs with maintainAspectRatio: false, so the chart needs an explicit height on mobile */}
      <div className='p-3 h-80 min-[961px]:h-auto min-[961px]:[grid-area:yearly]'>
        <DashboardCard title='Dépenses annuelles'>
          <ByMonthChart
            dataByMonth={sumsByMonth?.getSumByMonth ?? []}
            loading={loadingByMonth}
          />
        </DashboardCard>
      </div>
      <div className='p-3 min-[961px]:[grid-area:tips]'>
        <TipsWidget />
      </div>
      {/* Last in the DOM so that, once stacked, its long list does not push the other widgets down */}
      <div className='p-3 min-[961px]:[grid-area:activities]'>
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
