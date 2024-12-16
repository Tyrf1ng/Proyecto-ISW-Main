import { useState } from 'react';

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState(null);

  const openConfirmDialog = (id) => {
    setItemId(id);
    setIsOpen(true);
  };

  const closeConfirmDialog = () => {
    setItemId(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    itemId,
    openConfirmDialog,
    closeConfirmDialog,
  };
};

export default useConfirmDialog;
