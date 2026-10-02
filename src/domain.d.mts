import type { Product, Line } from "./core";
export function packStatus(
  products: Product[],
  cart: Line[],
  trip: string,
  extra: number,
): {
  required: string[];
  missing: string[];
  weight: number;
  total: number;
  limit: number;
  over: boolean;
  cost: number;
};
