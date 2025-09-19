"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, User, ArrowLeft, Phone, Camera, Mic } from "lucide-react";
import { Suspense } from "react";
import { withAuth } from "@/hooks/useAuth";

function VideoSessionContent() {
  const searchParams = useSearchParams();
  const trainerId = searchParams.get("trainerId");
  const trainerName = searchParams.get("trainerName");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href={`/gym-dash${
              trainerId
                ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(
                    trainerName || ""
                  )}`
                : ""
            }`}
            className="mr-4"
          >
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Video Session</h1>
            {trainerName && (
              <div className="flex items-center mt-2 text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>
                  With:{" "}
                  <strong>{decodeURIComponent(trainerName)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Video Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video call will appear here</p>
                    <p className="text-sm opacity-75">
                      Click "Start Session" to begin
                    </p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="flex justify-center space-x-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                  <Button variant="outline" size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button variant="outline" size="lg">
                    <Mic className="h-4 w-4 mr-2" />
                    Microphone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainerName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Trainer
                    </label>
                    <p className="font-semibold">
                      {decodeURIComponent(trainerName)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Session Type
                  </label>
                  <p className="font-semibold">Personal Training</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Duration
                  </label>
                  <p className="font-semibold">60 minutes</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <p className="font-semibold text-green-600">
                    Ready to Connect
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pre-Session Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Camera is working</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Microphone is working</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Stable internet connection</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Workout space is ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trainerId && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href={`/gym-dash/book-appointment?trainerId=${trainerId}&trainerName=${encodeURIComponent(
                      trainerName || ""
                    )}`}
                  >
                    <Button variant="outline" className="w-full">
                      Book Another Session
                    </Button>
                  </Link>
                  <Link
                    href={`/gym-dash/my-appointments?trainerId=${trainerId}&trainerName=${encodeURIComponent(
                      trainerName || ""
                    )}`}
                  >
                    <Button variant="outline" className="w-full">
                      View My Appointments
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Session Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Add any notes about your session here..."
            />
            <div className="mt-3 flex justify-end">
              <Button variant="outline">Save Notes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VideoSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <VideoSessionContent />
    </Suspense>
  );
}

export default withAuth(VideoSessionPage, {
  showLoadingMessage: "Please log in to access your video training sessions."
});
