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
import * as XLSX from "xlsx";

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", {
    message: "Please upload a valid Excel file",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddCategoryWithExcel = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
        // ส่งข้อมูลในรูปแบบ FormData พร้อมกับข้อมูล JSON
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("data", JSON.stringify(previewData)); // เพิ่มข้อมูล JSON

        const response = await fetch('http://localhost:8000/categories/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload categories');
        }

        toast({
            title: "Categories uploaded",
            description: "Categories have been added from the Excel file.",
        });
        navigate("/categories");
    } catch (error) {
        console.error('Error uploading categories:', error);
        toast({
            title: "Upload failed",
            description: "There was an error uploading the categories.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFileChange = (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        setPreviewData(jsonData);
      };
      reader.readAsArrayBuffer(file);
      field.onChange(file);
    }
  };

  return (
    <div className="max-w-2xl animate-enter">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/categories")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Categories with Excel</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an Excel file to add multiple categories to your catalog.
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
                    onChange={handleFileChange(field)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewData.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-bold">Preview Data</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="border border-gray-300 p-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx} className="border border-gray-300 p-2">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/categories")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Categories"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCategoryWithExcel; 