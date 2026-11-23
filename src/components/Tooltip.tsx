interface TooltipProps {
  x: number;
  y: number;
  lines: string[];
  tops?: Array<{ name: string; spl: number; dominant: boolean }>;
}

export default function Tooltip(props: TooltipProps) {
  return (
    <div
      class="tooltip"
      style={{
        left: `${props.x + 14}px`,
        top: `${props.y + 14}px`,
      }}
    >
      {props.lines.map((line) => (
        <div class="tooltip-line">{line}</div>
      ))}
      {props.tops && props.tops.length > 0 && (
        <div class="tooltip-tops">
          <div class="tooltip-subtitle">主要贡献音箱</div>
          {props.tops.map((t) => (
            <div class="tooltip-top">
              <span class={t.dominant ? 'dominant' : ''}>{t.dominant ? '★ ' : ''}{t.name}</span>
              <span>{t.spl.toFixed(1)} dB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
