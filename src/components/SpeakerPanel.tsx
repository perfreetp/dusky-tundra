import { removeSpeaker, selectedSpeaker, updateSpeaker } from '../state/store';

interface FieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onInput: (v: number) => void;
}

function NumberField(props: FieldProps) {
  return (
    <label class="field">
      <span class="field-label">
        {props.label}
        {props.unit ? <em>{props.unit}</em> : null}
      </span>
      <span class="field-control">
        <input
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onInput={(e) => props.onInput(Number((e.target as HTMLInputElement).value))}
        />
        <input
          class="num"
          type="number"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onInput={(e) => props.onInput(Number((e.target as HTMLInputElement).value))}
        />
      </span>
    </label>
  );
}

export default function SpeakerPanel() {
  const sp = selectedSpeaker();
  return (
    <div class="panel">
      <div class="panel-title">音箱参数</div>
      {!sp ? (
        <div class="empty-hint">在场景中点击音箱，或先添加一个音箱</div>
      ) : (
        <>
          <label class="field">
            <span class="field-label">名称</span>
            <input
              class="text-input"
              type="text"
              value={sp.name}
              onInput={(e) => updateSpeaker(sp.id, { name: (e.target as HTMLInputElement).value })}
            />
          </label>
          <NumberField label="安装高度" unit="m" value={sp.y} min={1} max={80} step={0.5}
            onInput={(v) => updateSpeaker(sp.id, { y: v })} />
          <NumberField label="位置 X" unit="m" value={sp.x} min={-150} max={150} step={0.5}
            onInput={(v) => updateSpeaker(sp.id, { x: v })} />
          <NumberField label="位置 Z" unit="m" value={sp.z} min={-150} max={150} step={0.5}
            onInput={(v) => updateSpeaker(sp.id, { z: v })} />
          <NumberField label="方位角 yaw" unit="°" value={sp.yaw} min={-180} max={180} step={1}
            onInput={(v) => updateSpeaker(sp.id, { yaw: v })} />
          <NumberField label="俯角 tilt" unit="°" value={sp.tilt} min={-30} max={90} step={1}
            onInput={(v) => updateSpeaker(sp.id, { tilt: v })} />
          <NumberField label="覆盖半角（锥边 -6dB）" unit="°" value={sp.halfAngle} min={5} max={80} step={1}
            onInput={(v) => updateSpeaker(sp.id, { halfAngle: v })} />
          <NumberField label="额定声压 SPL₀" unit="dB" value={sp.spl} min={70} max={140} step={1}
            onInput={(v) => updateSpeaker(sp.id, { spl: v })} />
          <NumberField label="覆盖距离" unit="m" value={sp.range} min={10} max={200} step={1}
            onInput={(v) => updateSpeaker(sp.id, { range: v })} />
          <button class="btn danger" onClick={() => removeSpeaker(sp.id)}>
            删除该音箱
          </button>
        </>
      )}
    </div>
  );
}
