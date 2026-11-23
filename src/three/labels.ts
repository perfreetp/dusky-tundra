import { Text } from 'troika-three-text';

/** troika-three-text 音箱标签：屏幕空间近似固定大小由 fillOpacity/scale 控制 */
export function createSpeakerLabel(text: string): Text {
  const label = new Text();
  label.text = text;
  label.fontSize = 1.6;
  label.color = 0xf2f5fa;
  label.outlineColor = 0x111418;
  label.outlineWidth = 0.08;
  label.anchorX = 'center';
  label.anchorY = 'bottom';
  label.position.y = 2.4;
  label.renderOrder = 10;
  return label;
}

export function updateLabelText(label: Text, text: string): void {
  label.text = text;
  label.sync();
}
