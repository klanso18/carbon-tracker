import { useState } from 'react';
import Typography from '@/components/commons/typography/Typography';
import LastPostItem from './LastPostItem';
import AddPostModal from '@/components/modal/AddPostModal';
import { useUser } from '@/contexts/UserContext';
import useWindowSize from '@/utils/useWindowSize';

type PartialPost = {
  id: number;
  title: string;
  content: string;
  createdAt: any;
  user: {
    id: string;
    name?: string | null;
    picture?: string | null;
  };
  likers?: any;
  updatedAt?: any;
  viewOnPost?: number;
};

type Props = {
  posts: PartialPost[];
  handleRefetchPosts: () => void;
  readOnly?: boolean;
};

export default function LastPostsWidget({
  posts,
  handleRefetchPosts,
  readOnly,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const { width } = useWindowSize();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const getNumberOfPostsToShow = () => {
    if (width > 1440) return 3;
    if (width > 767) return 2;
    return 1;
  };

  const numberOfPostsToShow = getNumberOfPostsToShow();
  const lastPosts = sortedPosts.slice(0, numberOfPostsToShow);

  return (
    <div className='h-full'>
      <Typography variant='heading'>Derniers posts</Typography>
      <div className='flex flex-row h-[88%] '>
        {lastPosts.map((post) => (
          <LastPostItem
            key={post.id}
            profilImg={
              post?.user.picture != null
                ? post?.user.picture
                : '/icons/avatar.svg'
            }
            postTitle={post.title}
            postContent={post.content}
          />
        ))}
        {!readOnly ? (
          <div className='flex flex-col justify-center w-[200px] mt-2 glassCard shadow-2xl p-7 align-center transition-colors hover:bg-white/10'>
            <div className='flex justify-center m-5'>
              <button onClick={toggleModal} className='flex justify-center'>
                <img
                  src='/icons/cross.png'
                  alt='new-post'
                  className='brightness-0 invert'
                />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {isModalOpen && (
        <AddPostModal
          onClose={toggleModal}
          refetchOnValidate={handleRefetchPosts}
        />
      )}
      {isModalOpen && <div className='overlay'></div>}
    </div>
  );
}
