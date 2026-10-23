import React from 'react';
import clsx from 'clsx';

interface GenericButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'outline';
}

export default function Button({
  size = 'md',
  variant = 'primary',
  className,
  children,
  ...props
}: GenericButtonProps) {
  const baseClasses =
    'text-sm cursor-pointer text-white shadow-sm transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent';

  const variantClasses =
    variant === 'outline'
      ? 'bg-transparent border border-white rounded-[10px] font-poppins font-light hover:bg-white/10'
      : 'rounded-xl bg-medium_green font-semibold hover:bg-light_green';

  let sizeClasses = '';

  switch (size) {
    case 'xs':
      sizeClasses = 'px-2.5 py-1';
      break;
    case 'sm':
      sizeClasses = 'px-2.5 py-1';
      break;
    case 'md':
      sizeClasses = 'px-3 py-1.5';
      break;
    case 'lg':
      sizeClasses = 'px-3.5 py-2';
      break;
    case 'xl':
      sizeClasses = 'px-4 py-2.5';
      break;
    default:
      sizeClasses = 'px-2.5 py-1';
  }

  return (
    <button
      type='button'
      className={clsx(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
}
