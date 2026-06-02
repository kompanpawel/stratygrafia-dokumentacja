export type LayerTypeName = string;

export interface StratigraphyLayer {
  id: string;
  number: number;
  type: LayerTypeName;
  percentage: number;
  fillFromRight: boolean;
  customName?: string;
  thickness?: string;
  chronologicalPhase?: string;
  dating?: string;
}
