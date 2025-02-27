
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { inventory, products } from "@/lib/data";

const formSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Quantity must be a positive number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateInventory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryItem, setInventoryItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching inventory data
    const itemId = Number(id);
    const item = inventory.find(item => item.id === itemId);
    
    if (item) {
      const product = products.find(p => p.id === item.product_id);
      setInventoryItem({
        ...item,
        product
      });
    }
    
    setLoading(false);
  }, [id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: inventoryItem ? inventoryItem.quantity.toString() : "0",
    },
  });

  // Update form values when inventory item is loaded
  useEffect(() => {
    if (inventoryItem) {
      form.reset({
        quantity: inventoryItem.quantity.toString(),
      });
    }
  }, [inventoryItem, form]);

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Inventory updated",
        description: `Stock quantity has been updated to ${data.quantity}.`,
      });
      navigate("/inventory");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/inventory")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
        
        <div className="rounded-md border border-destructive p-6 text-center">
          <h2 className="text-xl font-semibold text-destructive">Inventory item not found</h2>
          <p className="mt-2 text-muted-foreground">
            The inventory item you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-enter">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/inventory")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Inventory
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Update Inventory</h1>
        <p className="mt-2 text-xl font-medium">
          {inventoryItem.product?.name}
        </p>
        <p className="text-muted-foreground">
          Current stock: {inventoryItem.quantity} units
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/inventory")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Stock"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateInventory;
