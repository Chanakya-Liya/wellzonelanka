"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ResetPasswordPage = () => {
  const params = useParams();
  const router = useRouter();

  const token = params?.token as string;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const { message } = await res.json();
          setError(message || "Invalid or expired token.");
        } else {
          setVerified(true);
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setError("Failed to verify token.");
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || "Failed to reset password.");
      } else {
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  };

  if (!verified) {
    return <p>{error || "Verifying token..."}</p>;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: "url('/assets/regpw.png') center center no-repeat",
        backgroundSize: "cover",
        backgroundColor: "#e6f2f7"
      }}
    >
      <div className="max-w-md w-full bg-white/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-8">
        <div className="text-center mb-8">
          {/* WellZone Lanka Logo with Black Line */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-2">
              <Image src="/assets/lgo.png" alt="Logo" width={60} height={60} className="hover:scale-105 transition-transform duration-300" />
              <span className="ml-2 text-xl font-bold text-black">WellZone Lanka</span>
            </div>
            <div className="h-px bg-black w-52 mt-1"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mt-6">Reset <span className="text-cyan-500">Password</span></h1>
          <p className="text-gray-600 mt-2">Set a new password for your account</p>
        </div>

        {error && (
          <div className="bg-red-50/70 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6 border border-red-100">
            <TriangleAlert className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className="w-full pl-4 pr-10 py-3 bg-gray-50/70 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                className="w-full pl-4 pr-10 py-3 bg-gray-50/80 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={pending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {password && confirmPassword && (
              <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            disabled={pending || error.length > 0}
          >
            {pending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
