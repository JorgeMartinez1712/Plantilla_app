import { useCallback, useEffect, useState } from 'react';
import api from '../constants/api';

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  financing: boolean;
  description: string | null;
  originalPrice: number;
  installments: string;
}

export interface Category {
  id: string;
  name: string;
  code?: string;
  description?: string | null;
}

const cleanImageUrl = (url: string | null): string | null => {
  if (!url) {
    return null;
  }
  return url.replace(/\\/g, '');
};

export function useHome() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brand');
      const processedBrands = response.data
        .map((brand: any) => ({
          ...brand,
          logo: cleanImageUrl(brand.logo),
        }))
        .filter((brand: Brand) => brand.logo);
      setBrands(processedBrands);
    } catch (err: any) {
      console.error('Error al cargar las marcas:', err);
      setError('No se pudieron cargar las marcas');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/product');
      const processedProducts = response.data.map((product: any) => {
        const cleanedImageFile = cleanImageUrl(product.image_file);
        const imageUrl = cleanedImageFile ? cleanedImageFile : null;
        return {
          id: String(product.id),
          name: product.name,
          price: parseFloat(product.base_price),
          image: imageUrl,
          financing: product.is_service === false,
          description: product.description || product.model,
          originalPrice: parseFloat(product.base_price),
          installments: '8 Cuotas',
        };
      });
      setProducts(processedProducts);
    } catch (err: any) {
      console.error('Error al cargar los productos:', err);
      setError('No se pudieron cargar los productos');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      const processed = response.data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        code: c.code,
        description: c.description,
      }));
      setCategories(processed);
    } catch (err: any) {
      console.error('Error al cargar las categorías:', err);
      setError('No se pudieron cargar las categorías');
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.allSettled([fetchBrands(), fetchProducts(), fetchCategories()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    brands,
    products,
    categories,
    loading,
    error,
    fetchData,
  };
}