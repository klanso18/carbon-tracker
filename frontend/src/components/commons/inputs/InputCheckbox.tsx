import clsx from 'clsx';
import { InputHTMLAttributes, useEffect, useRef } from 'react';

interface InputCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  partiallyChecked?: boolean;
}

export default function InputCheckbox({
  id,
  label,
  className,
  inputClassName,
  labelClassName,
  partiallyChecked = false,
  ...props
}: InputCheckboxProps) {
  const defaultClasses = 'relative flex items-start';
  const inputClasses = 'flex h-6 items-center';
  const labelClasses = 'ml-3 text-sm leading-6';

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = partiallyChecked;
    }
  }, [partiallyChecked]);

  return (
    <div className={clsx(defaultClasses, className)}>
      <div className={inputClasses}>
        <input
          ref={inputRef}
          id={id}
          aria-describedby={`${id}-description`}
          name={id}
          type='checkbox'
          className={clsx(
            'h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-600',
            inputClassName,
          )}
          {...props}
        />
      </div>
      <div className={labelClasses}>
        <label
          htmlFor={id}
          className={clsx('font-normal text-gray-900', labelClassName)}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
