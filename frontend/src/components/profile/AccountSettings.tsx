import { ReactNode } from 'react';
import Button from '@/components/commons/buttons/Button';
import DashboardCard from '@/components/dashboard/DashboardCard';

type RowProps = {
  label: string;
  value: ReactNode;
  action?: ReactNode;
};

function SettingRow({ label, value, action }: RowProps) {
  return (
    <div className='flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-b-0'>
      <div className='min-w-0'>
        <dt className='text-sm text-white/70'>{label}</dt>
        <dd className='font-light break-words'>{value}</dd>
      </div>
      {action}
    </div>
  );
}

type Props = {
  name?: string | null;
  email?: string;
  onEditName: () => void;
  onEditPassword: () => void;
};

export default function AccountSettings({
  name,
  email,
  onEditName,
  onEditPassword,
}: Props) {
  return (
    <DashboardCard title='Mon compte'>
      <dl>
        <SettingRow
          label='Nom'
          value={name || 'Non renseigné'}
          action={
            <Button variant='outline' onClick={onEditName}>
              {name ? 'Modifier' : 'Ajouter'}
              <span className='sr-only'> le nom</span>
            </Button>
          }
        />
        <SettingRow
          label='E-mail'
          value={<span className='break-all'>{email}</span>}
        />
        <SettingRow
          label='Mot de passe'
          value='••••••••'
          action={
            <Button variant='outline' onClick={onEditPassword}>
              Modifier<span className='sr-only'> le mot de passe</span>
            </Button>
          }
        />
      </dl>
    </DashboardCard>
  );
}
