import DashboardCard from '../DashboardCard';
import ComingSoon from '../ComingSoon';

// TODO: convert the monthly emissions into concrete equivalents (ADEME Impact CO2 API)
export default function EquivalencesWidget() {
  return (
    <DashboardCard title='Ça représente quoi ?'>
      <ComingSoon description='Vos émissions du mois traduites en équivalents concrets : kilomètres en voiture, repas, streaming…' />
    </DashboardCard>
  );
}
