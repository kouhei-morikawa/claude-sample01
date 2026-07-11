/**
 * SamplesApp: 学習サンプル一覧ナビゲーター
 *
 * 左サイドバーにサンプル一覧を表示し、
 * 選択したサンプルをメインエリアに描画します。
 */
import { useState } from 'react'

// 各サンプルのコンポーネントをインポート
import HelloWorld        from './01_hello_world'
import PropsDemo         from './02_props'
import StateCounter      from './03_state_counter'
import EventHandling     from './04_event_handling'
import ConditionalRender from './05_conditional_render'
import ListRender        from './06_list_render'
import UseEffectDemo     from './07_use_effect'
import FormsDemo         from './08_forms'
import FetchApiDemo      from './09_fetch_api'
import CustomHooksDemo   from './10_custom_hooks'
import ContextDemo       from './11_context'
import ReducerDemo       from './12_reducer'
import MemoCallbackDemo  from './13_memo_callback'
import RouterDemo        from './14_router'
import TodoAppDemo       from './15_todo_app'
import I18nDemo          from './16_i18n'
import I18nAdvancedDemo  from './17_i18n_advanced'

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
  { id: '01', label: 'Hello World',       level: 1, component: HelloWorld },
  { id: '02', label: 'Props の基本',       level: 1, component: PropsDemo },
  { id: '03', label: 'useState カウンター', level: 2, component: StateCounter },
  { id: '04', label: 'イベントハンドリング', level: 2, component: EventHandling },
  { id: '05', label: '条件分岐レンダリング', level: 2, component: ConditionalRender },
  { id: '06', label: 'リストのレンダリング', level: 2, component: ListRender },
  { id: '07', label: 'useEffect',          level: 2, component: UseEffectDemo },
  { id: '08', label: 'フォーム制御',         level: 3, component: FormsDemo },
  { id: '09', label: 'API フェッチ',          level: 3, component: FetchApiDemo },
  { id: '10', label: 'カスタムフック',         level: 3, component: CustomHooksDemo },
  { id: '11', label: 'Context API',           level: 4, component: ContextDemo },
  { id: '12', label: 'useReducer',            level: 4, component: ReducerDemo },
  { id: '13', label: 'memo / callback / memo', level: 4, component: MemoCallbackDemo },
  { id: '14', label: 'React Router',          level: 4, component: RouterDemo },
  { id: '15', label: 'Todo アプリ（総合演習）', level: 5, component: TodoAppDemo },
  { id: '16', label: '多言語対応（i18n）',     level: 5, component: I18nDemo },
  { id: '17', label: '多言語対応（実践編）',   level: 5, component: I18nAdvancedDemo },
]

// レベルに対応したバッジ背景色（動的なので Tailwind クラスではなくインラインで指定）
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
    <div className="flex h-screen font-sans">
      {/* サイドバー */}
      <aside className="w-64 flex-shrink-0 bg-slate-800 text-slate-200 flex flex-col overflow-y-auto">
        <div className="px-4 pt-5 pb-3 border-b border-slate-700">
          <h1 className="m-0 text-base font-bold text-slate-100">React 学習サンプル</h1>
          <p className="mt-1 mb-0 text-xs text-slate-400">サンプルを選んでください</p>
        </div>
        <nav>
          {SAMPLES.map(sample => (
            <button
              key={sample.id}
              className={[
                'flex items-center gap-2.5 w-full px-4 py-2.5 border-none cursor-pointer text-left text-sm border-l-[3px]',
                sample.id === selectedId
                  ? 'bg-slate-900 text-slate-100 border-l-blue-400'
                  : 'bg-transparent text-slate-300 border-l-transparent',
              ].join(' ')}
              onClick={() => setSelectedId(sample.id)}
            >
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[0.7rem] font-bold text-slate-800 flex-shrink-0"
                style={{ background: LEVEL_COLORS[sample.level] }}
              >
                Lv.{sample.level}
              </span>
              <span className="leading-snug">
                {sample.id}. {sample.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-700">
          <a
            href="LEARNING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 text-xs no-underline hover:underline"
          >
            📖 カリキュラム全体を見る
          </a>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <span
            className="inline-block rounded-full text-sm font-bold text-slate-800 px-2.5 py-1"
            style={{ background: LEVEL_COLORS[selected.level] }}
          >
            Lv.{selected.level}
          </span>
          <h2 className="m-0 text-lg font-bold text-slate-800">
            サンプル {selected.id}：{selected.label}
          </h2>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50">
          {/* 選択されたサンプルを描画 */}
          <SampleComponent />
        </div>
      </main>
    </div>
  )
}

export default SamplesApp
