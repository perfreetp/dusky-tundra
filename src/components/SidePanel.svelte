<script lang="ts">
  import { annotations, persons } from '../lib/store';
  import type { SceneManager } from '../lib/engine';
  import type { AnnotationData, PersonData } from '../lib/types';

  export let sm: SceneManager;

  interface Group {
    floor: number;
    faults: AnnotationData[];
    people: PersonData[];
  }

  let groups: Group[] = [];
  $: {
    const map = new Map<number, Group>();
    const ensure = (f: number): Group => {
      let g = map.get(f);
      if (!g) {
        g = { floor: f, faults: [], people: [] };
        map.set(f, g);
      }
      return g;
    };
    for (const a of $annotations) ensure(a.floor).faults.push(a);
    for (const p of $persons) ensure(p.floor).people.push(p);
    groups = [...map.values()].sort((a, b) => b.floor - a.floor);
  }
</script>

<aside class="panel">
  <h2>定位清单</h2>
  {#if groups.length === 0}
    <p class="empty">暂无标注。选择「标注故障点」或「放置被困点」后在场景中点击。</p>
  {/if}
  <div class="groups">
    {#each groups as g (g.floor)}
      <section>
        <h3>{g.floor}F</h3>
        {#each g.faults as a (a.id)}
          <div class="item fault">
            <button class="main" on:click={() => sm.flyToItem(a.id)}>
              <span class="t">⚠ {a.partName}</span>
              <input
                class="note"
                placeholder="备注…"
                value={a.note}
                on:click|stopPropagation
                on:input={(e) => sm.updateNote(a.id, e.currentTarget.value)}
              />
            </button>
            <button class="del" title="删除" on:click={() => sm.removeItem(a.id)}>✕</button>
          </div>
        {/each}
        {#each g.people as p (p.id)}
          <div class="item person">
            <button class="main" on:click={() => sm.flyToItem(p.id)}>
              <span class="t">🧍 {p.label}</span>
              <span class="sub">朝向 {(p.heading * 180 / Math.PI).toFixed(0)}°</span>
            </button>
            <button class="del" title="删除" on:click={() => sm.removeItem(p.id)}>✕</button>
          </div>
        {/each}
      </section>
    {/each}
  </div>
</aside>

<style>
  .panel {
    width: 280px;
    flex-shrink: 0;
    background: rgba(18, 20, 26, 0.92);
    border-left: 1px solid #2a2e3a;
    color: #dfe3ec;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  h2 {
    margin: 0;
    padding: 12px 14px 8px;
    font-size: 14px;
    letter-spacing: 1px;
    border-bottom: 1px solid #2a2e3a;
  }
  .empty {
    padding: 12px 14px;
    font-size: 12px;
    opacity: 0.6;
  }
  .groups {
    overflow-y: auto;
    flex: 1;
    padding: 6px 10px 20px;
  }
  h3 {
    margin: 10px 0 4px;
    font-size: 12px;
    color: #8ab4ff;
    border-bottom: 1px dashed #2a2e3a;
    padding-bottom: 2px;
  }
  .item {
    display: flex;
    align-items: stretch;
    gap: 4px;
    margin: 4px 0;
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #333849;
    background: #1c1f29;
    color: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }
  .main:hover {
    border-color: #8ab4ff;
  }
  .item.person .main {
    border-color: rgba(255, 176, 32, 0.4);
  }
  .t {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub {
    opacity: 0.65;
    font-size: 11px;
  }
  .note {
    background: #12141a;
    border: 1px solid #2a2e3a;
    border-radius: 4px;
    color: #cfd4e0;
    font-size: 11px;
    padding: 3px 6px;
    width: 100%;
    box-sizing: border-box;
  }
  .del {
    border: none;
    background: transparent;
    color: #777;
    cursor: pointer;
    font-size: 12px;
    padding: 0 4px;
  }
  .del:hover {
    color: #ff5a4d;
  }
</style>
