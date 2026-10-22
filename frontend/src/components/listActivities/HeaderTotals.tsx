import Typography from '../commons/typography/Typography';
import formatEmission from '@/utils/numberFormater';

type Props = {
  totalEmissions: number | undefined;
};
export default function HeaderTotals({ totalEmissions }: Props) {
  // getSumByCategory sums every entry since sign-up, so the total is all-time,
  // not yearly: it can't be compared to an annual target (see the dashboard goal widget)
  return (
    <div className='h-[15vh] max-h-[128px] flex justify-between items-center mb-2 px-7'>
      <Typography customClass='pageTitle'>Mes dépenses</Typography>
      <div className='flex flex-col items-end'>
        <div className='flex items-end'>
          <Typography customClass='text-4xl font-bold mr-1 text-medium_orange max-lg:text-3xl'>
            {totalEmissions !== undefined
              ? formatEmission(totalEmissions)
              : '–'}
          </Typography>
          <Typography customClass='text-lg lg:text-xl xl:text-3xl font-semibold text-white'>
            kgCO2
          </Typography>
        </div>
        <div>
          <Typography customClass='text-md text-right font-light text-light_green max-lg:text-sm'>
            Total de vos émissions
          </Typography>
        </div>
      </div>
    </div>
  );
}
