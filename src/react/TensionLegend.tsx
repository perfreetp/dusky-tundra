import { tensionLutCssGradient } from '../three/materials/tensionLut';

export function TensionLegend() {
  return (
    <section className="panel">
      <h2>绳体张力</h2>
      <div className="legend-bar" style={{ background: tensionLutCssGradient() }} />
      <div className="legend-scale">
        <span>低</span>
        <span>归一化分段张力</span>
        <span>高</span>
      </div>
    </section>
  );
}
