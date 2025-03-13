import { FoodDialog } from "./food-dialog";
export default function AddFoodPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      {/* Add Food Button */}
      <div className="flex justify-center">
        <FoodDialog />
      </div>
    </div>
  );
}
