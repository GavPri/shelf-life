import { FoodDialog } from "@/components/ui/food-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function AddFoodPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md bg-white border border-gray-200 transition-all hover:shadow-lg">
        <CardContent className="flex flex-col items-start justify-center space-y-6 text-left ">
          <h2 className="text-xl font-semibold text-gray-800">
            Add a Food Item
          </h2>
          <p className="text-sm text-gray-500">
            Keep track of your food items and their expiry dates.
          </p>
          <FoodDialog />
        </CardContent>
      </Card>
    </div>
  );
}
