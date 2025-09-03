"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, User, Video, X } from "lucide-react";
import { getAppointments, cancelAppointment } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  trainer: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

export default function MyAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
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
      await cancelAppointment(id);
      setAppointments(
        appointments.map((app) =>
          app.id === id ? { ...app, status: "cancelled" } : app
        )
      );
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
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

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10 text-black">
      <div className="container mx-auto p-4 max-w-4xl ">
        <div className="flex items-center mb-8">
          <Link href="/gym-dash" className="mr-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Back
            </button>
          </Link>
          <h1 className="text-3xl font-bold">My Appointments</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">
              Manage your scheduled sessions
            </h2>
            <p className="text-gray-600">
              View, reschedule, or cancel your upcoming appointments with
              trainers.
            </p>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">
                  You don&apos;t have any appointments yet.
                </p>
                <Link
                  href="/gym-trainer/book-appointment"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Book an Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                      appointment.status === "cancelled" ? "opacity-60" : ""
                    }`}
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
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Trainer</p>
                          <p className="text-sm text-gray-500">
                            {appointment.trainer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-2">
                        {getStatusBadge(appointment.status)}
                        <div className="flex space-x-2">
                          {appointment.status === "confirmed" && (
                            <Link
                              href="/gym-trainer/video-session"
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
              href="/gym-dash/book-appointment"
              className="px-4 py-2 bg-sky-500 text-white rounded-2xl hover:bg-sky-700 transition-colors"
            >
              Book New Appointment
            </Link>
          </div>
        </div>

        {/* Cancel Appointment Dialog */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Cancel Appointment</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
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
