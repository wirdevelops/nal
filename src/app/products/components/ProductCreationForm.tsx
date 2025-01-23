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
import { Loader2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const productSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    price: z.string().transform(Number)
        .pipe(z.number({
            invalid_type_error: 'Price must be a number',
        }).min(0, { message: 'Price must be at least 0' })),
    stock: z.string().transform(Number)
        .pipe(z.number({
            invalid_type_error: 'Stock must be a number',
        }).min(0, { message: 'Stock must be at least 0'})),
    type: z.enum(['physical', 'digital'], {
        required_error: 'Please select a product type'
    }),
    category: z.enum([
            'cameras',
            'lenses',
            'lighting',
            'audio',
            'accessories',
            'presets',
            'luts',
            'templates',
            'scripts',
            'plugins'
        ],
        {
            required_error: 'Please select a category'
        }),
    condition: z.enum(['new', 'like-new', 'good', 'fair']).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    images: z.array(z.string()).min(1, {message: 'Please upload at least one image'}),
    tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductCreationFormProps {
    onClose: () => void;
}

export function ProductCreationForm({ onClose }: ProductCreationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const { createProduct } = useProduct();
    const router = useRouter();
    
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
          type: 'physical',
            images: []
        },
    });


    const handleImageUpload = (images: string[]) => {
       form.setValue('images', images, { shouldValidate: true});
        setSelectedImages(images);
    }

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsSubmitting(true);
            const newProduct = await createProduct({
                ...data,
                images: selectedImages,
                tags: data.tags?.split(',').map(tag => tag.trim()),
                 id: uuidv4(),
                createdAt: new Date().toISOString(),
                 updatedAt: new Date().toISOString(),
                sellerId: 'test',
                status: 'active'
            });

            onClose();
            router.push(`/products/${newProduct.id}`)
        } catch (error) {
            console.error("Failed to create product", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Product Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Product title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                           control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="Product price" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                         render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Product description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                    />
                </div>

                {/* Product Type and Category */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Type and Category</h2>
                    <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                         name="type"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a product type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="physical">Physical</SelectItem>
                                  <SelectItem value="digital">Digital</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                  <SelectContent>
                                  <SelectItem value="cameras">Cameras</SelectItem>
                                      <SelectItem value="lenses">Lenses</SelectItem>
                                    <SelectItem value="lighting">Lighting</SelectItem>
                                    <SelectItem value="audio">Audio</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                    <SelectItem value="presets">Presets</SelectItem>
                                    <SelectItem value="luts">Luts</SelectItem>
                                    <SelectItem value="templates">Templates</SelectItem>
                                    <SelectItem value="scripts">Scripts</SelectItem>
                                    <SelectItem value="plugins">Plugins</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                      />

                    </div>
                  </div>
                {/* Additional Details (Conditional) */}
                {form.watch('type') === 'physical' && (
                   <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Additional Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                   <FormItem>
                                    <FormLabel>Condition</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a condition" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="like-new">Like New</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                           <FormField
                             control={form.control}
                            name="stock"
                            render={({ field }) => (
                               <FormItem>
                                <FormLabel>Stock</FormLabel>
                                 <FormControl>
                                 <Input placeholder="Product Stock" type="number" {...field} />
                               </FormControl>
                                <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                       <div className="grid grid-cols-2 gap-4">
                         <FormField
                             control={form.control}
                                name="brand"
                             render={({ field }) => (
                                <FormItem>
                                 <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                   <Input placeholder="Product brand" {...field} />
                                 </FormControl>
                                <FormMessage />
                                 </FormItem>
                                )}
                            />
                           <FormField
                               control={form.control}
                            name="model"
                            render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product model" {...field} />
                                     </FormControl>
                                  <FormMessage />
                                    </FormItem>
                                )}
                            />
                       </div>
                    </div>
                )}

                  {/* Images */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Product Images</h2>
                    <FormField
                        control={form.control}
                        name="images"
                         render={() => (
                            <FormItem>
                             <FormControl>
                                 <ImageUpload onUpload={handleImageUpload}  initialImages={form.getValues('images')}/>
                               </FormControl>
                               <FormMessage />
                               </FormItem>
                             )}
                      />
                </div>


                 {/* Tags */}
                <div className="space-y-4">
                     <h2 className="text-lg font-semibold">Product Tags</h2>
                   <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags (comma separated)</FormLabel>
                               <FormControl>
                                <Input placeholder="Enter tags separated by commas" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                         )}
                    />
                </div>


                {/* Submit Button */}
                <Button 
                    type="submit" 
                    className="w-full"
                     disabled={isSubmitting}
                 >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </form>
         </Form>
    );
}

