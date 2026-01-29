import InventoryCRUD from "@/components/InventoryCRUD"
import AdminRoute from "@/components/AdminRoute";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Page1 = () => {
  const navigate = useNavigate();

  return (
    <div className=" min-h-full w-full max-w-[1468px]  flex flex-col justify-center">
      <AdminRoute allowAccLvl0={true}>
        <div className="w-full p-4 sm:p-6">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => navigate('/inventory/summary')}
              className="flex items-center gap-2"
              variant="default"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">View Log Summary</span>
              <span className="sm:hidden">Summary</span>
            </Button>
          </div>
          <InventoryCRUD />
        </div>
      </AdminRoute>
    </div>
  )
}

export default Page1