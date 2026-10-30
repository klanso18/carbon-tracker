import { createContext, useContext, useState, ReactNode } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface AlertContextProps {
  showAlert: (message: string, type: 'success' | 'warn' | 'error') => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export default function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'warn' | 'error';
  } | null>(null);

  const showAlert = (message: string, type: 'success' | 'warn' | 'error') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const getTitle = (type: 'success' | 'warn' | 'error') => {
    switch (type) {
      case 'success':
        return 'Succès';
      case 'warn':
        return 'Attention';
      case 'error':
        return 'Erreur';
      default:
        return '';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className='glassPanel fixed bottom-6 right-6 z-50 p-4 w-[300px] max-w-[calc(100vw-3rem)] rounded-2xl'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              {alert.type === 'success' && (
                <CheckCircleIcon
                  className='h-5 w-5 text-green-400'
                  aria-hidden='true'
                />
              )}
              {alert.type === 'warn' && (
                <ExclamationTriangleIcon
                  className='h-5 w-5 text-yellow-400'
                  aria-hidden='true'
                />
              )}
              {alert.type === 'error' && (
                <XCircleIcon
                  className='h-5 w-5 text-red-400'
                  aria-hidden='true'
                />
              )}
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium'>{getTitle(alert.type)}</h3>
              <div className='mt-2 text-sm'>
                <p>{alert.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
