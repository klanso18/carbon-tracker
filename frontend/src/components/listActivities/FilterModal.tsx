/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import InputLabel from '@/components/commons/inputs/InputLabel';
import { useCategoriesQuery } from '@/graphql/generated/schema';
import InputCheckbox from '../commons/inputs/InputCheckbox';
import useClickOutside from '@/utils/useClickOutside';
import { Category } from '@/types';

type Props = {
  isOpened: boolean;
  onClose: () => void;
  toggleCatSelection: (cat: Category) => void;
  setDateFilter: (date: { from: string; to: string }) => void;
  selectedDate: { from: string; to: string };
  selectedCategories: Category[];
  alignment?: 'right' | 'left';
};
export default function FilterModal({
  isOpened,
  onClose,
  toggleCatSelection,
  setDateFilter,
  selectedDate,
  selectedCategories,
  alignment = 'right',
}: Props) {
  const { data, loading } = useCategoriesQuery();
  const [opened, setOpened] = useState(isOpened);

  useEffect(() => {
    setOpened(isOpened);
  }, [isOpened]);
  const ref = useClickOutside(() => {
    onClose();
  }, opened);

  if (loading) return 'chargement';
  return (
    <>
      {opened && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className='glassPanel z-10 rounded-2xl p-7 min-w-[250px]'
          style={
            alignment === 'left'
              ? { left: '0%', position: 'absolute', top: '110%' }
              : { right: '0%', position: 'absolute', top: '110%' }
          }
        >
          <div className=' mb-5'>
            <div className='flex items-center justify-start py-2 px-5 poppins-semiBold'>
              Par catégories
            </div>
            {(data?.categories ?? []).map((cat: Category) => {
              return (
                <InputCheckbox
                  id={cat.id.toString()}
                  label={cat.name}
                  checked={(selectedCategories ?? []).some(
                    (selectedCat) => selectedCat.id === cat.id,
                  )}
                  onChange={() => toggleCatSelection(cat)}
                  variant='dark'
                  key={cat.id}
                />
              );
            })}
          </div>
          <div>
            <div className='flex items-center justify-start py-2 px-5 poppins-semiBold '>
              Par dates
            </div>
            <div className='flex flex-col gap-4'>
              <InputLabel
                id='from'
                label='Du'
                type='date'
                variant='dark'
                value={selectedDate.from ?? ''}
                onChange={(e) =>
                  setDateFilter({ ...selectedDate, from: e.target.value })
                }
              ></InputLabel>
              <InputLabel
                id='to'
                label='Au'
                type='date'
                variant='dark'
                value={selectedDate.to ?? ''}
                onChange={(e) =>
                  setDateFilter({ ...selectedDate, to: e.target.value })
                }
              ></InputLabel>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
