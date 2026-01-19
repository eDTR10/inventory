import { useState } from "react";
import InventoryCRUD from "@/components/InventoryCRUD"
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const Page1 = () => {
  const { login } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    try {
      await login();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setLocalError(message);
    }
  };

  return (
    <div className=" min-h-full w-full max-w-[1468px]  flex flex-col justify-center">
      <ProtectedRoute onLogin={handleLogin}>
        <InventoryCRUD />
      </ProtectedRoute>
      
      {localError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>Error: {localError}</p>
        </div>
      )}
    </div>
  )
}

export default Page1