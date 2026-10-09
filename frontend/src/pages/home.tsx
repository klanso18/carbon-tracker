import { useRouter } from 'next/router';
import Image from 'next/image';
import AuthLayout from '@/components/auth/layout';
import Typography from '@/components/commons/typography/Typography';
import Button from '@/components/commons/buttons/Button';

export default function HomePage() {
  const router = useRouter();

  return (
    <AuthLayout variant='plain'>
      <div className='flex flex-col items-center w-full py-6'>
        <Image
          src='/logo-ct.png'
          alt='Logo Carbon Tracker'
          width={100}
          height={115}
          className='h-24 w-auto sm:h-32'
          priority
        />
        <div className='flex flex-col items-center w-full mt-4'>
          <Typography customClass='!font-aclonica text-3xl sm:text-4xl xl:text-6xl text-white text-center w-full'>
            Carbon Tracker
          </Typography>
          <Typography customClass='font-poppins text-center text-sm sm:text-base xl:text-lg font-light text-white mt-4 w-full'>
            Suis ton empreinte carbone au quotidien, adopte de meilleures
            habitudes et avance vers un mode de vie plus durable.
          </Typography>
          <div className='w-full flex flex-col sm:flex-row gap-3 justify-center items-center mt-8'>
            <Button
              size='xl'
              className='w-full sm:w-auto bg-transparent border border-white text-white rounded-[10px] hover:bg-white/10 font-poppins !font-light'
              onClick={() => router.push('/auth/login')}
            >
              Se connecter
            </Button>
            <Button
              size='xl'
              className='w-full sm:w-auto bg-transparent border border-white text-white rounded-[10px] hover:bg-white/10 font-poppins !font-light'
              onClick={() => router.push('/auth/signup')}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
