export interface CustomRequest {
  id: string;
  fileName: string;
  material: string;
  color: string;
  dimensions: string;
  notes: string;
  status: string;
  priceEstimate?: number;
}