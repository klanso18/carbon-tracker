import React from 'react';
import clsx from 'clsx';
import useWindowSize from '@/utils/useWindowSize';

interface LastPostItemProps {
  profilImg: string;
  postTitle: string;
  postContent: string;
}

const LastPostItem: React.FC<LastPostItemProps> = ({
  profilImg,
  postTitle,
  postContent,
}) => {
  const { width, height } = useWindowSize();

  let lineClampClass = 'line-clamp-2';
  if (width >= 1440 && height >= 850) {
    lineClampClass = 'line-clamp-3';
  } else if (width >= 800 && height >= 750) {
    lineClampClass = 'line-clamp-2';
  } else if (width <= 767) {
    lineClampClass = 'line-clamp-3';
  }
  return (
    <div className='flex flex-col w-1/3 mt-2 mr-5 glassCard shadow-2xl p-7'>
      <div className='flex flex-col justify-between align-center'>
        <div className='flex flex-row items-center border-b border-white/20 pb-1'>
          <div className='flex-shrink-0 w-12 h-12 mb-1 rounded-full overflow-hidden ring-2 ring-white/40'>
            <img
              src={profilImg}
              alt='profil picture'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='ml-4 flex-1'>
            <p className='font-semibold text-light_green line-clamp-2'>
              {postTitle}
            </p>
          </div>
        </div>
        <div className='w-full overflow-hidden truncate-container mt-3'>
          <p
            className={clsx(
              'text-ellipsis overflow-hidden whitespace-normal font-light text-white/90',
              lineClampClass,
            )}
          >
            {postContent.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastPostItem;
