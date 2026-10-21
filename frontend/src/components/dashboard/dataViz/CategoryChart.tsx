import { defaults } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import Image from 'next/image';
import { SumByCategory } from '@/types';
import CAT_COLOR_MAP from '@/utils/categoryColors';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.legend.display = false;
defaults.plugins.title.display = false;

type Props = {
  loading: boolean;
  dataByCategory: SumByCategory[];
};
export default function CategoryChart({ dataByCategory, loading }: Props) {
  const totalCO2 = (dataByCategory ?? []).reduce(
    (sum, cat) => sum + cat.sumKgCO2,
    0,
  );
  const dataSetsByCategory = {
    labels: dataByCategory.map((cat) => cat.categoryName),
    datasets: [
      {
        data: dataByCategory.map((cat) => (cat.sumKgCO2 / totalCO2) * 100),
        backgroundColor: dataByCategory.map(
          (cat) => CAT_COLOR_MAP[cat.categoryName.toLocaleLowerCase()],
        ),
        borderRadius: 5,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label(ctx: any) {
            const percentage = ctx.raw || 0;
            return `${percentage.toFixed(1)}%`;
          },
        },
      },
    },
  };
  return (
    <>
      {loading ? (
        'Chargement...'
      ) : (
        <div className='flex w-full h-full justify-between pb-3 pt-3 max-[768px]:flex-col'>
          <div className='w-[50%] flex justify-center max-[960px]:w-full'>
            {dataByCategory.length === 0 ? (
              'Aucune données enregistrés'
            ) : (
              <Doughnut data={dataSetsByCategory} options={options} />
            )}
          </div>
          <div className='w-[50%] flex flex-wrap justify-around max-[960px]:w-full '>
            {dataByCategory.map((cat) => {
              return (
                <div
                  className='flex items-center gap-2 w-[48%] mr-2 max-[960px]:p-2 w-[40%] justify-center'
                  key={cat.categoryName}
                >
                  <div className=' flex items-center w-[40px] min-w-[40px] h-[40px] min-h-[40px] max-[1220px]:w-[30px] min-w-[30px] h-[30px] min-h-[30px] '>
                    <Image
                      className='w-full'
                      width={50}
                      height={50}
                      src={`/${cat.categoryName.toLocaleLowerCase()}.svg`}
                      alt={cat.categoryName}
                    />
                  </div>
                  <div className='text-white poppins-semiBold text-lg text-nowrap max-[1220px]:text-sm'>
                    {cat.sumKgCO2} <span>kgCO2</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
