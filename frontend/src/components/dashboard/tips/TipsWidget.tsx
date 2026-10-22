import DashboardCard from '../DashboardCard';
import ComingSoon from '../ComingSoon';

// TODO: suggest actions for the user's highest-emitting category (ADEME Nos Gestes Climat model)
export default function TipsWidget() {
  return (
    <DashboardCard title='Mon levier principal'>
      <ComingSoon description='Des gestes concrets pour réduire votre catégorie la plus émettrice.' />
    </DashboardCard>
  );
}
