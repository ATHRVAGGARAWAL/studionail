import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
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
  userSize: string | null;
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
  images?: string[];
}

interface StoreContextValue extends StoreState {
  addProduct: (product: NewProductInput) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  adjustProductStock: (productId: string, delta: number) => void;
  removeOrder: (orderId: string) => void;
  placeOrder: (input: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  saveUserSize: (size: string | null) => void;
  syncToRemote: () => Promise<void>;
  isSyncing: boolean;
}

const STORAGE_KEY = "studionail-store-v2";

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

function normalizeOrders(orders: Order[], products: Product[]) {
  return orders.map((order) => ({
    ...order,
    unitPrice:
      typeof order.unitPrice === "number"
        ? order.unitPrice
        : products.find((product) => product.id === order.productId)?.price ?? 0
  }));
}

function loadInitialState(): StoreState {
  const fallbackState: StoreState = {
    products: normalizeProducts(seedProducts),
    orders: seedOrders,
    userSize: null
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
      orders: normalizeOrders(Array.isArray(parsed.orders) ? parsed.orders : seedOrders, normalizeProducts(parsed.products ?? seedProducts)),
      userSize: typeof parsed.userSize === "string" ? parsed.userSize : null
    };
  } catch {
    return fallbackState;
  }
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => loadInitialState());
  const [isSyncing, setIsSyncing] = useState(false);

  // Initial load from Supabase
  useEffect(() => {
    async function fetchData() {
      const { data: remoteProducts } = await supabase.from('products').select('*');
      if (remoteProducts && remoteProducts.length > 0) {
        setState((s) => persist({
          ...s,
          products: remoteProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock,
            badge: p.badge,
            category: p.category,
            shape: p.shape,
            finish: p.finish,
            description: p.description,
            image: p.image,
            images: p.images || [],
            reviewCount: p.review_count || 0
          }))
        }, false));
      }
    }
    fetchData();
  }, []);

  function persist(nextState: StoreState, writeToLocal = true) {
    const normalizedState = {
      ...nextState,
      products: normalizeProducts(nextState.products)
    };

    setState(normalizedState);

    if (writeToLocal && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
    }
    return normalizedState;
  }

  async function syncToRemote() {
    setIsSyncing(true);
    try {
      const productUpserts = state.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        badge: p.badge,
        category: p.category,
        shape: p.shape,
        finish: p.finish,
        description: p.description,
        image: p.images?.[0] || p.image, // ensure first image
        images: p.images || [],
        review_count: p.reviewCount
      }));
      await supabase.from('products').upsert(productUpserts, { onConflict: 'id' });
      alert('Changes successfully synced to live website!');
    } catch (err) {
      console.error(err);
      alert('Sync failed - see console log.');
    } finally {
      setIsSyncing(false);
    }
  }

  function addProduct(product: NewProductInput & { images?: string[] }) {
    const nextProduct: Product = {
      id: createId("product"),
      reviewCount: product.reviewCount ?? 0,
      images: product.images || [],
      ...product,
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
    supabase.from('products').delete().eq('id', productId).then(); // async background delete
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
      ...state,
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

  function saveUserSize(size: string | null) {
    const nextState = {
      ...state,
      userSize: size
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
    updateOrderStatus,
    saveUserSize,
    syncToRemote,
    isSyncing
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
