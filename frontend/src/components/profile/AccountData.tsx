import Button from '@/components/commons/buttons/Button';
import Typography from '@/components/commons/typography/Typography';
import DashboardCard from '@/components/dashboard/DashboardCard';

type Props = {
  onDeleteAccount: () => void;
};

export default function AccountData({ onDeleteAccount }: Props) {
  return (
    <DashboardCard title='Mes données' className='!h-auto'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
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
