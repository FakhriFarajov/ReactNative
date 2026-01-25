import { Coffee } from "@/types/coffee-data-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface CoffeeStore {
    products: Coffee[];
    addProduct: (product: Coffee) => void;
    removeProduct: (id: number) => void;
    getProduct: (id: number) => Coffee | undefined;
    getProducts: () => Coffee[]; // [{},{id,title,price,image,rating,path}]
    getProductCount: () => number;
    getProductTotalPrice: () => number;
    clearProducts: () => void;
}

export const useCoffeeStore = create<CoffeeStore>((set, get) => ({
    products: [],
    addProduct: (product: Coffee) => {
        try {
            const productExists = get().products.find((p) => p.id === product.id);
            if (productExists) {
                set((state) => ({
                    products: state.products.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
                }))
            } else {
                set((state) => ({
                    products: [...state.products, { ...product, quantity: 1 }]
                }))
            }
            AsyncStorage.setItem("products", JSON.stringify(get().products))
        } catch (error) {
            console.log("Error adding product:", error);
        }
    },
    removeProduct: (id: number) => set((state) => ({ products: state.products.filter((product) => product.id !== id) })),
    getProduct: (id: number) => get().products.find((product) => product.id === id),
    getProducts: () => get().products, //[{},{},{}.....]
    getProductCount: () => get().products.length,
    getProductTotalPrice: () => get().products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0),
    clearProducts: () => set({ products: [] }),
}))

