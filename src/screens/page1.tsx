import InventoryCRUD from "@/components/InventoryCRUD"
import ProtectedRoute from "@/components/ProtectedRoute";

const Page1 = () => {
  return (
    <div className=" min-h-full w-full max-w-[1468px]  flex flex-col justify-center">
      <ProtectedRoute>
        <InventoryCRUD />
      </ProtectedRoute>
    </div>
  )
}

export default Page1