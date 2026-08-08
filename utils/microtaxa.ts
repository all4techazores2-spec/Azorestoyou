// Regras de microtaxa da plataforma, confirmadas com o admin:
// - Venda de produto físico (bebidas, comida, artigos de beleza/loja) -> 0.05€ fixos por artigo vendido
// - Reservas pagas (atividades, hotéis/alojamentos, rentcar)          -> 7% do valor da reserva
// - Venda de imóveis (imobiliárias)                                   -> 0.01% do valor do imóvel
// - Venda de carros em stands                                         -> 0.01% do valor de venda

export type MicrotaxaCategoryId =
  | 'restaurants' | 'shops' | 'beauty' | 'services'
  | 'hotels' | 'cars' | 'activities'
  | 'real_estate' | 'stands';

export const MICROTAXA_CATEGORIES: MicrotaxaCategoryId[] = [
  'restaurants', 'shops', 'beauty', 'services', 'hotels', 'cars', 'activities', 'real_estate', 'stands'
];

const ITEM_FEE_CATEGORIES: MicrotaxaCategoryId[] = ['restaurants', 'shops', 'beauty', 'services'];
const RESERVATION_FEE_CATEGORIES: MicrotaxaCategoryId[] = ['hotels', 'cars', 'activities'];
const SALE_PERCENT_FEE_CATEGORIES: MicrotaxaCategoryId[] = ['real_estate', 'stands'];

export const ITEM_FEE_FLAT = 0.05;
export const RESERVATION_FEE_RATE = 0.07;
export const SALE_PERCENT_FEE_RATE = 0.0001; // 0.01%

export interface MicrotaxaResult {
  revenue: number;
  feeOwed: number;
  feePaidTotal: number;
}

function isAfterCheckpoint(dateStr: string | undefined, checkpoint: Date): boolean {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;
  return d.getTime() > checkpoint.getTime();
}

export function calculateMicrotaxa(business: any, category: MicrotaxaCategoryId): MicrotaxaResult {
  const checkpoint = business?.feePaidUpTo ? new Date(business.feePaidUpTo) : new Date(0);
  const feePaidTotal = (business?.feePaymentHistory || []).reduce(
    (sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0
  );

  if (ITEM_FEE_CATEGORIES.includes(category)) {
    const sales = business?.salesHistory || [];
    let revenue = 0, feeOwed = 0;
    sales.forEach((sale: any) => {
      revenue += parseFloat(sale.total) || 0;
      if (isAfterCheckpoint(sale.date, checkpoint)) {
        const items = sale.items || [];
        const qty = items.reduce((s: number, it: any) => s + (parseFloat(it.quantity) || 0), 0) || 1;
        feeOwed += qty * ITEM_FEE_FLAT;
      }
    });
    return { revenue, feeOwed, feePaidTotal };
  }

  if (RESERVATION_FEE_CATEGORIES.includes(category)) {
    const reservations = business?.reservations || [];
    let revenue = 0, feeOwed = 0;
    reservations.forEach((r: any) => {
      const price = parseFloat(r.totalPrice) || 0;
      revenue += price;
      if (isAfterCheckpoint(r.createdAt || r.date, checkpoint)) {
        feeOwed += price * RESERVATION_FEE_RATE;
      }
    });
    return { revenue, feeOwed, feePaidTotal };
  }

  if (SALE_PERCENT_FEE_CATEGORIES.includes(category)) {
    const sales = business?.salesHistory || [];
    let revenue = 0, feeOwed = 0;
    sales.forEach((sale: any) => {
      const total = parseFloat(sale.total) || 0;
      revenue += total;
      if (isAfterCheckpoint(sale.date, checkpoint)) {
        feeOwed += total * SALE_PERCENT_FEE_RATE;
      }
    });
    return { revenue, feeOwed, feePaidTotal };
  }

  return { revenue: 0, feeOwed: 0, feePaidTotal };
}