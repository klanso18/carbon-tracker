import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import {
  LoginQuery,
  LoginQueryVariables,
  InputLogin,
} from '@/graphql/generated/schema';
import { useUser } from '../../contexts/UserContext';
import { LOGIN } from '@/graphql/user/queries/auth.queries';
import InputLabel from '@/components/commons/inputs/InputLabel';
import Button from '@/components/commons/buttons/Button';
import Typography from '@/components/commons/typography/Typography';
import InputCheckbox from '@/components/commons/inputs/InputCheckbox';
import AuthLayout from '@/components/auth/layout';

export default function Login() {
  const router = useRouter();
  const { setUser } = useUser();

  const [errorMessage, setErrorMessage] = useState('');

  const [login] = useLazyQuery<LoginQuery, LoginQueryVariables>(LOGIN);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const form = new FormData(e.currentTarget);
    const formData = Object.fromEntries(form) as InputLogin;
    if (formData.email && formData.password) {
      login({
        variables: {
          infos: { email: formData.email, password: formData.password },
        },
        fetchPolicy: 'network-only',
        onCompleted(result) {
          if (result.login.success) {
            // eslint-disable-next-line no-restricted-syntax
            console.log(result.login.user);
            if (result.login.user) {
              setUser(result.login.user);
            }

            router.push('/');
          } else {
            setErrorMessage(result.login.message);
          }
        },
      });
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-col items-center lg:items-start py-6'>
        <Typography customClass='text-4xl lg:text-3xl xl:text-5xl font-semibold'>
          Connexion 👋
        </Typography>
        <Typography customClass='hidden lg:block lg:text-start text-sm lg:text-md xl:text-lg font-light text-medium_green mt-2 w-5/6'>
          Suis ton empreinte carbone, commence dès maintenant à renseigner tes
          dernières activitées!
        </Typography>
        <form onSubmit={handleSubmit} className='py-4'>
          <div className='w-full sm:w-[450px]'>
            <InputLabel
              name='email'
              label='email'
              placeholder='carbone@gmail.com'
              type='email'
              sizes='xl'
              autoComplete='email'
              required
            />
          </div>
          <div className='mt-4 w-full sm:w-[450px]'>
            <InputLabel
              name='password'
              label='mot de passe'
              placeholder='*******'
              type='password'
              sizes='xl'
              autoComplete='current-password'
              required
            />
          </div>
          <InputCheckbox
            id='remember-login'
            label='se souvenir de moi'
            className='py-4'
          />
          <div className='w-full flex justify-center items-center lg:justify-start'>
            <Button
              className='mt-2'
              size='xl'
              type='submit'
              data-testid='submit'
            >
              Envoyer
            </Button>
          </div>

          <Typography variant='paragraph' className='text-red-500 mt-2'>
            {errorMessage}
          </Typography>
        </form>
        <div
          className='flex items-center mt-2'
          onClick={() => router.push('/auth/signup')}
        >
          <Typography variant='paragraph' className='cursor-default'>
            Pas encore inscrit ?
          </Typography>
          <Typography
            variant='paragraph'
            className='font-semibold pl-2 cursor-pointer text-medium_green'
          >
            Crée ton compte
          </Typography>
        </div>
      </div>
    </AuthLayout>
  );
}
