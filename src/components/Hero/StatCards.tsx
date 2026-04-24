import { stats } from '../../data/content'

export function StatCards() {
  return (
    <div className="hero-stats" id="hero-stats">
      {stats.map((s) => (
        <div key={s.label} className="hero-stats__card">
          <div className="hero-stats__value grad-text">{s.value}</div>
          <div className="hero-stats__label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
