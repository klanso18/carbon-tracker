type Props = {
  content: string;
  onRemoveClick: () => void;
};

export default function ActiveFilterBagde({ content, onRemoveClick }: Props) {
  return (
    <div className='h-[25px] flex justify-between items-center rounded-xl bg-light_green text-dark_green px-3 mr-3 mb-2'>
      <div className='-translate-y-[2px] pl-1'>{content}</div>

      <button className='flex items-center ml-2' onClick={onRemoveClick}>
        <img src='/cross-icon.svg' />
      </button>
    </div>
  );
}
