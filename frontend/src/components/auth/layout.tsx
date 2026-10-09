import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  variant?: 'card' | 'plain' | 'outline';
}

export default function AuthLayout({
  children,
  variant = 'card',
}: AuthLayoutProps) {
  return (
    <main className='fixed top-0 left-0 w-screen h-screen bg-dark_green text-black'>
      <div className='absolute inset-0 hidden xl:block'>
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

      <div className='relative z-10 flex items-center justify-center w-full h-full px-6 py-10 xl:justify-end xl:px-16 2xl:px-24'>
        {variant === 'plain' && (
          <div className='w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-10'>
            {children}
          </div>
        )}
        {variant === 'outline' && (
          <div className='w-full max-w-xl px-6 py-8 bg-transparent backdrop-blur-sm border border-white rounded-3xl sm:px-10 sm:py-10'>
            {children}
          </div>
        )}
        {variant === 'card' && (
          <div className='w-full max-w-xl px-6 py-8 shadow-2xl bg-very_light_grey/95 backdrop-blur-sm rounded-3xl sm:px-10 sm:py-10'>
            {children}
          </div>
        )}
      </div>
    </main>
  );
}
