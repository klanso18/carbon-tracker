import { useState } from 'react';
import Typography from '../commons/typography/Typography';
import getDateFormated from '@/utils/dateFormater';
import InputCheckbox from '@/components/commons/inputs/InputCheckbox';
import ActivityEntryActionsModal from './ActivityEntryActionsModal';
import {
  useCreateActivityEntryMutation,
  useDeleteActivityEntryMutation,
} from '@/graphql/generated/schema';
import { EntryData } from '@/types';
import Highlight from '../commons/search/Highlight';

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
  return (
    <div className='flex justify-between items-center p-4 border-b border-white/10 last:border-b-0 text-white transition-colors hover:bg-white/5'>
      <div className='flex items-center w-[20%] min-w-fit max-[1500px]:w-[25%] max-lg:w-fit mr-2'>
        <div className='p-2 mr-7 max-lg:mr-1 max-sm:mr-0'>
          <InputCheckbox
            id={entryData.id.toString()}
            label=''
            checked={selected}
            onChange={onCheckChange}
            variant='dark'
          />
        </div>
        <div className='min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px]'>
          <img
            alt={entryData.category.name}
            src={`/${entryData.category.name.toLocaleLowerCase()}.svg`}
            className='w-full h-full'
          />
        </div>
        <div className='ml-5 text-light_blue grow max-lg:hidden'>
          <div className='poppins-semiBold text-light_blue text-left '>
            <Highlight search={searchedTerm ?? ''}>
              {entryData.category.name}
            </Highlight>
          </div>
        </div>
      </div>

      <div className='mr-5 w-[20%] grow'>
        <div className='poppins-semiBold text-white text-left max-xl:text-lg max-lg:text-sm'>
          <Highlight search={searchedTerm ?? ''}>{entryData?.name}</Highlight>
        </div>
      </div>
      <div className='flex w-[20%] justify-beetwen gap-3 max-sm:flex-col gap-0'>
        <div className='flex items-center justify-end w-[40%] grow max-sm:w-full'>
          <Typography customClass='text-sm font-light text-white/70 text-left max-sm:text-sm text-right'>
            <Highlight search={searchedTerm ?? ''}>
              {getDateFormated(entryData.spendedAt)}
            </Highlight>
          </Typography>
        </div>

        <div className='flex items-center justify-end w-[60%] max-sm:w-full'>
          <Typography className='text-light_green poppins-bold 2xl:text-xl xl:text-lg lg:text-md'>
            <Highlight search={searchedTerm ?? ''}>
              {entryData?.input.toString()}
            </Highlight>
          </Typography>
          <Typography
            className='text-white poppins-bold ml-2'
            customClass='text-sm text-white text-left max-sm:text-xs'
          >
            {' '}
            kgCO2
          </Typography>
        </div>
      </div>

      <div
        onClick={() => setShowActionModal((s) => !s)}
        className='ml-7 cursor-pointer p-2 relative max-lg:ml-2'
      >
        <img src='/vertical-dots.svg' width={6} height={4} className='invert' />
        <ActivityEntryActionsModal
          onClose={() => setShowActionModal(false)}
          isOpened={showActionModal}
          actions={modalActions}
          alignment='right'
        />
      </div>
    </div>
  );
}
