import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'; // Warning icon
import { useWarning } from '../../contexts/WarningContext'; // Use WarningContext

const RefreshWarning = () => {
  const { isWarningVisible, setIsWarningVisible } = useWarning(); // Updated context values
  const [showNotification, setShowNotification] = React.useState(false);
  const handleIconClick = () => {
    showNotification ? setShowNotification(false) : setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (!isWarningVisible) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="cursor-pointer text-red-600 hover:text-red-800 transition mr-5"
        onClick={handleIconClick}
      >
        <ExclamationTriangleIcon className="h-8 w-8" />
      </div>
      {showNotification && (
        <div className="fixed top-16 right-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-xs">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600"  />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-800">
                A informação das UCS está desatualizada. Clique no botão de refresh para atualizar.
              </p>
            </div>
            <button
              type="button"
              className="ml-3 text-gray-400 hover:text-gray-600 transition"
              onClick={handleCloseNotification}
            >
              &times;
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default RefreshWarning;
