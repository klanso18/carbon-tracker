import ActiveFilterBagde from './ActiveFilterBagde';
import Button from '../commons/buttons/Button';
import getDateFormated from '@/utils/dateFormater';
import { Category } from '@/types';

interface Props {
  selectedCategoriesFilter: Category[];
  selectedDateFilter: { from: string; to: string };
  onClearFilters: () => void;
  onRemoveCategory: (category: Category) => void;
  onRemoveDateFilter: () => void;
}

export default function ActiveFiltersBar({
  selectedCategoriesFilter,
  selectedDateFilter,
  onClearFilters,
  onRemoveCategory,
  onRemoveDateFilter,
}: Props) {
  const showDateFilterBadge =
    selectedDateFilter.from !== '' || selectedDateFilter.to !== '';

  function getDateFilterBadgeContent() {
    switch (true) {
      case selectedDateFilter.from !== '' && selectedDateFilter.to !== '':
        return `Du ${getDateFormated(selectedDateFilter.from)} au ${getDateFormated(selectedDateFilter.to)}`;
      case selectedDateFilter.from !== '' && selectedDateFilter.to === '':
        return `Du ${getDateFormated(selectedDateFilter.from)} à aujourd'hui`;
      case selectedDateFilter.from === '' && selectedDateFilter.to !== '':
        return `Jusqu'au ${getDateFormated(selectedDateFilter.to)}`;
      default:
        return '';
    }
  }

  return (
    <div className='glassCard shadow-2xl flex items-center justify-between p-5'>
      <div className='flex flex-wrap'>
        {selectedCategoriesFilter.map((cat) => (
          <ActiveFilterBagde
            key={cat.id}
            content={cat.name}
            onRemoveClick={() => onRemoveCategory(cat)}
          />
        ))}
        {showDateFilterBadge && (
          <ActiveFilterBagde
            key={'dateFilterBadge'}
            content={getDateFilterBadgeContent()}
            onRemoveClick={onRemoveDateFilter}
          />
        )}
      </div>
      <div>
        <Button
          size='lg'
          variant='outline'
          className='text-lg flex items-center'
          onClick={onClearFilters}
        >
          <img src={'/trash-icon.svg'} />
          <span className='ml-2'>Supprimer les filtres</span>
        </Button>
      </div>
    </div>
  );
}
