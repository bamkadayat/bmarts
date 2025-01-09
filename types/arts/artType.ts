export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  publicId?: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  createdAt: string; 
  updatedAt: string; 
  publicId: string;
  date: string;
}

export type AddProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface EditProduct {
  id: string;
  product: Partial<Product>;
}

export interface DeleteProduct {
  id: string;
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data?: Product[] | Product | null;
}

// State interface for Redux slice
export interface ArtsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
