import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  sizes?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  className?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

export default function InputLabel({
  label,
  sizes = 'md',
  variant = 'light',
  className,
  labelClassName,
  disabled,
  showLabel = true,
  ...props
}: InputLabelProps) {
  const baseClasses =
    'block w-full rounded-xl px-2 border-0 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6';

  // dark: for the carbon-tracker themed background (color-scheme darkens native date pickers)
  const variantClasses =
    variant === 'dark'
      ? 'text-white bg-white/5 ring-white/40 placeholder:text-white/50 font-poppins font-light [color-scheme:dark] focus:ring-2 focus:ring-light_green'
      : 'text-gray-900 ring-gray-300 placeholder:text-gray-400';

  const labelVariantClasses =
    variant === 'dark' ? 'text-white font-poppins' : 'text-gray-900';

  let sizeClasses = '';

  switch (sizes) {
    case 'sm':
      sizeClasses = 'py-1';
      break;
    case 'md':
      sizeClasses = 'py-1.5';
      break;
    case 'lg':
      sizeClasses = 'py-2';
      break;
    case 'xl':
      sizeClasses = 'py-2.5';
      break;
    default:
      sizeClasses = 'py-1.5';
  }

  return (
    <div>
      {showLabel && (
        <label
          htmlFor={props.id}
          className={clsx(
            'block text-sm font-medium leading-6 pb-2',
            labelVariantClasses,
            labelClassName,
          )}
        >
          {label}
        </label>
      )}

      <input
        className={clsx(baseClasses, variantClasses, sizeClasses, className)}
        {...props}
      />
    </div>
  );
}
