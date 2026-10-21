import Typography from '@/components/commons/typography/Typography';
import Layout from '@/components/layout';
import PostGlobalContainer from '@/components/posts/PostGlobalContainer';

function App() {
  return (
    <div>
      <Layout title='Bons plans' themed>
        <div className='w-full flex flex-col p-10 pb-0 max-[1710px]:p-2'>
          <div className='h-[15vh] max-h-[128px] flex justify-between items-center mb-2 px-7'>
            <Typography customClass='pageTitle'>Mes bons plans</Typography>
          </div>
          <PostGlobalContainer />
        </div>
      </Layout>
    </div>
  );
}

export default App;
