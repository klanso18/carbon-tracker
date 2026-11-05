import { useState } from 'react';
import Button from '@/components/commons/buttons/Button';
import Typography from '@/components/commons/typography/Typography';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { useAlert } from '@/contexts/AlertContext';
import { useActivityEntriesLazyQuery } from '@/graphql/generated/schema';
import { buildActivitiesCsv, downloadCsv } from '@/utils/activitiesCsv';

type Props = {
  onDeleteAccount: () => void;
};

export default function AccountData({ onDeleteAccount }: Props) {
  const { showAlert } = useAlert();
  const [isExporting, setIsExporting] = useState(false);
  // network-only: the export must never come from a stale cache
  const [fetchActivities] = useActivityEntriesLazyQuery({
    fetchPolicy: 'network-only',
  });

  const handleExport = async () => {
    setIsExporting(true);
    const { data, error } = await fetchActivities();
    setIsExporting(false);

    if (error || !data) {
      showAlert("L'export a échoué, réessayez.", 'error');
      return;
    }
    if (data.activityEntries.length === 0) {
      showAlert('Aucune activité à exporter pour le moment.', 'warn');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(
      buildActivitiesCsv(data.activityEntries),
      `carbon-tracker-activites-${today}.csv`,
    );
  };

  return (
    <DashboardCard title='Mes données' className='!h-auto'>
      <div className='flex flex-col gap-4 py-3 border-b border-white/10 md:flex-row md:items-center md:justify-between'>
        <Typography className='text-white/70'>
          Téléchargez toutes vos activités dans un fichier CSV, lisible avec
          Excel ou LibreOffice.
        </Typography>
        <Button
          variant='outline'
          size='lg'
          onClick={handleExport}
          disabled={isExporting}
          className='shrink-0'
        >
          Exporter mes activités
        </Button>
      </div>
      <div className='flex flex-col gap-4 pt-3 md:flex-row md:items-center md:justify-between'>
        <Typography className='text-white/70'>
          Supprimer votre compte efface définitivement vos activités. Vos dons
          restent dans la cagnotte, sans votre nom.
        </Typography>
        <Button
          variant='outline'
          size='lg'
          onClick={onDeleteAccount}
          className='shrink-0 !border-red-400 !text-red-300 hover:!bg-red-500/10'
        >
          Supprimer mon compte
        </Button>
      </div>
    </DashboardCard>
  );
}
