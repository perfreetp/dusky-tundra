import { describe, expect, it } from 'vitest';
import {
  createDefaultSceneConfig,
  createDefaultRopes,
  createDefaultFloors,
  GOVERNOR_LOOP_LENGTH,
} from '../../config/defaultSceneConfig';
import {
  buildDocument,
  parseDocument,
  serializeDocument,
} from './poseSerializer';
import { validateDocument, ContractError } from './poseContract';

describe('姿态 JSON 契约 round-trip', () => {
  const scene = createDefaultSceneConfig();
  const ropes = createDefaultRopes(scene);
  const floors = createDefaultFloors(scene);

  it('参数模式文档序列化后可无损解析', () => {
    const doc = buildDocument({
      scene,
      ropes,
      floors,
      runtime: {
        selectedFloorId: 'F8',
        loadOverride: null,
        clipHeight: 12.4,
        ropeOpacity: 0.55,
        lodLevel: 'mid',
        showSectionMarkers: true,
        showTensionColor: true,
        playing: false,
      },
      loopLengths: { 'governor-loop': GOVERNOR_LOOP_LENGTH },
    });
    const text = serializeDocument(doc);
    const parsed = parseDocument(text);

    expect(parsed.contract).toBe('elevator-rope-pose');
    expect(parsed.version).toBe(1);
    expect(parsed.ropes).toHaveLength(ropes.length);
    expect(parsed.floors).toHaveLength(floors.length);
    expect(parsed.runtime.selectedFloorId).toBe('F8');
    expect(parsed.runtime.clipHeight).toBe(12.4);
    expect(parsed.scene.sheaves[0]!.pitchRadius).toBe(scene.sheaves[0]!.pitchRadius);
  });

  it('非法契约被拒绝', () => {
    expect(() => validateDocument({ contract: 'wrong', version: 1 })).toThrow(ContractError);
    expect(() => validateDocument(null)).toThrow(ContractError);
    expect(() =>
      validateDocument({ contract: 'elevator-rope-pose', version: 1, scene: {}, ropes: [] }),
    ).toThrow(ContractError);
  });

  it('高版本文件被拒绝（前向不兼容保护）', () => {
    const doc = buildDocument({
      scene,
      ropes,
      floors,
      runtime: {
        selectedFloorId: 'F1',
        loadOverride: null,
        clipHeight: null,
        ropeOpacity: 0.5,
        lodLevel: 'mid',
        showSectionMarkers: true,
        showTensionColor: true,
        playing: false,
      },
    });
    const future = { ...doc, version: 99 };
    expect(() => validateDocument(future)).toThrow(ContractError);
  });
});
