import { useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import CatFormModal from '../components/CatFormModal.jsx'
import AddCatFlow from '../components/AddCatFlow.jsx'

function dispatchChanged() {
  window.dispatchEvent(new Event('meowdiaries_data_changed'))
}

function subscribe(cb) {
  window.addEventListener('meowdiaries_data_changed', cb)
  window.addEventListener('meowdiaries_updated', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('meowdiaries_data_changed', cb)
    window.removeEventListener('meowdiaries_updated', cb)
    window.removeEventListener('storage', cb)
  }
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function TinyCat({ cat }) {
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'
  if (cat?.photoUrl) {
    return (
      <div className="h-10 w-10 pixel-border bg-surface flex items-center justify-center overflow-hidden">
        <img src={cat.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  const base =
    variant === 'black'
      ? '#111'
      : variant === 'orange_tabby'
        ? '#d58b3c'
        : variant === 'gray_tabby'
          ? '#9aa0a6'
          : variant === 'calico'
            ? '#f2f2f2'
            : variant === 'white_graycrown'
              ? '#f2f2f2'
              : '#333'
  return (
    <div className="h-10 w-10 pixel-border bg-surface flex items-center justify-center">
      <div className="h-6 w-6" style={{ background: base, position: 'relative', borderRadius: 2 }}>
        {variant === 'white_graycrown' ? (
          <>
            <div style={{ position: 'absolute', left: '16%', top: '-4%', width: '68%', height: '28%', background: '#bebebe' }} />
            <div style={{ position: 'absolute', left: '22%', top: '6%', width: '56%', height: '20%', background: '#cecece' }} />
          </>
        ) : null}
        {variant === 'calico' ? (
          <>
            <div style={{ position: 'absolute', left: '0%', top: '0%', width: '45%', height: '40%', background: '#d58b3c', opacity: 0.9 }} />
            <div style={{ position: 'absolute', right: '0%', bottom: '0%', width: '35%', height: '35%', background: '#222', opacity: 0.9 }} />
          </>
        ) : null}
        <div style={{ position: 'absolute', left: '22%', top: '32%', width: 4, height: 4, background: eye }} />
        <div style={{ position: 'absolute', right: '22%', top: '32%', width: 4, height: 4, background: eye }} />
      </div>
    </div>
  )
}

export default function MyPage({ theme, onThemeChange }) {
  const navigate = useNavigate()
  const upgradeRef = useRef(null)
  const catsRaw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('meowdiaries_cats') || '[]',
    () => localStorage.getItem('meowdiaries_cats') || '[]'
  )
  const cats = useMemo(() => safeParse(catsRaw), [catsRaw])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [addFlowOpen, setAddFlowOpen] = useState(false)

  const isFree = true
  const maxCats = 2
  const canAdd = !isFree || cats.length < maxCats

  function openAdd() {
    if (!canAdd) {
      return
    }
    setAddFlowOpen(true)
  }

  function openEdit(cat) {
    setEditingCat(cat)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingCat(null)
  }

  function saveCat(cat) {
    const next = cats.slice()
    const idx = next.findIndex((c) => String(c.id) === String(cat.id))
    if (idx >= 0) next[idx] = { ...next[idx], ...cat }
    else next.push(cat)
    localStorage.setItem('meowdiaries_cats', JSON.stringify(next))
    dispatchChanged()
    closeModal()
  }

  function deleteCat(catId) {
    const id = String(catId)
    const nextCats = cats.filter((c) => String(c.id) !== id)
    localStorage.setItem('meowdiaries_cats', JSON.stringify(nextCats))

    const logs = safeParse(localStorage.getItem('meowdiaries_routine_logs') || '[]').filter((l) => String(l.catId) !== id)
    localStorage.setItem('meowdiaries_routine_logs', JSON.stringify(logs))

    const entries = safeParse(localStorage.getItem('meowdiaries_diary_entries') || '[]').filter((e) => String(e.catId) !== id)
    localStorage.setItem('meowdiaries_diary_entries', JSON.stringify(entries))

    dispatchChanged()
    closeModal()
  }

  function chooseNook() {
    alert('프리미엄 전용이에요 ✨')
  }

  function goPremium() {
    upgradeRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-4">
      <header className="pixel-card p-4">
        <div className="font-main text-[12px]">마이</div>
        <div className="mt-2 text-sm text-muted">고양이 / 플랜 / 테마</div>
      </header>

      <section className="pixel-card p-4 space-y-3">
        <div className="font-main text-[11px]">내 고양이 관리</div>
        {cats.length === 0 ? (
          <div className="pixel-border bg-surface p-4 text-sm text-text/90">아직 고양이가 없어요. 먼저 추가해볼까요? 🐾</div>
        ) : (
          <div className="space-y-2">
            {cats.map((c) => (
              <div key={c.id} className="pixel-border bg-surface p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <TinyCat cat={c} />
                  <div className="min-w-0">
                    <div className="font-main text-[11px] truncate">{c.name}</div>
                    <div className="text-xs text-muted truncate">{c.descriptionTag || '어떤 아이인지 아직 안 적었어요'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-card"
                >
                  편집
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={openAdd}
          disabled={!canAdd}
          className={[
            'pixel-btn w-full py-3 font-main text-[11px]',
            canAdd ? 'border-accent bg-card' : 'border-border bg-surface text-muted opacity-70'
          ].join(' ')}
          aria-disabled={!canAdd}
        >
          + 고양이 추가
        </button>
        {!canAdd ? (
          <div className="pixel-border bg-surface p-3">
            <div className="text-sm text-text/90">
              무료 플랜에서는 고양이를 2마리까지 추가할 수 있어요 🔒 프리미엄으로 업그레이드하면 무제한으로 추가할 수 있어요 ✨
            </div>
            <button
              type="button"
              onClick={goPremium}
              className="mt-3 pixel-btn w-full py-3 font-main text-[11px] border-accent bg-card"
            >
              프리미엄 시작하기 ₩3,900/월
            </button>
          </div>
        ) : null}
      </section>

      <section className="pixel-card p-4">
        <div className="text-sm">
          <div className="text-muted">Current plan</div>
          <div className="mt-1 font-main text-[12px]">FREE</div>
        </div>
      </section>

      <section className="pixel-card p-4 space-y-3">
        <div className="font-main text-[11px]">테마</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onThemeChange?.('pixel')}
            className={[
              'pixel-btn px-3 py-3 text-[10px] font-main',
              theme === 'pixel' ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
            ].join(' ')}
          >
            PIXEL
          </button>
          <button
            type="button"
            onClick={chooseNook}
            className="pixel-btn px-3 py-3 text-[10px] font-main border-border bg-surface text-muted"
          >
            NOOK 🔒
          </button>
        </div>
      </section>

      <section ref={upgradeRef} className="pixel-card p-4">
        <div className="font-main text-[11px]">업그레이드</div>
        <div className="mt-2 text-sm text-text/90">₩3,900/월</div>
        <div className="mt-2 text-xs text-muted">
          고양이 무제한 / AI 음성 알림 / 테마팩 전체 / 위젯 / 사진 무제한 저장
        </div>
        <button type="button" onClick={() => navigate('/my')} className="mt-3 pixel-btn w-full py-3 font-main text-[11px] border-accent bg-card">
          프리미엄 시작하기
        </button>
      </section>

      <section className="pixel-card p-4">
        <div className="font-main text-[11px]">언어</div>
        <div className="mt-2 text-sm text-muted">KR / EN (준비중)</div>
      </section>

      <CatFormModal
        open={modalOpen}
        mode="edit"
        initialCat={editingCat}
        onCancel={closeModal}
        onSave={saveCat}
        onDelete={deleteCat}
      />

      <AddCatFlow open={addFlowOpen} onClose={() => setAddFlowOpen(false)} />
    </div>
  )
}

