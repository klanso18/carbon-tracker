import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import Typography from '@/components/commons/typography/Typography';
import AddActivityModal from '../modal/AddActivityModal';
import { useUser } from '@/contexts/UserContext';
import { LogoutQuery, LogoutQueryVariables } from '@/graphql/generated/schema';
import { LOGOUT } from '@/graphql/user/queries/auth.queries';

export default function navbar() {
  const { user } = useUser();
  const router = useRouter();
  const [hoveredLink, setHoveredLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logout] = useLazyQuery<LogoutQuery, LogoutQueryVariables>(LOGOUT);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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

  const navLink = [
    {
      name: 'home',
      link: '/home',
      img: '/icons/home-icon.png',
      imgHover: '/icons/home-icon-hover.png',
    },
    {
      name: 'activities',
      link: '/activity-entries/list',
      img: '/icons/co2-icon.png',
      imgHover: '/icons/co2-icon-hover.png',
    },
    {
      name: 'posts',
      link: '/posts/list',
      img: '/icons/write-icon.png',
      imgHover: '/icons/write-icon-hover.png',
    },
    {
      name: 'donations',
      link: '/donation',
      img: '/icons/donation-icon.png',
      imgHover: '/icons/donation-icon-hover.png',
    },
  ];

  return (
    <>
      <div className='flex items-center justify-center h-screen ml-5 mr-5'>
        <div className='flex flex-col h-[98vh] min-h-fit bg-black text-white w-28 rounded-3xl items-center'>
          <div className='cirlce flex items-center justify-center mt-5 bg-white w-full'>
            <div className='w-[60%] p-2'>
              <Link href='/home'>
                <img src='/icons/logo.png' alt='Logo' className='w-full' />
              </Link>
            </div>
          </div>
          <div className='nav-links flex flex-col flex-grow items-center justify-around pl-6 mt-4 mb-6 min-h-fit'>
            {navLink.map(({ link, name, img, imgHover }) => (
              <Link
                key={name}
                href={link}
                className={`${router.pathname === link ? 'bg-white rounded-s-full' : ''} nav-link flex justify-around w-full pt-2 pb-2 hover:bg-white hover:rounded-s-full`}
                onMouseEnter={() => setHoveredLink(name)}
                onMouseLeave={() => setHoveredLink('')}
              >
                <img
                  src={`${router.pathname === link || hoveredLink === name ? imgHover : img}`}
                  alt={name}
                  className='w-10 mr-5'
                />
              </Link>
            ))}
            <button
              key='logout'
              onClick={handleLogout}
              className={`${router.pathname === '/auth/login' ? 'bg-white rounded-s-full' : ''} nav-link flex justify-around w-full pt-2 pb-2 hover:bg-white hover:rounded-s-full`}
              onMouseEnter={() => setHoveredLink('logout')}
              onMouseLeave={() => setHoveredLink('')}
            >
              <img
                src={`${router.pathname === '/auth/login' || hoveredLink === 'logout' ? '/icons/logout-icon-hover.png' : '/icons/logout-icon.png'}`}
                alt={'logout'}
                className='w-10 mr-5'
              />
            </button>

            <Link
              key={'profile'}
              href={'/profile'}
              className='nav-link flex justify-around mb-2'
            >
              <label
                tabIndex={0}
                className='btn btn-ghost btn-circle avatar w-full pr-5'
              >
                <div className='w-12 rounded-full'>
                  <img
                    src={user?.picture ?? '/icons/avatar.svg'}
                    alt='profil picture'
                  />
                </div>
                <Typography variant='paragraph'>{user?.name ?? ''}</Typography>
              </label>
            </Link>
          </div>
        </div>
      </div>
      {isModalOpen && <AddActivityModal onClose={toggleModal} />}
      {isModalOpen && <div className='overlay'></div>}
    </>
  );
}
