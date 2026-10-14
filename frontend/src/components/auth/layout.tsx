import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

      {variant !== 'plain' && (
        <Link
          href='/'
          className='absolute top-6 left-6 z-20 xl:top-8 xl:left-8 transition-transform duration-200 hover:scale-110 hover:opacity-80'
          aria-label="Retour à l'accueil"
        >
          <Image
            src='/logo-ct.png'
            alt='Logo Carbon Tracker'
            width={100}
            height={115}
            className='h-12 w-auto sm:h-14'
            priority
          />
        </Link>
      )}

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
