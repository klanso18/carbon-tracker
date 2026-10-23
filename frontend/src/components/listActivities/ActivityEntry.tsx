import { MouseEvent, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import getDateFormated from '@/utils/dateFormater';
import formatEmission, { EMISSION_UNIT } from '@/utils/numberFormater';
import InputCheckbox from '@/components/commons/inputs/InputCheckbox';
import ActivityEntryActionsModal from './ActivityEntryActionsModal';
import {
  useCreateActivityEntryMutation,
  useDeleteActivityEntryMutation,
} from '@/graphql/generated/schema';
import { EntryData } from '@/types';
import Highlight from '../commons/search/Highlight';

// Approximate height of the 3-item actions menu, in px
const MENU_HEIGHT = 140;

type Props = {
  entryData: EntryData;
  selected: boolean;
  searchedTerm: string;
  onCheckChange: () => void;
  onUpdate: (entry: EntryData) => void;
  handleRefetch: () => void;
};

export default function ActivityEntry({
  entryData,
  selected,
  searchedTerm,
  onCheckChange,
  onUpdate,
  handleRefetch,
}: Props) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const [deleteActivity] = useDeleteActivityEntryMutation();
  const [createActivity] = useCreateActivityEntryMutation();

  const handleModify = () => {
    onUpdate(entryData);
  };

  const handleDuplicate = async (entry: EntryData) => {
    try {
      await createActivity({
        variables: {
          data: {
            name: entry.name,
            input: entry.input,
            category: { id: entry.category.id },
            spendedAt: entry.spendedAt,
          },
        },
      });
      handleRefetch();
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDelete = async (entry: EntryData) => {
    try {
      await deleteActivity({ variables: { activityEntryId: entry.id } });
      handleRefetch();
    } catch (error) {
      // console.log(error);
    }
  };

  const modalActions = [
    {
      label: 'Modifier',
      action: () => handleModify(),
    },
    {
      label: 'Dupliquer',
      action: () => handleDuplicate(entryData),
    },
    {
      label: 'Supprimer',
      action: () => handleDelete(entryData),
    },
  ];

  // The list scrolls inside its card, which would clip a menu opened downwards on the
  // last rows: open it upwards when there is not enough room below the trigger
  const toggleActionMenu = (e: MouseEvent<HTMLButtonElement>) => {
    const { bottom } = e.currentTarget.getBoundingClientRect();
    setMenuDirection(window.innerHeight - bottom < MENU_HEIGHT ? 'up' : 'down');
    setShowActionModal((s) => !s);
  };

  const formattedDate = getDateFormated(entryData.spendedAt);

  // Fixed column template so dates and values line up from one row to the next.
  // Mobile drops the date column: the date moves under the name.
  return (
    <div className='grid grid-cols-[auto_40px_minmax(0,1fr)_auto_9rem_auto] max-sm:grid-cols-[auto_40px_minmax(0,1fr)_auto_auto] items-center gap-4 max-sm:gap-3 p-4 border-b border-white/10 last:border-b-0 text-white transition-colors hover:bg-white/5'>
      <InputCheckbox
        id={entryData.id.toString()}
        label=''
        checked={selected}
        onChange={onCheckChange}
        variant='dark'
      />
      <img
        alt={entryData.category.name}
        src={`/${entryData.category.name.toLocaleLowerCase()}.svg`}
        className='w-10 h-10'
      />
      <div className='min-w-0'>
        <p className='poppins-semiBold truncate'>
          <Highlight search={searchedTerm ?? ''}>{entryData.name}</Highlight>
        </p>
        <p className='text-sm text-light_blue truncate'>
          <Highlight search={searchedTerm ?? ''}>
            {entryData.category.name}
          </Highlight>
          <span className='sm:hidden text-white/70'>
            {' · '}
            <Highlight search={searchedTerm ?? ''}>{formattedDate}</Highlight>
          </span>
        </p>
      </div>
      <p className='text-sm font-light text-white/70 max-sm:hidden'>
        <Highlight search={searchedTerm ?? ''}>{formattedDate}</Highlight>
      </p>
      <p className='text-right whitespace-nowrap'>
        <span className='text-light_green poppins-bold text-lg'>
          <Highlight search={searchedTerm ?? ''}>
            {formatEmission(entryData.input)}
          </Highlight>
        </span>
        <span className='ml-1 text-sm text-white/70'>{EMISSION_UNIT}</span>
      </p>
      <div className='relative'>
        <button
          type='button'
          onClick={toggleActionMenu}
          aria-label='Actions sur la dépense'
          aria-expanded={showActionModal}
          className='p-2 rounded-full transition-colors hover:bg-white/10'
        >
          <EllipsisVertical size={20} aria-hidden='true' />
        </button>
        <ActivityEntryActionsModal
          onClose={() => setShowActionModal(false)}
          isOpened={showActionModal}
          actions={modalActions}
          alignment='right'
          direction={menuDirection}
        />
      </div>
    </div>
  );
}
