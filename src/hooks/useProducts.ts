// // hooks/useProduct.ts
// import { useCallback, useEffect, useState } from 'react';
// import { useProductStore } from '@/stores/useProductStore';
// import type { Product, PhysicalProduct, DigitalProduct } from '@/types/store/product';
// import { toast } from 'react-hot-toast';

// interface UseProductHook {
//     products: Product[];
//     isLoading: boolean;
//     error: string | null;
//     createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>) => Promise<void>;
//     searchProducts: (search: string) => void;
//     seedDatabase: () => Promise<void>;
// }

// export function useProduct(): UseProductHook {
//     const {
//         products,
//         isLoading,
//         error,
//         addProduct: addProductToStore,
//         updateProduct: updateProductInStore,
//         removeProduct: removeProductFromStore,
//         setProducts: setProductsInStore,
//         startLoading,
//         stopLoading,
//         setError
//     } = useProductStore();
    
//     const [hasSeeded, setHasSeeded] = useState(false);

//     const seedDatabase = useCallback(async () => {
//         if(hasSeeded) return;
//          startLoading();
//            try {
//              const newProducts: Product[] = [
//                        {
//                            id: 'product1',
//                            title: 'Awesome Camera',
//                            description: 'This is an awesome camera that will change your life',
//                            price: 499,
//                            type: 'physical',
//                            category: 'cameras',
//                            sellerId: 'user123',
//                            images: ['/placeholder.png', '/placeholder.png'],
//                            createdAt: new Date().toISOString(),
//                            updatedAt: new Date().toISOString(),
//                            status: 'active',
//                            stock: 10,
//                            tags: ['camera', 'awesome'],
//                            condition: 'new',
//                            brand: 'Canon',
//                            model: 'EOS R5',
//                            specifications: {
//                                'Sensor': 'Full Frame',
//                                'Resolution': '45MP'
//                            },
//                            includedItems: ['Camera Body', 'Battery', 'Charger'],
//                            shippingOptions: [{ name: 'Standard', price: 5 }, { name: 'Express', price: 15 }]
//                        } as unknown as PhysicalProduct,
//                       {
//                           id: 'product2',
//                           title: 'Cool Lens',
//                           description: 'This is a cool lens that will change your life',
//                           price: 999,
//                           type: 'physical',
//                           category: 'lenses',
//                           sellerId: 'user123',
//                           images: ['/placeholder.png', '/placeholder.png'],
//                           createdAt: new Date().toISOString(),
//                           updatedAt: new Date().toISOString(),
//                           status: 'active',
//                           stock: 5,
//                           tags: ['lens', 'cool'],
//                           condition: 'like-new',
//                           brand: 'Sigma',
//                           model: '18-35mm f1.8',
//                           specifications: {
//                               'Aperture': 'f/1.8',
//                               'Focal Length': '18-35mm'
//                           },
//                           includedItems: ['Lens', 'Lens Cap', 'Lens Hood'],
//                           shippingOptions: [{ name: 'Standard', price: 5 }, { name: 'Express', price: 15 }]
//                       } as unknown as PhysicalProduct,
//                        {
//                         id: 'product3',
//                         title: 'Amazing Preset',
//                         description: 'This is an amazing preset that will change your life',
//                         price: 29,
//                         type: 'digital',
//                         category: 'presets',
//                         sellerId: 'user123',
//                            images: ['/placeholder.png', '/placeholder.png'],
//                         createdAt: new Date().toISOString(),
//                            updatedAt: new Date().toISOString(),
//                         status: 'active',
//                         tags: ['preset', 'amazing'],
//                             fileType: 'zip',
//                             fileSize: 1024,
//                            compatibility: ['Lightroom', 'Photoshop'],
//                              version: '1.0',
//                              downloadUrl: 'https://test.com',
//                        } as DigitalProduct,
//                         {
//                             id: 'product4',
//                             title: 'Professional Lighting Kit',
//                             description: 'A professional lighting kit for high-quality shoots.',
//                             price: 1200,
//                             type: 'physical',
//                             category: 'lighting',
//                             sellerId: 'user123',
//                             images: ['/placeholder.png'],
//                             createdAt: new Date().toISOString(),
//                             updatedAt: new Date().toISOString(),
//                             status: 'active',
//                             stock: 2,
//                             tags: ['lighting', 'professional'],
//                             condition: 'new',
//                             brand: 'Godox',
//                             model: 'SL150 II',
//                             specifications: {
//                                 'Power': '150W',
//                                 'Color Temp': '5600K',
//                             },
//                             includedItems: ['Light', 'Reflector', 'Power Cable'],
//                             shippingOptions: [{ name: 'Standard', price: 10 }, { name: 'Express', price: 20 }]
//                         } as unknown as PhysicalProduct,
//                  ]
//                  setProductsInStore(newProducts);
//                  setHasSeeded(true);
//                 toast.success('Database Seeded')
//         } catch (err) {
//             setError('Could not load products')
//             console.error("Could not fetch products", err)
//              toast.error('Could not load products');
//         } finally {
//             stopLoading();
//         }
//     }, [setHasSeeded, setProductsInStore, startLoading, stopLoading, setError, hasSeeded]);


