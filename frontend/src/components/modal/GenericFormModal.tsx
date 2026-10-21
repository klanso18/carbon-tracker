import React, { FormEvent, ReactNode } from 'react';
import Typography from '@/components/commons/typography/Typography';
import Button from '@/components/commons/buttons/Button';

interface GenericModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  onClose,
  onSubmit,
  children,
}) => {
  return (
    <div className='modal-box glassPanel w-11/12 max-w-5xl absolute z-50 top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-3xl p-8'>
      <Typography customClass='text-xl font-semibold pb-2 text-white'>
        {title}
      </Typography>
      <form method='dialog' onSubmit={onSubmit} className='m-4'>
        <button
          type='button'
          className='btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white hover:bg-white/10 text-lg font-light'
          onClick={onClose}
        >
          ✕
        </button>
        {children}
        <div className='text-right'>
          <Button
            variant='outline'
            className='mt-2'
            size='xl'
            type='submit'
            data-testid='submit'
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GenericModal;
