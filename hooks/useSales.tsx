import { useCallback, useEffect, useState } from 'react';
import api, { ASSETS_BASE_URL } from '../constants/api';
import { useAuthContext } from '../context/AuthContext';

export interface PurchaseItem {
  id: string;
  orderNumber: string;
  deliveryType: string;
  status: string;
  elementsCount: number;
  image: string | null;
  description: string;
  date: string;
}

export interface Installment {
  id: number;
  financing_contract_id: number;
  due_date: string;
  amount: string;
  number: number;
  is_inicial: boolean;
  amount_penalty: string;
  amount_default_rate: string;
  installment_status_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status?: {
    id: number;
    code: string;
    name: string;
  };
  payments?: any[];
}

export interface SaleDetail {
  id: string;
  saleCode: string;
  status: string;
  sale_items: any[];
  financing_contract?: {
    total_amount_pay: string;
    installments: Installment[];
    financing_plan: {
      cuotas: number;
    };
  };
  customer: any;
  total: number;
  deliveryType: string;
  sale_date: string;
  currency: {
    id: number;
    code: string;
    name?: string;
    symbol: string;
  };
  sale_amount: string | null;
  outstanding_amount?: string | null;
  productImage: string | null;
}

export function useSales() {
  const { user } = useAuthContext();
  const buildImageUrl = (img?: string | null) => {
    if (!img) return null;
    if (/^https?:\/\//i.test(img)) return img; 
    if (/^\/\//.test(img)) return `https:${img}`; 
    return `${ASSETS_BASE_URL}${img}`; 
  };
  const [sales, setSales] = useState<PurchaseItem[]>([]);
  const [saleDetail, setSaleDetail] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSales = useCallback(async () => {
    if (!user?.customers_id) {
      setError('ID de usuario no disponible.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/${user.customers_id}/purchases`);

      const processedSales = response.data.data.purchases.map((purchase: any) => {
        const firstItem = purchase.items[0];
        const firstItemImage = firstItem?.product_image;


        const imageUrl = buildImageUrl(firstItemImage);
        const description = firstItem?.product_name || 'Sin nombre';
        const date = new Date(purchase.created_at).toLocaleDateString('es-ES', { month: 'long', day: '2-digit' });

        return {
          id: String(purchase.sale_id),
          orderNumber: purchase.sale_code,
          deliveryType: 'Entrega estándar',
          status: purchase.status.name,
          elementsCount: purchase.items.length,
          image: imageUrl,
          description: description,
          date: date,
        };
      });

      setSales(processedSales);
    } catch (err: any) {
      setError('Error al cargar las compras del usuario.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSaleById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/sales/view", { sale_id: Number(id) });

      const rawData = response.data;
      const rawSale = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!rawSale) {
        throw new Error('No se encontraron los datos de la venta.');
      }

      const firstItem = rawSale.sale_items?.[0];
      const productImage = buildImageUrl(firstItem?.product?.image_file);

      const saleStatusName = rawSale.sale_status?.name ?? 'Estado Desconocido';
      const totalAmountPay = rawSale.financing_contract?.total_amount_pay;
      const calculatedTotal = totalAmountPay ? parseFloat(totalAmountPay) : parseFloat(rawSale.sale_amount || firstItem?.total_price || '0');

      const processedSaleDetail: SaleDetail = {
        id: String(rawSale.id),
        saleCode: rawSale.sale_code,
        status: saleStatusName,
        sale_items: rawSale.sale_items,
        financing_contract: rawSale.financing_contract,
        customer: rawSale.customer,
        total: calculatedTotal,
        deliveryType: 'Entrega estándar',
        sale_date: rawSale.sale_date,
        currency: rawSale.currency,
        sale_amount: rawSale.sale_amount,
        outstanding_amount: rawSale.outstanding_amount ?? null,
        productImage: productImage,
      };

      setSaleDetail(processedSaleDetail);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los detalles de la venta.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInstallmentById = useCallback(async (installmentId: number) => {
    try {
      const response = await api.post('/installments/view', { installment_id: installmentId });
      return response.data;
    } catch (error) {
      console.error('Error al cargar detalles de la cuota:', error);
      throw new Error('No se pudieron cargar los detalles de la cuota.');
    }
  }, []);

  useEffect(() => {
    fetchUserSales();
  }, [fetchUserSales]);

  return {
    sales,
    saleDetail,
    loading,
    error,
    fetchUserSales,
    fetchSaleById,
    fetchInstallmentById,
  };
}