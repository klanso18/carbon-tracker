import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className='fixed top-0 left-0 w-screen h-screen bg-dark_green text-black'>
      <div className='absolute inset-0 hidden lg:block'>
        <Image
          src='/carbon-tracker-bg.jpg'
          alt='Jeune pousse verte émergeant de la terre, symbole de la croissance des bonnes habitudes écologiques'
          fill
          sizes='100vw'
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-dark_green/60 to-dark_green' />
      </div>

      <div className='relative z-10 flex items-center justify-center w-full h-full px-6 py-10 lg:justify-end lg:px-16 xl:px-24 2xl:px-32'>
        <div className='w-full max-w-xl px-6 py-8 shadow-2xl bg-very_light_grey/95 backdrop-blur-sm rounded-3xl sm:px-10 sm:py-10'>
          {children}
        </div>
      </div>
    </main>
  );
}
