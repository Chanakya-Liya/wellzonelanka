"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, X, Stethoscope, History } from "lucide-react";
import {
  getDoctorAppointments,
  cancelDoctorAppointment,
} from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface DoctorAppointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  symptoms?: string;
}

export default function MyDoctorAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real app, this would fetch from the API
        const data = await getDoctorAppointments();
        setAppointments(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  const handleCancelAppointment = async (id: string) => {
    try {
      await cancelDoctorAppointment(id);
      setAppointments(
        appointments.map((app) =>
          app.id === id ? { ...app, status: "cancelled" } : app
        )
      );
      toast({
        title: "Appointment Cancelled",
        description: "Your doctor appointment has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="border border-yellow-600 text-yellow-600 px-3 py-1 rounded-full text-sm">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="border border-gray-500 text-gray-500 px-3 py-1 rounded-full text-sm">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter active appointments (not cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== "cancelled"
  );

  // Filter cancelled appointments for history
  const historyAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  );

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10 text-black">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/doctor-dash" className="mr-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Back
            </button>
          </Link>
          <h1 className="text-3xl font-bold">My Doctor Appointments</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">
              Manage your medical consultations
            </h2>
            <p className="text-gray-600">
              View, reschedule, or cancel your upcoming appointments with
              doctors.
            </p>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
            ) : activeAppointments.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">
                  You don&apos;t have any active doctor appointments.
                </p>
                <Link
                  href="/doctor/book-appointment"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Book a Doctor Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Doctor</p>
                          <p className="text-sm text-gray-500">
                            {appointment.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-2">
                        {getStatusBadge(appointment.status)}
                        <div className="flex space-x-2">
                          {appointment.status === "confirmed" && (
                            <Link
                              href="/doctor/video-consultation"
                              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Link>
                          )}
                          {appointment.status !== "cancelled" && (
                            <button
                              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                              onClick={() =>
                                setSelectedAppointment(appointment)
                              }
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-center">
            <Link
              href="/doctor-dash/book-appointment"
              className="px-4 py-2 bg-sky-500 text-white rounded-2xl hover:bg-sky-700 transition-colors"
            >
              Book New Appointment
            </Link>
          </div>
        </div>

        {/* History Section */}
        {historyAppointments.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => setShowHistory(!showHistory)}
            >
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2 text-gray-400" />
                <h2 className="text-2xl font-bold">Appointment History</h2>
              </div>
              <span className="text-gray-500 text-lg">{showHistory ? "▲" : "▼"}</span>
            </div>
            {showHistory && (
              <div className="p-6">
                <div className="space-y-4">
                  {historyAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 rounded-lg shadow-sm overflow-hidden opacity-80"
                    >
                      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(appointment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Time</p>
                            <p className="text-sm text-gray-500">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Stethoscope className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Doctor</p>
                            <p className="text-sm text-gray-500">
                              {appointment.doctor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Appointment Dialog */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                Cancel Doctor Appointment
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this doctor appointment? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Keep Appointment
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => {
                    handleCancelAppointment(selectedAppointment.id);
                    setSelectedAppointment(null);
                  }}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}