export interface Client {
  _id: string;
  email: string;
  name: string;
  dni?: number;
  points: number;
  createdAt: string;
}
