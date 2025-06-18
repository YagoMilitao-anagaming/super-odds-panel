'use client';
import React from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirmação',
  description = 'Tem certeza que deseja realizar esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
      <div className="bg-[#1C1F29] rounded-lg p-6 w-[320px] text-white">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm mb-4 text-[#B0B6C9]">{description}</p>

        <div className="flex justify-end gap-2">
          <button
          type='button'
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded bg-[#282B38] text-[#B0B6C9] hover:bg-[#333743]"
          >
            {cancelText}
          </button>
          <button
          type='button'
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
