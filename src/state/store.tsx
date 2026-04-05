import { createContext, useContext, useState, type ReactNode } from "react";
import { products as seedProducts, type Product, type ProductCategory } from "@/data/storefront";

export type OrderStatus = "New" | "Processing" | "Completed";
export type OrderChannel = "Site" | "WhatsApp";

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  unitPrice: number;
  channel: OrderChannel;
  status: OrderStatus;
  createdAt: string;
}

interface StoreState {
  products: Product[];
  orders: Order[];
}

interface NewProductInput {
  name: string;
  price: number;
  stock: number;
  badge?: string;
  category: Exclude<ProductCategory, "All">;
  shape: string;
  finish: string;
  description: string;
  image: string;
  reviewCount?: number;
}

interface StoreContextValue extends StoreState {
  addProduct: (product: NewProductInput) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  adjustProductStock: (productId: string, delta: number) => void;
  removeOrder: (orderId: string) => void;
  placeOrder: (input: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const STORAGE_KEY = "studionail-store-v1";

const seedOrders: Order[] = [
  {
    id: "order_1001",
    productId: "azure-electric",
    productName: "Azure Electric Fluid",
    quantity: 1,
    size: "M",
    unitPrice: 45,
    channel: "Site",
    status: "New",
    createdAt: "2026-04-05T08:20:00.000Z"
  },
  {
    id: "order_1002",
    productId: "botanical-hunter",
    productName: "Botanical Hunter",
    quantity: 2,
    size: "S",
    unitPrice: 44,
    channel: "WhatsApp",
    status: "Processing",
    createdAt: "2026-04-04T15:10:00.000Z"
  }
];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeProducts(products: Product[]) {
  return products.map((product) => ({
    ...product,
    stock: Number.isFinite(product.stock) ? product.stock : 0
  }));
}

function loadInitialState(): StoreState {
  const fallbackState: StoreState = {
    products: normalizeProducts(seedProducts),
    orders: seedOrders
  };

  if (typeof window === "undefined") {
    return fallbackState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return fallbackState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoreState>;

    return {
      products: normalizeProducts(parsed.products ?? seedProducts),
      orders: Array.isArray(parsed.orders) ? parsed.orders : seedOrders
    };
  } catch {
    return fallbackState;
  }
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => loadInitialState());

  function persist(nextState: StoreState) {
    setState(nextState);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  }

  function addProduct(product: NewProductInput) {
    const nextProduct: Product = {
      id: createId("product"),
      reviewCount: product.reviewCount ?? 0,
      ...product
    };

    const nextState = {
      ...state,
      products: [nextProduct, ...state.products]
    };

    persist(nextState);
  }

  function deleteProduct(productId: string) {
    const nextState = {
      ...state,
      products: state.products.filter((product) => product.id !== productId),
      orders: state.orders.filter((order) => order.productId !== productId)
    };

    persist(nextState);
  }

  function updateProductStock(productId: string, stock: number) {
    const nextState = {
      ...state,
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, stock) } : product
      )
    };

    persist(nextState);
  }

  function adjustProductStock(productId: string, delta: number) {
    const product = state.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    updateProductStock(productId, product.stock + delta);
  }

  function removeOrder(orderId: string) {
    const nextState = {
      ...state,
      orders: state.orders.filter((order) => order.id !== orderId)
    };

    persist(nextState);
  }

  function placeOrder(
    input: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }
  ): Order | null {
    const product = state.products.find((item) => item.id === input.productId);

    if (!product || product.stock < input.quantity) {
      return null;
    }

    const nextOrder: Order = {
      id: createId("order"),
      createdAt: new Date().toISOString(),
      status: input.status ?? "New",
      ...input
    };

    const nextState = {
      products: state.products.map((item) =>
        item.id === input.productId ? { ...item, stock: item.stock - input.quantity } : item
      ),
      orders: [nextOrder, ...state.orders]
    };

    persist(nextState);

    return nextOrder;
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    const nextState = {
      ...state,
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    };

    persist(nextState);
  }

  const value: StoreContextValue = {
    ...state,
    addProduct,
    deleteProduct,
    updateProductStock,
    adjustProductStock,
    removeOrder,
    placeOrder,
    updateOrderStatus
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}
