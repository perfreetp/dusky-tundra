<script lang="ts">
  import { materials } from '../lib/stores';

  function setLayer(layer: 'base' | 'flake' | 'coat', key: 'roughness' | 'metalness' | 'intensity', v: number): void {
    materials.update((m) => {
      m[layer][key] = v;
      return m;
    });
  }

  function setBaseColor(v: string): void {
    materials.update((m) => {
      m.baseColor = v;
      return m;
    });
  }

  function setEnv(v: number): void {
    materials.update((m) => {
      m.envIntensity = v;
      return m;
    });
  }
</script>

<div class="panel">
  <fieldset>
    <legend>底色层</legend>
    <label>
      颜色
      <input type="color" value={$materials.baseColor} on:input={(e) => setBaseColor(e.currentTarget.value)} />
    </label>
    <label>
      粗糙度 {$materials.base.roughness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.base.roughness}
        on:input={(e) => setLayer('base', 'roughness', +e.currentTarget.value)}
      />
    </label>
    <label>
      金属度 {$materials.base.metalness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.base.metalness}
        on:input={(e) => setLayer('base', 'metalness', +e.currentTarget.value)}
      />
    </label>
  </fieldset>

  <fieldset>
    <legend>金属漆层(片状颗粒)</legend>
    <label>
      颗粒强度 {$materials.flake.intensity.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.flake.intensity}
        on:input={(e) => setLayer('flake', 'intensity', +e.currentTarget.value)}
      />
    </label>
    <label>
      粗糙度 {$materials.flake.roughness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.flake.roughness}
        on:input={(e) => setLayer('flake', 'roughness', +e.currentTarget.value)}
      />
    </label>
    <label>
      金属度 {$materials.flake.metalness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.flake.metalness}
        on:input={(e) => setLayer('flake', 'metalness', +e.currentTarget.value)}
      />
    </label>
  </fieldset>

  <fieldset>
    <legend>清漆层</legend>
    <label>
      厚度 {$materials.coat.intensity.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.coat.intensity}
        on:input={(e) => setLayer('coat', 'intensity', +e.currentTarget.value)}
      />
    </label>
    <label>
      粗糙度 {$materials.coat.roughness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.coat.roughness}
        on:input={(e) => setLayer('coat', 'roughness', +e.currentTarget.value)}
      />
    </label>
    <label>
      金属度(反射强度){$materials.coat.metalness.toFixed(2)}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$materials.coat.metalness}
        on:input={(e) => setLayer('coat', 'metalness', +e.currentTarget.value)}
      />
    </label>
  </fieldset>

  <fieldset>
    <legend>环境</legend>
    <label>
      环境反射强度 {$materials.envIntensity.toFixed(2)}
      <input
        type="range"
        min="0"
        max="2.5"
        step="0.01"
        value={$materials.envIntensity}
        on:input={(e) => setEnv(+e.currentTarget.value)}
      />
    </label>
  </fieldset>
</div>

<style>
  .panel {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  fieldset {
    border: 1px solid #232b38;
    border-radius: 6px;
    padding: 8px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
  }
  legend {
    color: #8fb8ff;
    font-size: 12px;
    padding: 0 4px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #9aa7ba;
  }
  input[type='color'] {
    width: 100%;
    height: 28px;
    border: 1px solid #2e3a4c;
    border-radius: 4px;
    background: #0d1219;
    padding: 2px;
  }
</style>
