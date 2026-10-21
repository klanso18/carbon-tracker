/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-syntax */

import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Layout from '@/components/layout';
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} from '@/graphql/generated/schema';
import Button from '@/components/commons/buttons/Button';
import GenericFormModal from '@/components/modal/GenericFormModal';
import Typography from '@/components/commons/typography/Typography';
import uploadImage from '@/uploadImage';

export default function Profile() {
  const { user, setUser } = useUser();
  const [imageSrc, setImageSrc] = useState<string>(
    user?.picture != null ? user.picture : '/icons/avatar.svg',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = new FormData();
    const file = e.target.files?.[0];
    if (file) {
      form.append('file', file);
      try {
        const res = await uploadImage(file);
        let imageUrl = '';
        if (res) imageUrl = res.data.url;
        const updatedUser = await updateUser({
          variables: {
            picture: imageUrl,
          },
        });
        if (updatedUser?.data?.updateUser && user != null) {
          setUser({
            ...user,
            picture: updatedUser?.data?.updateUser.picture ?? null,
          });
        }
        setImageSrc(updatedUser?.data?.updateUser.picture ?? '');
      } catch (error) {
        console.error('Error uploading file or updating user picture:', error);
      }
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
          name: updatedUser?.data?.updateUser.name ?? null,
        });
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            name: updatedUser?.data?.updateUser.name ?? null,
          }),
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user name:', error);
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
      setOldPassword('');
      setNewPassword('');
      setError(null);
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
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
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
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
                  src={imageSrc}
                  alt='profile picture'
                  className='object-cover w-40 h-40 rounded-full mb-5 ring-2 ring-white/40'
                />
                <input
                  type='file'
                  id='file-input'
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
                    onClick={() => setIsModalOpen(true)}
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
                    onClick={() => setIsModalOpen(true)}
                    className='mt-2 w-1/3'
                  >
                    Ajouter un nom
                  </Button>
                </>
              )}
              <Button
                variant='outline'
                size='lg'
                onClick={() => setIsPasswordModalOpen(true)}
                className='mt-2 w-1/3'
              >
                Modifier mon mot de passe
              </Button>
              <Button
                variant='outline'
                size='lg'
                onClick={() => setIsDeleteModalOpen(true)}
                className='mt-2 w-1/3 !border-red-400 !text-red-300 hover:!bg-red-500/10'
              >
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GenericFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNameUpdate}
          title='Modifier le nom'
        >
          <input
            type='text'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className='glassInput'
          />
        </GenericFormModal>
      )}
      {isModalOpen && <div className='overlay'></div>}
      {isPasswordModalOpen && (
        <GenericFormModal
          onClose={() => setIsPasswordModalOpen(false)}
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
          {error && <p className='mt-2 text-red-300'>{error}</p>}
        </GenericFormModal>
      )}
      {isPasswordModalOpen && <div className='overlay'></div>}
      {isDeleteModalOpen && (
        <GenericFormModal
          onClose={() => setIsDeleteModalOpen(false)}
          onSubmit={handleDeleteAccount}
          title='Supprimer mon compte'
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
          {error && <p className='mt-2 text-red-300'>{error}</p>}
        </GenericFormModal>
      )}
      {isDeleteModalOpen && <div className='overlay'></div>}
    </Layout>
  );
}
