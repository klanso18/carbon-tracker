import { FormEvent } from 'react';
import { EntryData } from '@/types';
import InputLabel from '../commons/inputs/InputLabel';
import {
  useActivityEntriesQuery,
  useCategoriesQuery,
  useGetSumByCategoryQuery,
  useUpdateActivityEntryMutation,
} from '@/graphql/generated/schema';
import isoToDate from '@/utils/isoToDate';
import GenericModal from './GenericFormModal';

type Props = {
  onClose: () => void;
  entryData: EntryData;
};

export default function UpdateActivityModal({ entryData, onClose }: Props) {
  const { data } = useCategoriesQuery();
  const { refetch: refetchActivities } = useActivityEntriesQuery();
  const { refetch: refetchTotals } = useGetSumByCategoryQuery();

  const [updateActivity] = useUpdateActivityEntryMutation();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.input = parseFloat(formJSON.input);
    formJSON.category = {
      id: parseInt(formJSON.category, 10),
    };
    try {
      await updateActivity({
        variables: { data: { ...formJSON }, activityEntryId: entryData.id },
        onCompleted: async () => {
          await refetchActivities();
          await refetchTotals();
          onClose();
        },
      });
    } catch (error) {
      console.error('Une erreur est survenue:', error);
    }
  };
  return (
    <GenericModal
      title='Modifier une dépense carbone'
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className='pb-5'>
        <label
          htmlFor='category'
          className='block text-sm font-medium leading-6 text-white pb-2'
        >
          Catégorie
        </label>
        <select
          className='glassInput sm:text-sm'
          id='category'
          name='category'
          required
          defaultValue={entryData.category.id}
        >
          <option value='' disabled>
            Selectionner une catégorie
          </option>
          {(data?.categories ?? []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className='pb-5'>
        <InputLabel
          defaultValue={entryData.name}
          name='name'
          label="Nom de l'activité"
          placeholder='Mon trajet en voiture pour me rendre au travail'
          type='text'
          sizes='xl'
          variant='dark'
          autoComplete='name'
          required
        />
      </div>
      <div className='flex flex-row justify-start'>
        <div className='pb-5 w-4/12 mr-5'>
          <InputLabel
            defaultValue={entryData.input}
            name='input'
            label='Dépense carbone (en kg/CO2e)'
            placeholder='10'
            min={0}
            step={0.01}
            type='number'
            sizes='xl'
            variant='dark'
            autoComplete='input'
            required
          />
        </div>
        <div className='pb-5 w-4/12'>
          <InputLabel
            defaultValue={isoToDate(entryData.spendedAt)}
            name='spendedAt'
            label='Date de la dépense'
            type='date'
            sizes='xl'
            variant='dark'
          />
        </div>
      </div>
    </GenericModal>
  );
}
