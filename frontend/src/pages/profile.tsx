import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAlert } from '@/contexts/AlertContext';
import Layout from '@/components/layout';
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} from '@/graphql/generated/schema';
import Button from '@/components/commons/buttons/Button';
import GenericFormModal from '@/components/modal/GenericFormModal';
import Typography from '@/components/commons/typography/Typography';
import uploadImage, {
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_SIZE,
  getUploadErrorMessage,
} from '@/uploadImage';

type ModalName = 'name' | 'password' | 'delete';

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Une erreur est survenue.';

export default function Profile() {
  const { user, setUser } = useUser();
  const { showAlert } = useAlert();
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
      <div className='w-full flex flex-col p-10 pb-0 max-[1710px]:p-2'>
        <div className='h-[15vh] max-h-[128px] flex justify-between items-center mb-2 px-7'>
          <Typography customClass='pageTitle'>Mon profil</Typography>
        </div>
        <div className='flex flex-row'>
          <div className='glassCard shadow-2xl p-7 w-full'>
            <div className='flex justify-center'>
              <div className='relative inline-block'>
                <img
                  src={user?.picture || '/icons/avatar.svg'}
                  alt='profile picture'
                  className='object-cover w-40 h-40 rounded-full mb-5 ring-2 ring-white/40'
                />
                <input
                  type='file'
                  id='file-input'
                  accept={ACCEPTED_IMAGE_TYPES}
                  className='hidden'
                  onChange={handleFileChange}
                />
                <label
                  htmlFor='file-input'
                  className='absolute bottom-0 right-0 bg-medium_green rounded-full p-2 cursor-pointer shadow-md transition-colors duration-300 hover:bg-light_green'
                >
                  <img
                    src='/icons/modify.png'
                    alt='Edit icon'
                    className='w-6 h-6'
                  />
                </label>
              </div>
            </div>

            <div className='text-center flex flex-col items-center'>
              {user?.name ? (
                <>
                  <p className='mt-3 font-poppins text-xl font-semibold pb-2 text-white'>
                    {user.name}
                  </p>
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={() => openModal('name')}
                    className='mt-2 w-1/3'
                  >
                    Modifier le nom
                  </Button>
                </>
              ) : (
                <>
                  <p className='font-poppins font-light'>
                    Veuillez saisir votre Nom
                  </p>
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={() => openModal('name')}
                    className='mt-2 w-1/3'
                  >
                    Ajouter un nom
                  </Button>
                </>
              )}
              <Button
                variant='outline'
                size='lg'
                onClick={() => openModal('password')}
                className='mt-2 w-1/3'
              >
                Modifier mon mot de passe
              </Button>
              <Button
                variant='outline'
                size='lg'
                onClick={() => openModal('delete')}
                className='mt-2 w-1/3 !border-red-400 !text-red-300 hover:!bg-red-500/10'
              >
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'name' && (
        <GenericFormModal
          onClose={closeModal}
          onSubmit={handleNameUpdate}
          title='Modifier le nom'
        >
          <input
            type='text'
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
          {modalError && <p className='mt-2 text-red-300'>{modalError}</p>}
        </GenericFormModal>
      )}
      {activeModal === 'delete' && (
        <GenericFormModal
          onClose={closeModal}
          onSubmit={handleDeleteAccount}
          title='Supprimer mon compte'
          submitLabel='Supprimer mon compte'
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
