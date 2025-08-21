import React, { useState, useEffect } from "react";
import { UserPlus, Dumbbell, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

const RoleSelectionButtons = ({ onChange, initialRole = "user" }) => {
  const [role, setRole] = useState(initialRole);
  const router = useRouter();

  const handleRoleSelection = (selectedRole) => {
    if (selectedRole === "doctor") {
      router.push("/doctor"); // Redirect to doctor.tsx
      return;
    } else if (selectedRole === "trainer") {
      router.push("/trainer-form"); // Redirect to trainer.tsx
      return;
    }

    setRole(selectedRole);
    if (onChange) {
      onChange(selectedRole);
    }
  };

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleRoleSelection("user")}
          className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
            role === "user"
              ? "bg-cyan-50 border-cyan-500 text-cyan-700"
              : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <UserPlus className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">User</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelection("trainer")}
          className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
            role === "trainer"
              ? "bg-cyan-50 border-cyan-500 text-cyan-700"
              : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Dumbbell className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Trainer</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelection("doctor")}
          className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
            role === "doctor"
              ? "bg-cyan-50 border-cyan-500 text-cyan-700"
              : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Stethoscope className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Doctor</span>
        </button>
      </div>

      {(role === "trainer" || role === "doctor") && (
        <p className="text-xs text-amber-600 mt-2">
          Note: {role === "trainer" ? "Trainer" : "Doctor"} accounts require
          verification after registration.
        </p>
      )}
    </div>
  );
};

export default RoleSelectionButtons;
