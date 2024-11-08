export interface WindowProps {
  id: number;
  path: string | null;
}

export interface WindowContainerProps {
  map: Map<number, string | null>;
  id: number;
  isVertical: boolean;
}
