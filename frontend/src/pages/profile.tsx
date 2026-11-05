import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAlert } from '@/contexts/AlertContext';
import Layout from '@/components/layout';
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
} from '@/graphql/generated/schema';
import GenericFormModal from '@/components/modal/GenericFormModal';
import Typography from '@/components/commons/typography/Typography';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AccountSettings from '@/components/profile/AccountSettings';
import MyDonations from '@/components/profile/MyDonations';
import AccountData from '@/components/profile/AccountData';
import uploadImage, {
  MAX_UPLOAD_SIZE,
  getUploadErrorMessage,
} from '@/uploadImage';

type ModalName = 'name' | 'password' | 'delete';

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Une erreur est survenue.';

export default function Profile() {
  const { user, setUser } = useUser();
  const { showAlert } = useAlert();
  // Statistics change on other pages: the cache alone would show stale figures
  const { data: profile } = useGetProfileQuery({
    fetchPolicy: 'cache-and-network',
  });
  // One modal at a time, so that its error and fields can never leak into another
  const [activeModal, setActiveModal] = useState<ModalName | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deleteUser] = useDeleteUserMutation();

  const openModal = (modal: ModalName) => {
    setNewName(user?.name ?? '');
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalError(null);
    setOldPassword('');
    setNewPassword('');
    setDeletePassword('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Otherwise, picking the same file again after a failure would do nothing
    e.target.value = '';
    if (!file) return;

    // Bun rejects oversized bodies without CORS headers: the browser would only
    // see a network error, so the limit is checked here too.
    if (file.size > MAX_UPLOAD_SIZE) {
      showAlert('Image trop lourde (5 Mo maximum).', 'error');
      return;
    }

    try {
      const { data } = await uploadImage(file);
      const updatedUser = await updateUser({
        variables: {
          picture: data.url,
        },
      });
      if (updatedUser?.data?.updateUser && user != null) {
        setUser({
          ...user,
          picture: updatedUser.data.updateUser.picture ?? null,
        });
      }
      showAlert('Photo de profil mise à jour.', 'success');
    } catch (err) {
      showAlert(getUploadErrorMessage(err), 'error');
    }
  };

  const handleNameUpdate = async () => {
    try {
      const updatedUser = await updateUser({
        variables: {
          name: newName,
        },
      });
      if (updatedUser?.data?.updateUser && user != null) {
        setUser({
          ...user,
          name: updatedUser.data.updateUser.name ?? null,
        });
      }
      closeModal();
      showAlert('Nom mis à jour.', 'success');
    } catch (err) {
      setModalError(getErrorMessage(err));
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword({
        variables: {
          oldPassword,
          newPassword,
        },
      });
      closeModal();
      showAlert('Mot de passe mis à jour.', 'success');
    } catch (err) {
      setModalError(getErrorMessage(err));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser({
        variables: {
          password: deletePassword,
        },
      });
      setUser(null);
      window.location.href = '/auth/login';
    } catch (err) {
      setModalError(getErrorMessage(err));
    }
  };

  return (
    <Layout title='Profile' themed>
      <div className='w-full flex flex-col gap-6 p-10 max-[1710px]:p-3'>
        <Typography as='h1' customClass='pageTitle' className='px-7 pt-4'>
          Mon profil
        </Typography>
        <ProfileHeader
          name={user?.name}
          email={user?.email}
          picture={user?.picture}
          memberSince={profile?.me.createdAt}
          stats={profile?.getProfileStats}
          onPictureChange={handleFileChange}
        />
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <AccountSettings
            name={user?.name}
            email={user?.email}
            onEditName={() => openModal('name')}
            onEditPassword={() => openModal('password')}
          />
          <MyDonations donations={profile?.getMyDonations} />
        </div>
        <AccountData onDeleteAccount={() => openModal('delete')} />
      </div>

      {activeModal === 'name' && (
        <GenericFormModal
          onClose={closeModal}
          onSubmit={handleNameUpdate}
          title='Modifier le nom'
          size='md'
        >
          <label
            htmlFor='name'
            className='block pb-2 text-sm font-medium text-white'
          >
            Nom
          </label>
          <input
            type='text'
            id='name'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className='glassInput'
          />
          {modalError && <p className='mt-2 text-red-300'>{modalError}</p>}
        </GenericFormModal>
      )}
      {activeModal === 'password' && (
        <GenericFormModal
          onClose={closeModal}
          onSubmit={handleChangePassword}
          title='Changer mon mot de passe'
          size='md'
        >
          <label
            htmlFor='oldPassword'
            className='block pb-2 text-sm font-medium text-white'
          >
            Ancien mot de passe
          </label>
          <input
            type='password'
            id='oldPassword'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className='glassInput'
          />
          <label
            htmlFor='newPassword'
            className='block pb-2 text-sm font-medium text-white mt-4'
          >
            Nouveau mot de passe
          </label>
          <input
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='glassInput'
          />
          <p className='mt-2 text-sm text-white/70'>
            8 caractères minimum, avec une majuscule, une minuscule, un chiffre
            et un caractère spécial.
          </p>
          {modalError && <p className='mt-2 text-red-300'>{modalError}</p>}
        </GenericFormModal>
      )}
      {activeModal === 'delete' && (
        <GenericFormModal
          onClose={closeModal}
          onSubmit={handleDeleteAccount}
          title='Supprimer mon compte'
          submitLabel='Supprimer mon compte'
          size='md'
        >
          <label
            htmlFor='deletePassword'
            className='block pb-2 text-sm font-medium text-white'
          >
            Mot de passe
          </label>
          <input
            type='password'
            id='deletePassword'
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className='glassInput'
          />
          {modalError && <p className='mt-2 text-red-300'>{modalError}</p>}
        </GenericFormModal>
      )}
      {activeModal && <div className='overlay'></div>}
    </Layout>
  );
}