// // components/store/ProductCreationForm.tsx
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ImageUpload } from './ImageUpload';
// import { Loader2 } from 'lucide-react';
// import { useProduct } from '@/hooks/useProducts';


// const productSchema = z.object({
//   title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
//   description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
//   price: z.string().transform(Number)
//       .pipe(z.number({
//     invalid_type_error: 'Price must be a number',
//   }).min(0, { message: 'Price must be at least 0' })),
//     stock: z.string().transform(Number)
//       .pipe(z.number({
//           invalid_type_error: 'Stock must be a number',
//       }).min(0, { message: 'Stock must be at least 0'})),
//   type: z.enum(['physical', 'digital'], {
//       required_error: 'Please select a product type'
//   }),
//   category: z.enum([
//         'cameras',
//         'lenses',
//         'lighting',
//         'audio',
//         'accessories',
//         'presets',
//         'luts',
//         'templates',
//         'scripts',
//         'plugins'
//     ],
//     {
//       required_error: 'Please select a category'
//     }),
//   condition: z.enum(['new', 'like-new', 'good', 'fair']).optional(),
//     brand: z.string().optional(),
//     model: z.string().optional(),
//    images: z.array(z.string()).min(1, {message: 'Please upload at least one image'}),
//   tags: z.string().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// interface ProductCreationFormProps {
//     onClose: () => void;
// }

// export function ProductCreationForm({ onClose }: ProductCreationFormProps) {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [selectedImages, setSelectedImages] = useState<string[]>([]);
//     const { createProduct } = useProduct();
    
//     const form = useForm<ProductFormData>({
//         resolver: zodResolver(productSchema),
//         defaultValues: {
//           type: 'physical'
//         }
//     });

//     const handleImageUpload = (images: string[]) => {
//         setSelectedImages(images);
//     }

//     const onSubmit = async (data: ProductFormData) => {
//         try {
//             setIsSubmitting(true);
//            await createProduct({...data, images: selectedImages, tags: data.tags?.split(',').map(tag => tag.trim())})

//             onClose();
//         } catch (error) {
//             console.error("Failed to create product", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 {/* Basic Product Information */}
//                 <div className="space-y-4">
//                   <h2 className="text-lg font-semibold">Basic Information</h2>
//                     <div className="grid grid-cols-2 gap-4">
//                        <FormField
//                         control={form.control}
//                         name="title"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Title</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Product title" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                        <FormField
//                            control={form.control}
//                             name="price"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Price</FormLabel>
//                                 <FormControl>
//                                   <Input placeholder="Product price" type="number" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                         />
//                     </div>

//                     <FormField
//                         control={form.control}
//                         name="description"
//                          render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Description</FormLabel>
//                               <FormControl>
//                                 <Textarea placeholder="Product description" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                     />
//                 </div>

//                 {/* Product Type and Category */}
//                 <div className="space-y-4">
//                   <h2 className="text-lg font-semibold">Type and Category</h2>
//                     <div className="grid grid-cols-2 gap-4">
//                      <FormField
//                         control={form.control}
//                          name="type"
//                         render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Type</FormLabel>
//                               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select a product type" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="physical">Physical</SelectItem>
//                                   <SelectItem value="digital">Digital</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                       />

