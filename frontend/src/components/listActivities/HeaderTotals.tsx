import { Plus } from 'lucide-react';
import Typography from '../commons/typography/Typography';
import Button from '../commons/buttons/Button';
import formatEmission from '@/utils/numberFormater';

type Props = {
  totalEmissions: number | undefined;
  onAddClick: () => void;
};
export default function HeaderTotals({ totalEmissions, onAddClick }: Props) {
  // getSumByCategory sums every entry since sign-up, so the total is all-time,
  // not yearly: it can't be compared to an annual target (see the dashboard goal widget)
  // Named grid areas, the total always on the right:
  // desktop: title + add button on the left, total on the right
  // mobile: title and total on the first row, add button below the total
  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-3 px-7 py-2 [grid-template-areas:"title_total""add_add"] md:min-h-[15vh] md:grid-cols-[auto_auto_1fr] md:gap-5 md:py-0 md:[grid-template-areas:"title_add_total"]'>
      <Typography as='h1' customClass='pageTitle' className='[grid-area:title]'>
        Mes dépenses
      </Typography>
      <div className='flex flex-col items-end justify-self-end [grid-area:total]'>
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
      {/* Primary action sits next to the page title, apart from the list tools */}
      <Button
        variant='outline'
        size='lg'
        className='text-lg flex items-center gap-2 justify-self-end md:justify-self-start [grid-area:add]'
        onClick={onAddClick}
      >
        <Plus size={20} aria-hidden='true' />
        {/* Short label on small screens rather than a lone boxed icon */}
        <span className='max-[970px]:hidden'>Ajouter une dépense</span>
        <span className='min-[971px]:hidden'>Ajouter</span>
      </Button>
    </div>
  );
}
