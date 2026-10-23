/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useEffect, useState } from 'react';
import { ChevronDown, Filter, Plus } from 'lucide-react';
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
import ActivityEntry from './ActivityEntry';
import { Category, EntryData } from '@/types';
import FilterModal from './FilterModal';
import AddActivityModal from '../modal/AddActivityModal';
import UpdateActivityModal from '../modal/UpdateActivityModal';
import ConfirmModal from '../modal/ConfirmModal';
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

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [entryToUpdate, setEntryToUpdate] = useState<EntryData | null>(null);
  // Entries waiting for the user's confirmation before being deleted
  const [entriesToDelete, setEntriesToDelete] = useState<EntryData[] | null>(
    null,
  );

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
  const allSelected =
    (activityEntries?.length ?? 0) > 0 &&
    activityEntries?.length === selectedEntries.length;

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

  const hasActiveFilters = searchedTerm !== '' || showActiveFiltersBar;
  const isListEmpty = (activityEntries ?? []).length === 0;

  const toggleSelect = (activity: EntryData): void => {
    const isSelected = selectedEntries.some((a) => a.id === activity.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isSelected
      ? setSelectedEntries((prev) => [...prev, activity])
      : setSelectedEntries((prev) => prev.filter((a) => a.id !== activity.id));
  };

  const handleDuplicateSelection = async () => {
    if (allSelected) return;
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

  // Shared by the bulk "Supprimer" button and each row's menu, once confirmed
  const handleDeleteEntries = async (entries: EntryData[]) => {
    try {
      await Promise.all(
        entries.map(async (activity) => {
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
      setSelectedEntries((prev) =>
        prev.filter((selected) => !entries.some((e) => e.id === selected.id)),
      );
    } catch (error) {
      // console.log(error);
    }
  };

  const confirmDeletion = async () => {
    if (entriesToDelete) await handleDeleteEntries(entriesToDelete);
    setEntriesToDelete(null);
  };

  const handleUpdateEntry = (entry: EntryData) => {
    setEntryToUpdate(entry);
  };

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

  const selectedCount = selectedEntries.length;

  // The page itself does not scroll on desktop: header, toolbar and filters stay in place
  // and only the list scrolls (flex-1 + min-h-0 + overflow-y-auto on the list card)
  return (
    <div className='flex h-full'>
      <div className='w-full flex flex-col gap-3 p-3 min-h-0'>
        <HeaderTotals
          totalEmissions={totalCo2Sum}
          onAddClick={() => setShowModalCreate(true)}
        />
        {/* backdrop-blur creates a stacking context: lift the toolbar so its dropdowns render above the list */}
        <div className='glassCard shadow-2xl flex flex-wrap items-center justify-between gap-3 p-5 relative z-10'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='pl-3'>
              <InputCheckbox
                id={'selectBarBox'}
                label=''
                disabled={activityEntries?.length === 0}
                checked={allSelected}
                partiallyChecked={partiallyChecked && !allSelected}
                onChange={() =>
                  partiallyChecked
                    ? setSelectedEntries([])
                    : setSelectedEntries(activityEntries ?? [])
                }
                variant='dark'
              />
            </div>
            {/* Bulk actions are shown as soon as something is selected, instead of hidden behind a menu */}
            {selectedCount > 0 ? (
              <>
                <Typography className='text-white/70 whitespace-nowrap'>
                  {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''}
                </Typography>
                <Button
                  variant='outline'
                  disabled={allSelected}
                  onClick={handleDuplicateSelection}
                >
                  Dupliquer
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setEntriesToDelete(selectedEntries)}
                >
                  Supprimer
                </Button>
              </>
            ) : (
              <Typography className='text-white/70 max-sm:hidden'>
                Tout sélectionner
              </Typography>
            )}
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
                className='text-lg flex items-center gap-2'
                onClick={() => setShowFilterModal((s) => !s)}
              >
                <Filter size={20} aria-hidden='true' />
                <span>Filtrer</span>
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

        <div className='glassCard shadow-2xl p-2 flex-1 min-h-0 overflow-y-auto'>
          {/* Empty list: loading, brand new user, or nothing matching the filters */}
          {isListEmpty && loadingFiltered && (
            <div className='h-full flex items-center justify-center'>
              <Typography className='text-white/70'>Chargement…</Typography>
            </div>
          )}
          {isListEmpty && !loadingFiltered && !hasActiveFilters && (
            <div className='h-full flex flex-col items-center justify-center gap-4 text-center'>
              <Typography className='text-light_green font-semibold'>
                Vous n’avez encore aucune dépense
              </Typography>
              <Typography className='text-white/70'>
                Ajoutez votre première dépense pour suivre vos émissions.
              </Typography>
              <Button
                variant='outline'
                size='lg'
                className='text-lg flex items-center gap-2'
                onClick={() => setShowModalCreate(true)}
              >
                <Plus size={20} aria-hidden='true' />
                <span>Ajouter une dépense</span>
              </Button>
            </div>
          )}
          {isListEmpty && !loadingFiltered && hasActiveFilters && (
            <div className='h-full flex items-center justify-center text-center'>
              <Typography className='font-light text-light_green'>
                Aucune dépense ne correspond à vos filtres et à votre recherche
              </Typography>
            </div>
          )}
          {!isListEmpty &&
            activityEntries?.map((activity) => (
              <ActivityEntry
                onUpdate={(entry) => handleUpdateEntry(entry)}
                onDelete={(entry) => setEntriesToDelete([entry])}
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
            ))}
          {!isListEmpty && !hideLoadMoreButton && (
            <div className='mt-4 mb-2 flex justify-center'>
              <Button
                variant='outline'
                className='!rounded-full !p-2 flex items-center justify-center'
                onClick={() => handleLoadMore()}
                aria-label='Voir plus d’activités'
              >
                <ChevronDown size={20} aria-hidden='true' />
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
      {entriesToDelete && (
        <ConfirmModal
          title={
            entriesToDelete.length > 1
              ? `Supprimer ${entriesToDelete.length} dépenses ?`
              : 'Supprimer cette dépense ?'
          }
          message='Cette action est définitive.'
          confirmLabel='Supprimer'
          onConfirm={confirmDeletion}
          onCancel={() => setEntriesToDelete(null)}
        />
      )}
    </div>
  );
}
