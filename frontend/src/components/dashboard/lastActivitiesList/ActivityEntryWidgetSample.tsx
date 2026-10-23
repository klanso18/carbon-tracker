import Typography from '@/components/commons/typography/Typography';
import { ActivityEntriesQuery } from '@/graphql/generated/schema';
import getDateFormated from '@/utils/dateFormater';
import formatEmission, { EMISSION_UNIT } from '@/utils/numberFormater';

type Props = {
  entryData: ActivityEntriesQuery['activityEntries'][0];
};

export default function ActivityEntryWidgetSample({ entryData }: Props) {
  return (
    <div className='flex justify-between p-2 pb-4 border-b border-white/10 last:border-b-0 mb-4'>
      <div className='min-w-[50px] mr-5 flex'>
        <img
          alt={entryData.category.name}
          src={`${entryData.category.name.toLocaleLowerCase()}.svg`}
          width={35}
          height={35}
        />
      </div>
      <div className='flex flex-col grow items-left '>
        <div>
          <Typography className='poppins-semiBold text-white text-left'>
            {entryData?.name}
          </Typography>
        </div>
        <div>
          <Typography className='text-xs font-light text-white/70 text-left'>
            {getDateFormated(entryData.spendedAt)}
          </Typography>
        </div>
      </div>
      <div className='flex flex-col text-right min-w-[100px]'>
        <div>
          <Typography className='text-light_green poppins-bold text-lg'>
            {formatEmission(entryData.input)}
          </Typography>
        </div>
        <div>
          <Typography className='text-white/70'>{EMISSION_UNIT}</Typography>
        </div>
      </div>
    </div>
  );
}
