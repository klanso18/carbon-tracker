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

  // The modal stays outside the glass card: backdrop-filter would otherwise
  // become the containing block of the fixed overlay and trap the modal inside the card
  return (
    <>
      <div className='glassCard shadow-2xl p-7 flex flex-col h-full'>
        <div className='mb-4 flex items-center justify-between'>
          <Typography as='h2' variant='heading'>
            Derniers posts
          </Typography>
          {!readOnly ? (
            <button onClick={toggleModal}>
              <img src='/button-plus.svg' alt='add a post' />
            </button>
          ) : null}
        </div>
        <div className='flex flex-row flex-1 min-h-0'>
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
        </div>
      </div>
      {isModalOpen && (
        <AddPostModal
          onClose={toggleModal}
          refetchOnValidate={handleRefetchPosts}
        />
      )}
      {isModalOpen && <div className='overlay'></div>}
    </>
  );
}
