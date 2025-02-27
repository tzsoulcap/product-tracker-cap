import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", {
    message: "Please upload a valid Excel file",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddProductWithExcel = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Products uploaded",
        description: "Products have been added from the Excel file.",
      });
      navigate("/products");
    }, 1000);
  };

  return (
    <div className="max-w-2xl animate-enter">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/products")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Products with Excel</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an Excel file to add multiple products to your catalog.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excel File</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept=".xlsx" 
                    onChange={(e) => {
                      const files = e.target.files;
                      field.onChange(files ? files[0] : null); // Set the first file or null
                    }} 
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
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Products"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductWithExcel; 