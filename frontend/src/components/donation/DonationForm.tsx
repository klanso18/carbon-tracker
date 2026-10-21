/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ChangeEvent, useState } from 'react';
import Button from '../commons/buttons/Button';
import InputCheckbox from '../commons/inputs/InputCheckbox';
import InputLabel from '../commons/inputs/InputLabel';
import Typography from '../commons/typography/Typography';

export default function DonationForm({
  handleSubmitNewDonation,
}: {
  handleSubmitNewDonation: (amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState<number | null>(null);

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    Number(event.target.value) >= 0 && setAmount(Number(event.target.value));
  };

  const handleButtonClick = async () => {
    amount !== null && (await handleSubmitNewDonation(amount));
    setAmount(null);
  };

  return (
    <div>
      <div className='h-[15vh] max-h-[128px] flex justify-between items-center mb-2 px-7'>
        <Typography customClass='pageTitle'>Faire un don</Typography>
      </div>

      <section className='glassCard shadow-2xl p-7 font-light'>
        <Typography className='pt-4 w-2/3'>
          Bienvenue sur la page de dons de Carbon-tracker! Notre application
          innovante vous aide à suivre et réduire votre empreinte carbone au
          quotidien.
        </Typography>
        <Typography className='pt-4 w-2/3'>
          En contribuant financièrement, vous soutenez un projet essentiel qui
          vise à sensibiliser et à agir contre le changement climatique. Chaque
          don, petit ou grand, permet de développer de nouvelles fonctionnalités
          et d&apos;atteindre plus d&apos;utilisateurs.
        </Typography>
        <Typography className='pt-4 w-2/3'>
          Ensemble, faisons un pas de plus vers un avenir durable!
        </Typography>
        <div className='flex pt-4 items-center'>
          <InputLabel
            name='Montant'
            label='Montant'
            type='number'
            sizes='xl'
            placeholder='€'
            min={0}
            step={0.01}
            value={amount ?? ''}
            onChange={handleAmountChange}
            required
            variant='dark'
          />
        </div>
        <InputCheckbox
          id='anonymous-donation'
          label='Rendre mon don anonyme'
          className='pt-4'
          variant='dark'
        />
        <Button
          variant='outline'
          size='xl'
          className='mt-4'
          onClick={handleButtonClick}
        >
          Soumettre mon don
        </Button>
      </section>
    </div>
  );
}
