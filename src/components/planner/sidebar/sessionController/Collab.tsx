import React, { useState } from 'react';
import { Button } from '../../../ui/button';
import { UsersIcon } from '@heroicons/react/24/solid';
import CollabModal from './CollabModal';

const Collab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button variant="icon" className="bg-primary" onClick={openModal}>
        <UsersIcon className="h-5 w-5" />
      </Button>

      <CollabModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default Collab;
