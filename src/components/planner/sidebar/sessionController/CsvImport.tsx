import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

const CsvImport = ({handleClick}) => {
  return (
    <div>
      <button
        onClick={handleClick}
        className="group flex w-full items-center gap-2 dark:text-white rounded-md p-1 text-gray text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowDownOnSquareIcon className="h-5 w-5 text-secondary hover:brightness-200" />
        <span className="pl-1">Importar Opções (CSV)</span>
      </button>
    </div>
  );
};

CsvImport.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default React.memo(CsvImport);