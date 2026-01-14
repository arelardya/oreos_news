'use client';

import { useState, useEffect } from 'react';

interface DateTimePickerModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: (dateTime: string) => void;
  initialDateTime?: string;
}

export default function DateTimePickerModal({
  isOpen,
  onCloseAction,
  onConfirmAction,
  initialDateTime,
}: DateTimePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (initialDateTime) {
      const date = new Date(initialDateTime);
      setSelectedDate(date.toISOString().split('T')[0]);
      setSelectedTime(date.toTimeString().slice(0, 5));
    } else {
      // Set default to current date and time
      const now = new Date();
      setSelectedDate(now.toISOString().split('T')[0]);
      setSelectedTime(now.toTimeString().slice(0, 5));
    }
  }, [initialDateTime, isOpen]);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const dateTime = new Date(dateTimeString);
      
      // Validate that the selected time is in the future
      if (dateTime <= new Date()) {
        alert('Please select a future date and time');
        return;
      }
      
      onConfirmAction(dateTime.toISOString());
      onCloseAction();
    }
  };

  const handleCancel = () => {
    onCloseAction();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-primary dark:text-pink-300 mb-6">
          Schedule Publish Time
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {selectedDate && selectedTime ? (
                <>
                  Article will be published on{' '}
                  <strong>
                    {new Date(`${selectedDate}T${selectedTime}`).toLocaleString()}
                  </strong>
                </>
              ) : (
                'Select a date and time'
              )}
            </p>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 bg-primary dark:bg-primary-dark text-white py-3 px-6 rounded-full font-medium hover:bg-primary-dark dark:hover:bg-accent hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-full font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
