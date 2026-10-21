/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  useCreateActivityEntryMutation,
  useDeleteActivityEntryMutation,
  useFilteredActivityEntriesQuery,
  useGetSumByCategoryQuery,
} from '@/graphql/generated/schema';
import Typography from '../commons/typography/Typography';
import InputCheckbox from '../commons/inputs/InputCheckbox';
import Button from '../commons/buttons/Button';
import InputLabel from '@/components/commons/inputs/InputLabel';
import ActivityEntryActionsModal from './ActivityEntryActionsModal';
import ActivityEntry from './ActivityEntry';
import { Category, EntryData } from '@/types';
import FilterModal from './FilterModal';
import AddActivityModal from '../modal/AddActivityModal';
import UpdateActivityModal from '../modal/UpdateActivityModal';
import ActiveFiltersBar from './ActiveFiltersBar';
import HeaderTotals from './HeaderTotals';

export default function ListActivities() {
  const { data: totals, refetch: refetchTotals } = useGetSumByCategoryQuery();

  const totalCo2Sum = totals?.getSumByCategory.reduce((acc, cat) => {
    return acc + Number(cat.sumKgCO2);
  }, 0);

  const [createActivity] = useCreateActivityEntryMutation();
  const [deleteActivity] = useDeleteActivityEntryMutation();
  const [selectedEntries, setSelectedEntries] = useState<EntryData[]>([]);
  const partiallyChecked = selectedEntries.length > 0;

  const [searchedTerm, setSearchedTerm] = useState('');
  const [selectedCategoriesFilter, setSelectedCategoriesFilter] =
    useState<Category[]>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<{
    from: string;
    to: string;
  }>({ from: '', to: '' });

  const [showActionModal, setShowActionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [entryToUpdate, setEntryToUpdate] = useState<EntryData | null>(null);

  const [skip, setSkip] = useState(0);
  const take = 15;
  const {
    data: filteredResults,
    loading: loadingFiltered,
    fetchMore,
    refetch,
  } = useFilteredActivityEntriesQuery({
    variables: {
      searchTerm: searchedTerm,
      categoryIds:
        selectedCategoriesFilter?.length === 0
          ? null
          : selectedCategoriesFilter?.map((cat) => cat.id),
      dateFrom:
        selectedDateFilter.from !== ''
          ? new Date(selectedDateFilter.from).toISOString()
          : null,
      dateTo:
        selectedDateFilter.to !== ''
          ? new Date(selectedDateFilter.to).toISOString()
          : null,
      skip,
      take,
    },
    fetchPolicy: 'network-only',
  });
  const [activityEntries, setActivityEntries] = useState(
    filteredResults?.filteredActivityEntries,
  );

  useEffect(() => {
    if (filteredResults?.filteredActivityEntries) {
      if (skip === 0) {
        setActivityEntries(filteredResults.filteredActivityEntries);
      } else {
        setActivityEntries((prev) => [
          ...(prev ?? []),
          ...filteredResults.filteredActivityEntries,
        ]);
      }
    }
  }, [filteredResults?.filteredActivityEntries]);

  useEffect(() => {
    setActivityEntries([]);
    setSkip(0);
    refetch();
  }, [searchedTerm, selectedCategoriesFilter, selectedDateFilter]);

  const handleLoadMore = () => {
    if (!loadingFiltered) {
      const newSkip = skip + take;
      fetchMore({
        variables: {
          skip: newSkip,
          take,
        },
      });
      setSkip(newSkip);
      setActivityEntries(filteredResults?.filteredActivityEntries ?? []);
    }
  };
  const hideLoadMoreButton =
    filteredResults?.filteredActivityEntries.length !== undefined &&
    filteredResults?.filteredActivityEntries.length < take;

  const showDateFilterBadge =
    selectedDateFilter.from !== '' || selectedDateFilter.to !== '';

  const showActiveFiltersBar =
    (selectedCategoriesFilter ?? []).length > 0 || showDateFilterBadge;

  const toggleSelect = (activity: EntryData): void => {
    const isSelected = selectedEntries.some((a) => a.id === activity.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isSelected
      ? setSelectedEntries((prev) => [...prev, activity])
      : setSelectedEntries((prev) => prev.filter((a) => a.id !== activity.id));
  };

  const handleDuplicateSelection = async () => {
    try {
      await Promise.all(
        selectedEntries.map(async (activity) => {
          try {
            await createActivity({
              variables: {
                data: {
                  name: activity.name,
                  input: activity.input,
                  category: { id: activity.category.id },
                  spendedAt: activity.spendedAt,
                },
              },
            });
          } catch (err) {
            // console.log(err);
          }
        }),
      );
      await refetch();
      await refetchTotals();
      setSelectedEntries([]);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleDeleteSelection = async () => {
    try {
      await Promise.all(
        selectedEntries.map(async (activity) => {
          try {
            await deleteActivity({
              variables: { activityEntryId: activity.id },
            });
          } catch (error) {
            console.error(error);
          }
        }),
      );
      await refetch();
      await refetchTotals();
      setSelectedEntries([]);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleUpdateEntry = (entry: EntryData) => {
    setEntryToUpdate(entry);
  };
  const modalActions = [
    {
      label: 'Dupliquer',
      action: () => handleDuplicateSelection(),
    },
    {
      label: 'Supprimer',
      action: () => handleDeleteSelection(),
    },
  ];

  const handleToggleCatSelection = (category: Category) => {
    const isSelected = (selectedCategoriesFilter ?? []).some(
      (cat) => cat.id === category.id,
    );
    !isSelected
      ? setSelectedCategoriesFilter((prev) => [...(prev ?? []), category])
      : setSelectedCategoriesFilter((prev) =>
          (prev ?? []).filter((cat) => cat.id !== category.id),
        );
  };

  return (
    <div className='flex  h-full text-black '>
      <div className=' w-full flex flex-col p-10 pb-0 max-[1710px]:p-2'>
        <HeaderTotals totalEmissions={totalCo2Sum} />
        {/* backdrop-blur creates a stacking context: lift the toolbar so its dropdowns render above the list */}
        <div className='glassCard shadow-2xl flex items-center justify-between p-5 relative z-10'>
          <div className='flex items-center'>
            <div className=''>
              <InputCheckbox
                id={'selectBarBox'}
                label=''
                disabled={activityEntries?.length === 0}
                checked={
                  activityEntries?.length === selectedEntries.length &&
                  activityEntries.length !== 0
                }
                partiallyChecked={
                  partiallyChecked &&
                  activityEntries?.length !== selectedEntries.length
                }
                onChange={() =>
                  partiallyChecked
                    ? setSelectedEntries([])
                    : setSelectedEntries(activityEntries ?? [])
                }
                variant='dark'
              />
            </div>
            <div
              className={clsx('cursor-pointer p-2 relative', {
                'opacity-25 cursor-default': selectedEntries.length === 0,
              })}
              onClick={() =>
                selectedEntries.length !== 0 && setShowActionModal(true)
              }
            >
              <img
                src='/vertical-dots.svg'
                width={6}
                height={4}
                className='invert'
              />
              <ActivityEntryActionsModal
                actions={modalActions}
                isOpened={showActionModal}
                onClose={() => setShowActionModal(false)}
                alignment='left'
              />
            </div>
            <div className='ml-10 max-[970px]:ml-2 mr-2'>
              <Button
                variant='outline'
                size='lg'
                className='text-lg flex items-center'
                onClick={() => setShowModalCreate(true)}
              >
                <img src={'/plus-icon.svg'} width={20} height={20} />{' '}
                <span className='ml-2 max-[970px]:hidden'>
                  Ajouter une dépense
                </span>
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='w-[300px]  max-[970px]:w-[200px]'>
              <InputLabel
                label=''
                placeholder='Rechercher'
                type='text'
                sizes='lg'
                value={searchedTerm}
                onChange={(e) => setSearchedTerm(e.target.value)}
                showLabel={false}
                variant='dark'
              />
            </div>
            <div className='ml-5 relative'>
              <Button
                variant='outline'
                size='lg'
                className='text-lg flex items-center'
                onClick={() => setShowFilterModal((s) => !s)}
              >
                <img src={'/filter-icon.svg'} width={20} height={20} />
                <span className='ml-2 max-[970px]:hidden'>Filtrer</span>
              </Button>
              <FilterModal
                selectedCategories={selectedCategoriesFilter ?? []}
                toggleCatSelection={(category) =>
                  handleToggleCatSelection(category)
                }
                setDateFilter={(date) => setSelectedDateFilter(date)}
                selectedDate={selectedDateFilter}
                isOpened={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                alignment='right'
              />
            </div>
          </div>
        </div>

        {showActiveFiltersBar && (
          <ActiveFiltersBar
            selectedCategoriesFilter={selectedCategoriesFilter ?? []}
            selectedDateFilter={selectedDateFilter}
            onClearFilters={() => {
              setSelectedCategoriesFilter([]);
              setSelectedDateFilter({ from: '', to: '' });
            }}
            onRemoveCategory={handleToggleCatSelection}
            onRemoveDateFilter={() =>
              setSelectedDateFilter({ from: '', to: '' })
            }
          />
        )}

        <div className='glassCard shadow-2xl overflow-auto h-max mt-3 p-2'>
          {activityEntries?.length !== 0 ? (
            activityEntries?.map((activity) => (
              <ActivityEntry
                onUpdate={(entry) => handleUpdateEntry(entry)}
                selected={selectedEntries.some((a) => a.id === activity.id)}
                entryData={activity}
                key={activity.id}
                onCheckChange={() => toggleSelect(activity)}
                searchedTerm={searchedTerm}
                handleRefetch={async () => {
                  await refetch();
                  await refetchTotals();
                }}
              />
            ))
          ) : (
            <div className='w-full min-h-[500px] flex justify-center mt-10 '>
              <Typography customClass='text-md font-light text-light_green'>
                Aucune activité ne correspond à vos filtres et recherche
              </Typography>
            </div>
          )}
          {!hideLoadMoreButton && (
            <div className='m-2 flex justify-center'>
              <Button variant='outline' onClick={() => handleLoadMore()}>
                voir plus
              </Button>
            </div>
          )}
        </div>
      </div>

      {showModalCreate && (
        <AddActivityModal
          onClose={() => setShowModalCreate(false)}
          refetchOnValidate={async () => {
            await refetchTotals();
            await refetch();
          }}
        />
      )}
      {showModalCreate && <div className='overlay'></div>}
      {entryToUpdate && (
        <UpdateActivityModal
          onClose={() => {
            setEntryToUpdate(null);
          }}
          entryData={entryToUpdate}
        />
      )}
      {entryToUpdate && <div className='overlay'></div>}
    </div>
  );
}
