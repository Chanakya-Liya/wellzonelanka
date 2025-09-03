"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { login, register } from "@/app/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { AuthContainer } from "@/app/gym-trainer-auth/auth-container";

export default function GymTrainerAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState<string>("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(loginData);

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });
        router.push("/gym-dash");
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: "trainer", // Set role to trainer
      });

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Your trainer account has been created successfully.",
        });

        // Auto login after registration
        const loginResult = await login({
          email: registerData.email,
          password: registerData.password,
        });

        if (loginResult.success) {
          router.push("/gym-dash");
        } else {
          router.push("/login");
        }
      } else {
        toast({
          title: "Registration Failed",
          description:
            result.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer imageSrc="/trainer.jpg" imageAlt="Gym Trainer">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="text-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Gym Trainer Access</h2>
          <p className="text-gray-600">
            Login or create an account to access trainer features
          </p>
        </div>
        <div className="p-6">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "login"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "register"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 rounded-r-lg"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-sky-500 text-white rounded-3xl hover:bg-sky-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center text-sm mt-4">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-sky-500 hover:underline font-bold"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}

            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="register-name"
                    name="name"
                    placeholder="Name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 rounded-r-lg"
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 rounded-r-lg"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-sky-500 text-white rounded-3xl hover:bg-sky-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Register"}
                </button>
                <div className="text-center text-sm mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-sky-500 hover:underline font-bold"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-center">
          <Link
            href="/gym-doc-home"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}
