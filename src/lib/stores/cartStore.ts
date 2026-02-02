import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  courseId: string;
  title: string;
  price: number;
  thumbnail: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  isInCart: (courseId: string) => boolean;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => set((state) => {
        if (state.items.some(i => i.courseId === item.courseId)) return state;
        return { items: [...state.items, item], isOpen: true };
      }),

      removeItem: (courseId) => set((state) => ({
        items: state.items.filter(i => i.courseId !== courseId)
      })),

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),

      isInCart: (courseId) => get().items.some(i => i.courseId === courseId),

      getTotal: () => get().items.reduce((acc, item) => acc + item.price, 0),
    }),
    {
      name: 'shopping-cart',
    }
  )
);
