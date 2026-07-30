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
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Schedule Publish Time
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
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
            className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-primary-dark hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