//     useEffect(() => {
//       if (products.length === 0) {
//         seedDatabase();
//       }
//     }, [products, seedDatabase]);

//     const createProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>) => {
//       startLoading();
//         try {
//             const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sellerId: 'test', status: 'active' } as Product
//             addProductToStore(newProduct);
//             toast.success('Product Created')
//         } catch (error) {
//              setError('Could not create product')
//              console.error("Could not create product", error)
//              toast.error('Could not create product');
//         } finally {
//             stopLoading()
//         }
//     }, [addProductToStore, startLoading, stopLoading, setError]);


//     const searchProducts = useCallback(async (search: string) => {
//          //TODO: Add API search logic here
//     }, []);


//     return {
//         products,
//         isLoading,
//         error,
//         createProduct,
//         searchProducts,
//         seedDatabase
//     };
// }

// hooks/useProduct.ts
import { useCallback } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import type { Product, ProductCategory } from '@/types/store/product';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseProductHook {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>) => Promise<Product>;
    searchProducts: (search: string) => void;
    toggleFavorite: (productId: string) => void;
    favoriteIds: string[];
}

export function useProduct(): UseProductHook {
    const store = useProductStore();

    const createProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>): Promise<Product> => {
        try {
          const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sellerId: 'test', status: 'active' } as Product;
            store.addProduct(newProduct);
             // Later: API integration
             // const res = await fetch('/api/products', {
                // method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify(newProduct)
            // });
             toast.success('Product Created')
           return newProduct;
        } catch (error) {
            console.error('Failed to add product:', error);
            store.setError('Failed to add product');
            toast.error('Failed to add product:');
            throw error;
        }
    }, [store]);

    const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
        try {
            store.updateProduct(id, updates);
             // Later: API integration
              // await fetch(`/api/products/${id}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updates),
            // });
        } catch (error) {
            console.error('Failed to update product:', error);
            store.setError('Failed to update product');
             toast.error('Failed to update product:');
            throw error;
        }
    }, [store]);

    const removeProduct = useCallback(async (id: string) => {
        try {
            store.removeProduct(id);
             // Later: API integration
             // await fetch(`/api/products/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Failed to remove product:', error);
             store.setError('Failed to remove product');
             toast.error('Failed to remove product:');
            throw error;
        }
    }, [store]);

    const setProducts = useCallback(async(products: Product[]) => {
        try {
            store.setProducts(products)
            // API integration later
            // const res = await fetch('/api/products')
            // if (res.ok) {
            //     const data = await res.json()
            //     store.setProducts(data);
            // }
        } catch (error) {
          console.log("could not set the products", error)
            store.setError("could not set the products");
             toast.error('could not set the products');
          throw error;
        }
    }, [store])

    const searchProducts = useCallback(async (search: string) => {
         //TODO: Add API search logic here
    }, []);


   const toggleFavorite = useCallback((productId: string) => {
     store.toggleFavorite(productId);
   }, [store]);


    return {
        products: store.products,
        isLoading: store.isLoading,
        error: store.error,
        createProduct,
        searchProducts,
        toggleFavorite,
        favoriteIds: store.favoriteIds,
    };
}

// // hooks/useProduct.ts
// import { useCallback } from 'react';
// import { useProductStore } from '@/stores/useProductStore';
// import type { Product, ProductCategory } from '@/types/store/product';

// export function useProduct() {
//   const store = useProductStore();

//     const addProduct = useCallback(async (product: Product) => {
//         try {
//             store.addProduct(product);
//              // Later: API integration
//              // const res = await fetch('/api/products', {
//                 // method: 'POST',
//                 // headers: { 'Content-Type': 'application/json' },
//                 // body: JSON.stringify(product)
//             // });
//         } catch (error) {
//             console.error('Failed to add product:', error);
//             throw error;
//         }
//     }, []);

//     const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
//         try {
//             store.updateProduct(id, updates);
//              // Later: API integration
//               // await fetch(`/api/products/${id}`, {
//             //     method: 'PATCH',
//             //     headers: { 'Content-Type': 'application/json' },
//             //     body: JSON.stringify(updates),
//             // });
//         } catch (error) {
//             console.error('Failed to update product:', error);
//             throw error;
//         }
//     }, []);

//     const removeProduct = useCallback(async (id: string) => {
//         try {
//             store.removeProduct(id);
//              // Later: API integration
//              // await fetch(`/api/products/${id}`, { method: 'DELETE' });
//         } catch (error) {
//             console.error('Failed to remove product:', error);
//             throw error;
//         }
//     }, []);

//     const setProducts = useCallback(async(products: Product[]) => {
//         try {
//             store.setProducts(products)
//             // API integration later
//             // const res = await fetch('/api/products')
//             // if (res.ok) {
//             //     const data = await res.json()
//             //     store.setProducts(data);
//             // }
//         } catch (error) {
//           console.log("could not set the products", error)
//           throw error;
//         }
//     },[])

//     const findByCategory = useCallback((category: ProductCategory) => {
//          return store.products.filter(product => product.category === category)
//       }, [store.products])
//   return {
//     products: store.products,
//     isLoading: store.isLoading,
//     error: store.error,
//       addProduct,
//       updateProduct,
//       removeProduct,
//       setProducts,
//       findByCategory
//   };
// }