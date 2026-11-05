import { ChangeEvent } from 'react';
import { Pencil } from 'lucide-react';
import Typography from '@/components/commons/typography/Typography';
import formatEmission, { EMISSION_UNIT } from '@/utils/numberFormater';
import { ACCEPTED_IMAGE_TYPES } from '@/uploadImage';
import { GetProfileQuery } from '@/graphql/generated/schema';

type Props = {
  name?: string | null;
  email?: string;
  picture?: string | null;
  memberSince?: string | null;
  stats?: GetProfileQuery['getProfileStats'];
  onPictureChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
});

export default function ProfileHeader({
  name,
  email,
  picture,
  memberSince,
  stats,
  onPictureChange,
}: Props) {
  return (
    <section className='glassCard shadow-2xl p-7 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
      <div className='flex items-center gap-5 min-w-0'>
        <div className='relative shrink-0'>
          <img
            src={picture || '/icons/avatar.svg'}
            alt='Photo de profil'
            className='object-cover w-24 h-24 md:w-32 md:h-32 rounded-full ring-2 ring-white/40'
          />
          {/* sr-only rather than hidden: the input stays reachable with the keyboard */}
          <input
            type='file'
            id='file-input'
            accept={ACCEPTED_IMAGE_TYPES}
            className='peer sr-only'
            onChange={onPictureChange}
          />
          <label
            htmlFor='file-input'
            className='absolute bottom-0 right-0 bg-medium_green rounded-full p-2 cursor-pointer shadow-md transition-colors duration-300 hover:bg-light_green peer-focus-visible:ring-2 peer-focus-visible:ring-white'
          >
            <Pencil size={18} aria-hidden='true' />
            <span className='sr-only'>Changer la photo de profil</span>
          </label>
        </div>
        <div className='min-w-0'>
          <Typography
            customClass='text-xl md:text-2xl font-semibold'
            className='break-words'
          >
            {name || 'Nom à renseigner'}
          </Typography>
          <Typography className='text-white/70 break-all'>{email}</Typography>
          {memberSince && (
            <Typography className='text-light_green mt-1'>
              Membre depuis {monthFormatter.format(new Date(memberSince))}
            </Typography>
          )}
        </div>
      </div>

      <div className='flex flex-wrap items-end gap-x-10 gap-y-4 xl:flex-nowrap xl:shrink-0'>
        <div>
          <div className='flex items-baseline gap-1'>
            <Typography customClass='text-4xl md:text-5xl font-bold text-medium_orange'>
              {stats ? formatEmission(stats.totalKgCO2) : '–'}
            </Typography>
            <Typography customClass='text-lg font-semibold'>
              {EMISSION_UNIT}
            </Typography>
          </div>
          <Typography className='text-light_green'>
            Émissions enregistrées
          </Typography>
        </div>
        <div>
          <Typography customClass='text-2xl font-semibold'>
            {stats?.activityCount ?? '–'}
          </Typography>
          <Typography className='text-white/70'>
            {stats?.activityCount === 1 ? 'Activité' : 'Activités'}
          </Typography>
        </div>
        <div>
          <Typography customClass='text-2xl font-semibold'>
            {stats ? `${stats.totalDonated} €` : '–'}
          </Typography>
          <Typography className='text-white/70'>Donnés</Typography>
        </div>
      </div>
    </section>
  );
}
