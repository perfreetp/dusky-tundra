declare module 'troika-three-text' {
  import { Mesh, MeshBasicMaterial, Box3 } from 'three';

  export interface TextAnchor {
    anchorX?: 'left' | 'center' | 'right';
    anchorY?: 'top' | 'middle' | 'bottom';
  }

  export class Text extends Mesh {
    text: string;
    fontSize: number;
    color: number | string;
    outlineColor: number | string;
    outlineWidth: number | string;
    anchorX: TextAnchor['anchorX'];
    anchorY: TextAnchor['anchorY'];
    material: MeshBasicMaterial;
    sync(callback?: () => void): void;
    /** 返回文字包围盒（troika 在 sync 后填充） */
    textRenderInfo?: {
      blockBounds: [number, number, number, number];
      visualBounds: [number, number, number, number];
    };
    getLocalBoundingBox?: () => Box3;
    dispose(): void;
  }
}
