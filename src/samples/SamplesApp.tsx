/**
 * SamplesApp: 学習サンプル一覧ナビゲーター
 *
 * 左サイドバーにサンプル一覧を表示し、
 * 選択したサンプルをメインエリアに描画します。
 */
import { useState } from 'react'

// 各サンプルのコンポーネントをインポート
import HelloWorld       from './01_hello_world'
import PropsDemo        from './02_props'
import StateCounter     from './03_state_counter'
import EventHandling    from './04_event_handling'
import ConditionalRender from './05_conditional_render'
import ListRender       from './06_list_render'

// -------------------------------------------------
// サンプル一覧の定義
// -------------------------------------------------
type Sample = {
  id: string
  label: string
  level: 1 | 2 | 3 | 4 | 5
  component: React.ComponentType
}

const SAMPLES: Sample[] = [
  { id: '01', label: 'Hello World',      level: 1, component: HelloWorld },
  { id: '02', label: 'Props の基本',      level: 1, component: PropsDemo },
  { id: '03', label: 'useState カウンター', level: 2, component: StateCounter },
  { id: '04', label: 'イベントハンドリング', level: 2, component: EventHandling },
  { id: '05', label: '条件分岐レンダリング', level: 2, component: ConditionalRender },
  { id: '06', label: 'リストのレンダリング', level: 2, component: ListRender },
]

const LEVEL_COLORS: Record<number, string> = {
  1: '#86efac', // 緑
  2: '#93c5fd', // 青
  3: '#fde68a', // 黄
  4: '#f9a8d4', // ピンク
  5: '#c4b5fd', // 紫
}

// -------------------------------------------------
// SamplesApp コンポーネント
// -------------------------------------------------
function SamplesApp() {
  const [selectedId, setSelectedId] = useState<string>(SAMPLES[0].id)

  const selected = SAMPLES.find(s => s.id === selectedId)!
  const SampleComponent = selected.component

  return (
    <div style={styles.root}>
      {/* サイドバー */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.sidebarTitle}>React 学習サンプル</h1>
          <p style={styles.sidebarSubtitle}>サンプルを選んでください</p>
        </div>
        <nav>
          {SAMPLES.map(sample => (
            <button
              key={sample.id}
              style={{
                ...styles.navItem,
                ...(sample.id === selectedId ? styles.navItemActive : {}),
              }}
              onClick={() => setSelectedId(sample.id)}
            >
              <span
                style={{
                  ...styles.levelBadge,
                  background: LEVEL_COLORS[sample.level],
                }}
              >
                Lv.{sample.level}
              </span>
              <span style={styles.navLabel}>
                {sample.id}. {sample.label}
              </span>
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <a
            href="LEARNING.md"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            📖 カリキュラム全体を見る
          </a>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main style={styles.main}>
        <div style={styles.mainHeader}>
          <span
            style={{
              ...styles.levelBadge,
              background: LEVEL_COLORS[selected.level],
              fontSize: '0.85rem',
              padding: '4px 10px',
            }}
          >
            Lv.{selected.level}
          </span>
          <h2 style={styles.mainTitle}>
            サンプル {selected.id}：{selected.label}
          </h2>
        </div>
        <div style={styles.sampleArea}>
          {/* 選択されたサンプルを描画 */}
          <SampleComponent />
        </div>
      </main>
    </div>
  )
}

// -------------------------------------------------
// スタイル
// -------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    background: '#1e293b',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  sidebarHeader: {
    padding: '20px 16px 12px',
    borderBottom: '1px solid #334155',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  sidebarSubtitle: {
    margin: '4px 0 0',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.875rem',
    borderLeft: '3px solid transparent',
  },
  navItemActive: {
    background: '#0f172a',
    color: '#f1f5f9',
    borderLeftColor: '#60a5fa',
  },
  navLabel: {
    lineHeight: '1.3',
  },
  levelBadge: {
    display: 'inline-block',
    padding: '2px 7px',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#1e293b',
    flexShrink: 0,
  },
  sidebarFooter: {
    marginTop: 'auto',
    padding: '16px',
    borderTop: '1px solid #334155',
  },
  link: {
    color: '#93c5fd',
    fontSize: '0.8rem',
    textDecoration: 'none',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
    flexShrink: 0,
  },
  mainTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sampleArea: {
    flex: 1,
    overflow: 'auto',
    background: '#f8fafc',
  },
}

export default SamplesApp
