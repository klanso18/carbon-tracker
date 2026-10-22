import DashboardCard from '../DashboardCard';
import ComingSoon from '../ComingSoon';

// TODO: compare the user's footprint with the French average and the 2050 target
export default function CarbonGoalWidget() {
  return (
    <DashboardCard title='Où j’en suis ?'>
      <ComingSoon description='Votre empreinte comparée à la moyenne française et à l’objectif 2050.' />
    </DashboardCard>
  );
}
