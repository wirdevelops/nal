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

import { useCallback, useMemo } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import type { Product, ProductCategory } from '@/types/store';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseProductHook {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  favoriteIds: string[];
  hasNextPage: boolean;
  currentPage: number;
  totalItems: number;
  
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => void;
  toggleFavorite: (productId: string) => void;
  filterByCategory: (category: ProductCategory) => void;
  filterByPriceRange: (min: number, max: number) => void;
  sortProducts: (by: 'price' | 'date' | 'popularity') => void;
  resetFilters: () => void;
  loadNextPage: () => void;
  refreshProduct: (productId: string) => Promise<void>;
  batchUpdateProducts: (updates: Array<{id: string, changes: Partial<Product>}>) => Promise<void>;
  batchRemoveProducts: (ids: string[]) => Promise<void>;
}
export function useProducts() {
  const store = useProductStore();

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<any>,
    errorMessage: string
  ) => {
    store.startLoading();
    try {
      return await operation();
    } catch (error) {
      console.error(errorMessage, error);
      store.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      store.stopLoading();
    }
  }, [store]);

  const createProduct = useCallback(async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'status'>
  ): Promise<Product> => {
    const baseProduct = {
      ...product,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sellerId: 'test',
      status: 'active' as const,
    };
  
    // Explicitly type as Product union
    const newProduct: Product = product.type === 'physical' ? {
      ...baseProduct,
      type: 'physical',
      condition: 'new',
      brand: '',
      model: '',
      specifications: {},
      includedItems: [],
      shippingOptions: [],
      inventory: {
        stock: 0,
        backorder: false,
        alerts: undefined,
        restockDate: undefined
      },
      returnPolicy: {
        days: 0,
        condition: 'new'
      },
      weight: undefined,
      dimensions: undefined,
      promotions: undefined
    } : {
      ...baseProduct,
      type: 'digital',
      fileType: 'zip',
      fileSize: 0,
      compatibility: [],
      version: '1.0.0',
      downloadUrl: 'https://example.com/download',
      previewUrl: undefined,
      requirements: undefined,
      licenseType: 'single-use',
      downloadLimit: undefined,
      accessPeriod: undefined,
      updatesIncluded: false
    };
  
    return handleAsyncOperation(async () => {
      store.addProduct(newProduct);
      toast.success('Product Created');
      return newProduct;
    }, 'Failed to add product');
  }, [handleAsyncOperation, store]);
  
  const updateProduct = useCallback(async (
    id: string,
    updates: Partial<Product>
  ) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/products/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      store.updateProduct(id, updates);
    }, 'Failed to update product');
  }, [store, handleAsyncOperation]);

  const removeProduct = useCallback(async (id: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/products/${id}`, { method: 'DELETE' });
      store.removeProduct(id);
    }, 'Failed to remove product');
  }, [store, handleAsyncOperation]);

  const batchUpdateProducts = useCallback(async (
    updates: Array<{id: string, changes: Partial<Product>}>
  ) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/products/batch', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ updates })
      // });
      store.batchUpdateProducts(updates);
    }, 'Failed to update products');
  }, [store, handleAsyncOperation]);

  const batchRemoveProducts = useCallback(async (ids: string[]) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/products/batch', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ids })
      // });
      store.batchRemoveProducts(ids);
    }, 'Failed to remove products');
  }, [store, handleAsyncOperation]);

  const refreshProduct = useCallback(async (productId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/products/${productId}`);
      // const product = await response.json();
      // store.updateProduct(productId, product);
      await store.refreshProduct(productId);
    }, 'Failed to refresh product');
  }, [store, handleAsyncOperation]);

  return {
    // State
    products: store.products,
    filteredProducts: store.filteredProducts,
    isLoading: store.isLoading,
    error: store.error,
    favoriteIds: store.favoriteIds,
    hasNextPage: store.hasNextPage,
    currentPage: store.currentPage,
    totalItems: store.totalItems,
    
    // Actions
    createProduct,
    updateProduct: store.updateProduct,
    removeProduct: store.removeProduct,
    searchProducts: store.searchProducts,
    toggleFavorite: store.toggleFavorite,
    filterByCategory: store.filterByCategory,
    filterByPriceRange: store.filterByPriceRange,
    sortProducts: store.sortProducts,
    resetFilters: store.resetFilters,
    loadNextPage: store.loadNextPage,
    refreshProduct,
    batchUpdateProducts,
    batchRemoveProducts
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