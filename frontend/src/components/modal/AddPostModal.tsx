import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useCreatePostMutation } from '@/graphql/generated/schema';
import InputLabel from '@/components/commons/inputs/InputLabel';
import GenericModal from '@/components/modal/GenericFormModal';

type Props = {
  onClose: () => void;
  refetchOnValidate: () => void;
};

export default function AddPostModal({ onClose, refetchOnValidate }: Props) {
  const [createPost] = useCreatePostMutation();

  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    try {
      await createPost({
        variables: { data: { ...formJSON } },
        onCompleted: async () => {
          await refetchOnValidate();
          onClose();
        },
      });
    } catch (error) {
      console.error('Une erreur est survenue:', error);
    }
  };

  return (
    <GenericModal
      title='Ajouter un post'
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className='pb-5'>
        <InputLabel
          id='title'
          name='title'
          label='Titre du post'
          placeholder='Mes conseils pour réduire mon empreinte carbone'
          type='text'
          sizes='xl'
          variant='dark'
          autoComplete='title'
          required
        />
      </div>
      <div className='pb-5'>
        <label
          htmlFor='content'
          className='block pb-2 text-sm font-medium leading-6 text-white'
        >
          Contenu du post
        </label>
        <textarea
          className='glassInput sm:text-sm'
          name='content'
          id='content'
          value={text}
          placeholder='Voici ce que je peux vous conseiller...'
          rows={10}
          onChange={handleChange}
          required
        ></textarea>
      </div>
    </GenericModal>
  );
}
