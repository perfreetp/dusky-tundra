// 底部时间轴:播放/暂停、拖动回看、倍速
interface Props {
  time: number
  duration: number
  playing: boolean
  speed: number
  onTime: (t: number) => void
  onPlayPause: () => void
  onSpeed: (s: number) => void
}

export default function Timeline(p: Props) {
  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = (s % 60).toFixed(1)
    return m > 0 ? `${m}分${sec}秒` : `${sec}秒`
  }
  return (
    <div className="timeline">
      <button className="play" onClick={p.onPlayPause} disabled={p.duration <= 0}>
        {p.playing ? '⏸ 暂停' : '▶ 播放'}
      </button>
      <input
        type="range"
        min={0}
        max={Math.max(0.1, p.duration)}
        step={0.1}
        value={Math.min(p.time, p.duration)}
        onChange={(e) => p.onTime(Number(e.target.value))}
        disabled={p.duration <= 0}
      />
      <span className="clock">{fmt(p.time)} / {fmt(p.duration)}</span>
      <select value={p.speed} onChange={(e) => p.onSpeed(Number(e.target.value))}>
        <option value={0.5}>0.5×</option>
        <option value={1}>1×</option>
        <option value={2}>2×</option>
        <option value={4}>4×</option>
      </select>
    </div>
  )
}
