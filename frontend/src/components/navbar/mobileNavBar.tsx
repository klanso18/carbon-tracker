import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Typography from '@/components/commons/typography/Typography';
import { LogoutQuery, LogoutQueryVariables } from '@/graphql/generated/schema';
import { LOGOUT } from '@/graphql/user/queries/auth.queries';

const Links = () => {
  const router = useRouter();
  const [logout] = useLazyQuery<LogoutQuery, LogoutQueryVariables>(LOGOUT);

  const handleLogout = async () => {
    await logout()
      .then((response) => {
        if (response.data) {
          localStorage.removeItem('user');
          router.push('/auth/login');
        }
      })
      .catch((err) => {
        console.error('Logout failed', err);
      });
  };

  return (
    <div className='w-full mt-5'>
      <Link href='/home' className='block p-2 max-w-fit'>
        <Typography variant='paragraph'>Home</Typography>
      </Link>
      <Link href='/activity-entries/list' className='block p-2 max-w-fit'>
        <Typography variant='paragraph'>Liste des dépenses</Typography>
      </Link>
      <Link href='/donation' className='block p-2 max-w-fit'>
        <Typography variant='paragraph'>Faire un don</Typography>
      </Link>
      <Link href='/profile' className='block p-2 max-w-fit'>
        <Typography variant='paragraph'>Profil</Typography>
      </Link>
      <button className='block p-2 max-w-fit' onClick={handleLogout}>
        <Typography variant='paragraph'>Déconnexion</Typography>
      </button>
    </div>
  );
};

const NavLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  return (
    <>
      <nav className='flex w-full justify-end'>
        <div className='hidden w-full md:flex justify-between'>
          <Links />
        </div>
        <div className='md:hidden'>
          <button
            className='flex items-center justify-center mr-5 z-50'
            onClick={toggleNavbar}
          >
            {isOpen ? <X className='text-white z-50' /> : <Menu />}
          </button>
        </div>
      </nav>
      {isOpen && (
        <div
          ref={navRef}
          className='absolute top-0 left-0 w-full bg-black z-30'
        >
          <div className='logo-mobile absolute top-1.5 p-5 flex items-center gap-3'>
            <img
              src='/logo-ct.png'
              alt='Logo Carbon Tracker'
              className='h-10 w-auto'
            />
            <span className='font-aclonica text-xl text-white'>
              Carbon Tracker
            </span>
          </div>
          <div className='flex flex-col items-start w-full p-5 mt-12 text-white'>
            <Links />
          </div>
        </div>
      )}
    </>
  );
};

const MobileNavBar = () => {
  return (
    <header className='flex sticky top-0 z-20 text-black mx-auto flex-wrap w-full items-center justify-between h-[50px] bg-very_light_grey shadow-xl'>
      <NavLinks />
    </header>
  );
};

export default MobileNavBar;
