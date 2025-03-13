"use client";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { getFoodItems } from "@/utils/requests";
import { PlusCircle, Search, Settings, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns"; // Import date formatting

interface Food {
  id: string;
  name: string;
  location: string;
  expiry_date: string; // Expiry date stored as a string in Supabase
  quantity: number;
}

export default function FoodPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      if (user) {
        try {
          const token = await getToken({ template: "supabase" });
          if (!token) {
            throw new Error("Authentication token missing");
          }
          const userId = user.id;
          const foodData = await getFoodItems({ userId, token });

          console.log("Fetched food data:", foodData); // Debugging

          // Ensure expiryDate is properly formatted before setting state
          const formattedFoods = foodData.map((food: Food) => {
            const expiry = food.expiry_date ? new Date(food.expiry_date) : null;
            return {
              ...food,
              expiry_date:
                expiry && !isNaN(expiry.getTime())
                  ? format(expiry, "MMMM, do") // 👉 Formats as "March, 17th"
                  : "No Expiry Date",
            };
          });

          setFoods(formattedFoods);
        } catch (err: any) {
          console.error("Error fetching food items:", err.message);
          setError("Failed to fetch food items. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFoods();
  }, [user, getToken]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Utensils className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">ShelfLife</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search food items..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </header>
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="all">All ({foods.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {foods.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {foods.map((food) => (
                  <Card
                    key={food.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-3xl tracking-wide">
                          {food.name}
                        </h3>
                        <Badge
                          variant={"outline"}
                          className="text-md capitalize"
                        >
                          {food.expiry_date} {/* Properly formatted date */}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex flex-col items-start gap-8">
                        <div>
                          <Badge
                            variant="secondary"
                            className="mb-1 inline-block"
                          >
                            Quantity: {food.quantity}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Location: {food.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">No food items found.</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Add your first item
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