//                        <FormField
//                         control={form.control}
//                         name="category"
//                         render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Category</FormLabel>
//                               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select a category" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                   <SelectContent>
//                                   <SelectItem value="cameras">Cameras</SelectItem>
//                                       <SelectItem value="lenses">Lenses</SelectItem>
//                                     <SelectItem value="lighting">Lighting</SelectItem>
//                                     <SelectItem value="audio">Audio</SelectItem>
//                                     <SelectItem value="accessories">Accessories</SelectItem>
//                                     <SelectItem value="presets">Presets</SelectItem>
//                                     <SelectItem value="luts">Luts</SelectItem>
//                                     <SelectItem value="templates">Templates</SelectItem>
//                                     <SelectItem value="scripts">Scripts</SelectItem>
//                                     <SelectItem value="plugins">Plugins</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                       />

//                     </div>
//                   </div>
//                 {/* Additional Details (Conditional) */}
//                 {form.watch('type') === 'physical' && (
//                    <div className="space-y-4">
//                         <h2 className="text-lg font-semibold">Additional Details</h2>
//                         <div className="grid grid-cols-2 gap-4">
//                              <FormField
//                                 control={form.control}
//                                 name="condition"
//                                 render={({ field }) => (
//                                    <FormItem>
//                                     <FormLabel>Condition</FormLabel>
//                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                         <FormControl>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select a condition" />
//                                         </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="new">New</SelectItem>
//                                             <SelectItem value="like-new">Like New</SelectItem>
//                                             <SelectItem value="good">Good</SelectItem>
//                                             <SelectItem value="fair">Fair</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                            <FormField
//                              control={form.control}
//                             name="stock"
//                             render={({ field }) => (
//                                <FormItem>
//                                 <FormLabel>Stock</FormLabel>
//                                  <FormControl>
//                                  <Input placeholder="Product Stock" type="number" {...field} />
//                                </FormControl>
//                                 <FormMessage />
//                                 </FormItem>
//                                 )}
//                             />
//                         </div>
//                        <div className="grid grid-cols-2 gap-4">
//                          <FormField
//                              control={form.control}
//                                 name="brand"
//                              render={({ field }) => (
//                                 <FormItem>
//                                  <FormLabel>Brand</FormLabel>
//                                     <FormControl>
//                                    <Input placeholder="Product brand" {...field} />
//                                  </FormControl>
//                                 <FormMessage />
//                                  </FormItem>
//                                 )}
//                             />
//                            <FormField
//                                control={form.control}
//                             name="model"
//                             render={({ field }) => (
//                                  <FormItem>
//                                     <FormLabel>Model</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Product model" {...field} />
//                                      </FormControl>
//                                   <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                        </div>
//                     </div>
//                 )}

//                   {/* Images */}
//                 <div className="space-y-4">
//                     <h2 className="text-lg font-semibold">Product Images</h2>
//                     <FormField
//                         control={form.control}
//                         name="images"
//                          render={() => (
//                             <FormItem>
//                              <FormControl>
//                                  <ImageUpload onUpload={handleImageUpload} />
//                                </FormControl>
//                                <FormMessage />
//                                </FormItem>
//                              )}
//                       />
//                 </div>


//                  {/* Tags */}
//                 <div className="space-y-4">
//                      <h2 className="text-lg font-semibold">Product Tags</h2>
//                    <FormField
//                         control={form.control}
//                         name="tags"
//                         render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Tags (comma separated)</FormLabel>
//                                <FormControl>
//                                 <Input placeholder="Enter tags separated by commas" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                          )}
//                     />
//                 </div>


//                 {/* Submit Button */}
//                 <Button 
//                     type="submit" 
//                     className="w-full"
//                      disabled={isSubmitting}
//                  >
//                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                    {isSubmitting ? 'Creating...' : 'Create Product'}
//                 </Button>
//             </form>
//          </Form>
//     );
// }