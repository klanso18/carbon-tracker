import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRegisterMutation } from '@/graphql/generated/schema';
import AuthLayout from '@/components/auth/layout';
import Typography from '@/components/commons/typography/Typography';
import InputLabel from '@/components/commons/inputs/InputLabel';
import InputCheckbox from '@/components/commons/inputs/InputCheckbox';
import Button from '@/components/commons/buttons/Button';
import { useAlert } from '@/contexts/AlertContext';

export default function Signup() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [register, { loading, error }] = useRegisterMutation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!acceptedTerms) {
      setErrorMessage("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("L'adresse e-mail n'est pas valide.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Le mot de passe doit contenir au moins huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const result = await register({
        variables: {
          infos: {
            email,
            password,
          },
        },
      });

      if (result?.data?.register) {
        showAlert('Compte crée avec succès!', 'success');
        router.push('/auth/login');
      } else {
        setErrorMessage('error happening');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthLayout variant='outline'>
      <div className='flex flex-col items-center lg:items-start py-6'>
        <Typography customClass='!font-aclonica text-4xl lg:text-3xl xl:text-5xl text-white text-center lg:text-left w-full'>
          Inscription ✍️
        </Typography>
        <Typography customClass='hidden lg:block font-poppins lg:text-start text-sm lg:text-md xl:text-lg font-light text-white mt-2 w-5/6'>
          Suis ton empreinte carbone, commence dès maintenant à renseigner tes
          dernières activités !
        </Typography>
        <form onSubmit={handleSubmit} className='py-4'>
          <div className='w-full sm:w-[300px]'>
            <InputLabel
              name='email'
              label='email'
              placeholder='carbon@gmail.com'
              type='email'
              sizes='xl'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
              labelClassName='!text-white'
              className='!text-white !ring-white/40 bg-white/5 placeholder:!text-white/50'
            />
          </div>
          <div className='mt-3 w-full sm:w-[300px]'>
            <InputLabel
              name='password'
              label='mot de passe'
              placeholder='*******'
              type='password'
              sizes='xl'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
              required
              labelClassName='!text-white'
              className='!text-white !ring-white/40 bg-white/5 placeholder:!text-white/50'
            />
          </div>
          <div className='mt-3 w-full sm:w-[300px]'>
            <InputLabel
              name='confirmPassword'
              label='confirmer le mot de passe'
              placeholder='*******'
              type='password'
              sizes='lg'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete='new-password'
              required
              labelClassName='!text-white'
              className='!text-white !ring-white/40 bg-white/5 placeholder:!text-white/50'
            />
          </div>
          <InputCheckbox
            id='remember-login'
            label="j'accepte les conditions d'utilisation"
            className='py-4'
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            required
            labelClassName='!text-white'
            inputClassName='!border-white/50 !text-medium_green focus:!ring-medium_green'
          />
          <div className='w-full flex justify-center items-center lg:justify-start'>
            <Button
              className='mt-2 bg-transparent border border-white text-white rounded-[10px] hover:bg-white/10 font-poppins !font-light'
              size='xl'
              type='submit'
            >
              {loading ? 'En cours...' : 'Envoyer'}
            </Button>
          </div>
          <Typography variant='paragraph' className='text-red-500 mt-2'>
            {errorMessage || error?.message}
          </Typography>
        </form>
        <div
          className='flex items-center'
          onClick={() => router.push('/auth/login')}
        >
          <Typography
            variant='paragraph'
            className='font-poppins font-light text-white cursor-default'
          >
            Déjà inscrit ?
          </Typography>
          <Typography
            variant='paragraph'
            className='font-poppins font-semibold pl-2 cursor-pointer text-light_green'
          >
            Connecte toi
          </Typography>
        </div>
      </div>
    </AuthLayout>
  );
}
