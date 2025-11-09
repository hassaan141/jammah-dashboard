import { useState } from 'react'
import Modal from './Modal'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  itemName: string
  itemType?: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = 'item',
  isLoading = false
}: DeleteConfirmationModalProps) {
  const [confirmationText, setConfirmationText] = useState('')
  const isConfirmationValid = confirmationText === itemName

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm()
    }
  }

  const handleClose = () => {
    setConfirmationText('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                This action cannot be undone
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This will permanently delete the {itemType} <strong>{itemName}</strong> and all associated data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Type <strong>{itemName}</strong> to confirm:
          </label>
          <input
            type="text"
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder={itemName}
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : `Delete ${itemType}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}