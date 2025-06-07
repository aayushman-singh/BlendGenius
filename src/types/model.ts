export interface Model3D {
  id: string;
  name: string;
  description: string;
  geometry: string;
  color: string;
  createdAt: Date;
  thumbnail?: string;
}

export interface ModelGenerationParams {
  shape: string;
  size: number;
  color: string;
  complexity: number;
  style: string;
}
