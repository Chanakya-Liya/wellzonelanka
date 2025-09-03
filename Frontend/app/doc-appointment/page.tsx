'use client';

import { useState } from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

interface AppointmentProps {
  doctor: {
    id: number;
    name: string;
    specialization: string;
    experience: string;
    rating: number;
    image: string;
  };
  onClose: () => void;
}

export default function Appointment({ doctor, onClose }: AppointmentProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    alert(`Appointment confirmed with ${doctor.name} for ${selectedDate} at ${selectedTime}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-gray-600">{doctor.specialization}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-sm text-gray-500">{doctor.experience} experience</span>
                <span className="text-sm text-gray-500">
                  <span className="text-yellow-400">★</span> {doctor.rating} rating
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Appointment Date</h2>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Select Time Slot</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors
                      ${selectedTime === time 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    <Clock className="h-4 w-4" />
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-8">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900">Appointment Summary</h3>
                <p className="text-blue-700 mt-1">
                  {selectedDate && selectedTime 
                    ? `${doctor.name} on ${selectedDate} at ${selectedTime}`
                    : 'Please select date and time for your appointment'}
                </p>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 
                  transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}