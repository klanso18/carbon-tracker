import { useEffect } from 'react';
import Typography from '@/components/commons/typography/Typography';
import Button from '@/components/commons/buttons/Button';

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Themed replacement for window.confirm, which cannot be styled.
// Render it outside any glassCard: backdrop-filter would trap the fixed overlay in the card.
export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <>
      <div
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='confirm-modal-title'
        aria-describedby='confirm-modal-message'
        className='glassPanel w-11/12 max-w-md fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl p-8'
      >
        <Typography as='h2' variant='heading' className='mb-2'>
          <span id='confirm-modal-title'>{title}</span>
        </Typography>
        <Typography className='text-white/70'>
          <span id='confirm-modal-message'>{message}</span>
        </Typography>
        <div className='mt-6 flex justify-end gap-3'>
          {/* Focus goes to the harmless action, so Enter does not delete by mistake */}
          <Button variant='outline' size='lg' onClick={onCancel} autoFocus>
            Annuler
          </Button>
          <Button
            variant='outline'
            size='lg'
            // ! needed: Button's own border-white / text-white would otherwise win the cascade
            className='!border-medium_orange !text-medium_orange hover:!bg-medium_orange/10'
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
      <div className='overlay' onClick={onCancel}></div>
    </>
  );
}
