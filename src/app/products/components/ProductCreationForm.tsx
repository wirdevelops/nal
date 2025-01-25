import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Loader2, X } from 'lucide-react';
import { useProductStore } from '@/hooks/useProductStore';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';

const productSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.number().min(0.01, { message: 'Price must be at least $0.01' }),
  type: z.enum(['physical', 'digital']),
  category: z.enum([
    'cameras', 'lenses', 'lighting', 'audio', 'accessories',
    'presets', 'luts', 'templates', 'scripts', 'plugins'
  ]),
  tags: z.string().optional(),
  images: z.array(z.string()).min(1, { message: 'Please upload at least one image' }),
  inventory: z.object({
    stock: z.number().min(0),
    sku: z.string().optional(),
    backorder: z.boolean().default(false)
  }).optional(),
  fileUrl: z.string().optional(),
  version: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.type === 'physical' && !data.inventory?.stock) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Stock is required for physical products",
      path: ["inventory.stock"]
    });
  }
  if (data.type === 'digital' && !data.fileUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File URL is required for digital products",
      path: ["fileUrl"]
    });
  }
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductCreationFormProps {
  onClose: () => void;
}

export function ProductCreationForm({ onClose }: ProductCreationFormProps) {
  const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { createProduct } = useProductStore();
  const router = useRouter();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: 'physical',
      price: 0,
      images: [],
      inventory: {
        stock: 0,
        backorder: false
      }
    }
  });

  // const handleImageUpload = (images: string[]) => {
  //   form.setValue('images', images, { shouldValidate: true });
  //   setSelectedImages(images);
  // };
  const handleImageUpload = (images: string[]) => {
    form.setValue('images', images, { shouldValidate: true });
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      const productData = {
        ...values,
        tags: values.tags?.split(',').map(tag => tag.trim()) || [],
        ...(values.type === 'physical' && {
          inventory: values.inventory
        }),
        ...(values.type === 'digital' && {
          fileUrl: values.fileUrl,
          version: values.version
        })
      };

      const newProduct = await createProduct(productData);
      router.push(`/products/${newProduct.id}`);
      toast.success('Product created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create product');
      console.error("Product creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Create New Product</h2>
          <p className="text-sm text-muted-foreground">Add details for your new product</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
  
      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          
          {/* Product Type Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={productType === 'physical' ? 'default' : 'outline'}
              onClick={() => {
                setProductType('physical');
                form.setValue('type', 'physical');
                form.resetField('fileUrl');
                form.resetField('version');
              }}
            >
              Physical Product
            </Button>
            <Button
              type="button"
              variant={productType === 'digital' ? 'default' : 'outline'}
              onClick={() => {
                setProductType('digital');
                form.setValue('type', 'digital');
                form.resetField('inventory');
              }}
            >
              Digital Product
            </Button>
          </div>
  
          {/* Common Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your product..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productType === 'physical' ? (
                          <>
                            <SelectItem value="cameras">Cameras</SelectItem>
                            <SelectItem value="lenses">Lenses</SelectItem>
                            <SelectItem value="lighting">Lighting</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="presets">Presets</SelectItem>
                            <SelectItem value="luts">LUTs</SelectItem>
                            <SelectItem value="templates">Templates</SelectItem>
                            <SelectItem value="scripts">Scripts</SelectItem>
                            <SelectItem value="plugins">Plugins</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
  
          {/* Type-Specific Fields */}
          {productType === 'physical' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Inventory Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inventory.stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory.sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product SKU" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory.backorder"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Allow Backorders</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
  
          {productType === 'digital' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Digital Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Download URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/download" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1.0.0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
  
          {/* Images Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxFiles={productType === 'physical' ? 5 : 1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          {/* Tags */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Tags</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Comma separated tags (e.g., camera, lens, 4k)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          {/* Submit Button */}
          <div className="sticky bottom-0 border-t bg-background px-6 py-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}