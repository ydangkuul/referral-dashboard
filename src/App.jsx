import { useMemo, useRef, useState } from 'react'
import {
  Signal, Wifi, BatteryFull, Landmark, UserRound, Info, CalendarCheck,
  ChevronDown, Clock3, House, UsersRound, Goal as GoalIcon,
  CircleCheck, X, Play, Pause,
} from 'lucide-react'

// Brand bank icon (from design handoff) — recolored to currentColor so it
// tracks the theme token instead of the hardcoded #0D3C7D in the source file.
function BankIcon({ width = 28, height = 25, 'aria-label': ariaLabel }) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"
      role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}>
      <g clipPath="url(#bank-icon-clip)">
        <path d="M26.752 22.8496C27.249 22.8496 27.6523 23.2529 27.6523 23.75C27.6523 24.2471 27.249 24.6504 26.752 24.6504H1.25195C0.754897 24.6504 0.351562 24.2471 0.351562 23.75C0.351562 23.2529 0.754897 22.8496 1.25195 22.8496H26.752Z" fill="currentColor" />
        <path d="M4.60156 19.25V11.375C4.60156 10.8779 5.0049 10.4746 5.50195 10.4746C5.99901 10.4746 6.40234 10.8779 6.40234 11.375V19.25C6.40234 19.7471 5.99901 20.1504 5.50195 20.1504C5.0049 20.1504 4.60156 19.7471 4.60156 19.25Z" fill="currentColor" />
        <path d="M10.2656 19.25V11.375C10.2656 10.8779 10.669 10.4746 11.166 10.4746C11.6631 10.4746 12.0664 10.8779 12.0664 11.375V19.25C12.0664 19.7471 11.6631 20.1504 11.166 20.1504C10.669 20.1504 10.2656 19.7471 10.2656 19.25Z" fill="currentColor" />
        <path d="M15.9336 19.25V11.375C15.9336 10.8779 16.3369 10.4746 16.834 10.4746C17.331 10.4746 17.7344 10.8779 17.7344 11.375V19.25C17.7344 19.7471 17.331 20.1504 16.834 20.1504C16.3369 20.1504 15.9336 19.7471 15.9336 19.25Z" fill="currentColor" />
        <path d="M21.6016 19.25V11.375C21.6016 10.8779 22.0049 10.4746 22.502 10.4746C22.999 10.4746 23.4023 10.8779 23.4023 11.375V19.25C23.4023 19.7471 22.999 20.1504 22.502 20.1504C22.0049 20.1504 21.6016 19.7471 21.6016 19.25Z" fill="currentColor" />
        <path d="M13.6947 0.402394C13.9237 0.320256 14.1783 0.334018 14.3988 0.44341L25.7318 6.06841C26.106 6.25414 26.3036 6.6734 26.2084 7.08013C26.113 7.48688 25.7502 7.77529 25.3324 7.77544H2.66543C2.24753 7.77544 1.88486 7.48699 1.78945 7.08013C1.69422 6.67339 1.89083 6.25415 2.26504 6.06841L13.599 0.44341L13.6947 0.402394ZM6.50527 5.97466H21.4926L13.9984 2.25493L6.50527 5.97466Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="bank-icon-clip">
          <rect width="28" height="25" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

// Not exported by the pinned lucide-react version — reproduced inline from
// the exact path captured in the reference site's rendered SVG.
function CircleStar({ size = 24, strokeWidth = 1.7 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
    </svg>
  )
}

const MIN_GOAL = 5
const MAX_GOAL = 100
const STEP_GOAL = 5

// Baseline daily-action mix at the reference goal (30M / 12 months).
// Scaled proportionally for other goal/timeline combinations — the
// exact original formula wasn't recoverable from the minified bundle,
// this is a reasonable stand-in documented here for whoever tunes it next.
const BASE_GOAL = 30
const BASE_MONTHS = 12
const BASE_ACTIONS = { invites: 5, remind: 3, ppp: 3, sharp: 2 }
const BASE_NETWORK = { merchants: 40, influencers: 60 }
const ACTION_MULTIPLIER = 2

const GUIDE_TOPICS = {
  points: {
    title: 'Available points guide',
    steps: [
      { label: 'STEP 1', heading: 'Earn points every day', number: '+50 pts', detail: 'Invites, reminders, PPP and SHARP actions all add up.' },
      { label: 'STEP 2', heading: 'Points convert to VND', number: '100 pts', detail: '= 10,000 VND, redeemable any time from your wallet.' },
      { label: 'STEP 3', heading: 'Track your lifetime total', number: '1,245 pts', detail: 'Lifetime points never expire, even after you redeem.' },
    ],
  },
  goal: {
    title: 'Monthly income goal guide',
    steps: [
      { label: 'STEP 1', heading: 'Set a target', number: '30M VND', detail: 'Pick an amount and a timeline that fits your pace.' },
      { label: 'STEP 2', heading: 'We estimate your daily actions', number: '13 actions', detail: 'Invites, reminders, PPP and SHARP needed per day.' },
      { label: 'STEP 3', heading: 'Adjust any time', number: '6–18 mo', detail: 'Move the timeline to see the plan recalculate live.' },
    ],
  },
  activities: {
    title: 'Activities / day guide',
    steps: [
      { label: 'STEP 1', heading: 'Four action types', number: '4 types', detail: 'Invites, Remind, PPP and SHARP each earn points differently.' },
      { label: 'STEP 2', heading: 'Scales with your goal', number: '13 actions', detail: 'A bigger goal or shorter timeline raises the daily target.' },
      { label: 'STEP 3', heading: 'Spread them through the day', number: 'Daily', detail: 'Consistent small actions beat one big push at the end.' },
    ],
  },
}

function formatVnd(n) {
  return n.toLocaleString('en-US')
}

function InfoBubble({ variant, title, children, onClose, onOpenGuide }) {
  return (
    <>
      <button className="dismiss-tip" aria-label="Dismiss" onClick={onClose} />
      <div className={`bubble ${variant}`} role="dialog" aria-modal="false">
        <button className="tip-close" aria-label="Close" onClick={onClose}>
          <X size={16} />
        </button>
        <strong>{title}</strong>
        <p>{children}</p>
        <button className="video-link" onClick={onOpenGuide}>
          <Play size={14} /> Watch guide
        </button>
      </div>
    </>
  )
}

function GuideDialog({ topic, onClose }) {
  const data = GUIDE_TOPICS[topic]
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  const step = data.steps[stepIndex]
  const totalSeconds = 8
  const elapsed = Math.round((progress / 100) * totalSeconds)

  function togglePlay() {
    if (playing) {
      clearInterval(timerRef.current)
      setPlaying(false)
      return
    }
    setPlaying(true)
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (totalSeconds * 4)
        if (next >= 100) {
          clearInterval(timerRef.current)
          setPlaying(false)
          setStepIndex((i) => (i + 1 < data.steps.length ? i + 1 : i))
          return 0
        }
        return next
      })
    }, 250)
  }

  return (
    <>
      <div data-slot="dialog-overlay" onClick={onClose} />
      <div className="video-dialog" role="dialog" aria-modal="true" aria-labelledby="guide-title">
        <h2 id="guide-title">{data.title}</h2>
        <div className="mock-stage">
          <span className="mock-label">{step.label}</span>
          <span className="mock-step">{stepIndex + 1} / {data.steps.length}</span>
          <h3>{step.heading}</h3>
          <div className="mock-number">{step.number}</div>
          <div className="mock-track">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p>{step.detail}</p>
          <div className="mock-controls">
            <button className="mock-play" onClick={togglePlay}>
              {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : 'Play'}
            </button>
            <input
              type="range" min="0" max="100" value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              aria-label="Guide progress"
            />
            <span className="mock-time">{elapsed}s / {totalSeconds}s</span>
          </div>
          <p className="mock-detail sr-only">Simulated tutorial with playback and progress controls.</p>
        </div>
        <button className="close-video" onClick={onClose}>Close guide</button>
      </div>
    </>
  )
}

export default function App() {
  const fileInputRef = useRef(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [pointsInfoOpen, setPointsInfoOpen] = useState(false)
  const [activitiesInfoOpen, setActivitiesInfoOpen] = useState(false)
  const [goalInfoOpen, setGoalInfoOpen] = useState(false)
  const [guideTopic, setGuideTopic] = useState(null)
  const [goalAmount, setGoalAmount] = useState(30)
  const [months, setMonths] = useState(12)
  const [selectedNav, setSelectedNav] = useState('Home')
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [activitiesOpen, setActivitiesOpen] = useState(false)
  const [networkStatsOpen, setNetworkStatsOpen] = useState(true)
  const [saved, setSaved] = useState(false)

  const sliderPct = ((goalAmount - MIN_GOAL) / (MAX_GOAL - MIN_GOAL)) * 100

  // A bigger goal needs more daily actions; a shorter timeline compresses
  // the same goal into fewer months, so it also needs more per day.
  const LEVEL = 2 / 3
  const scale = (goalAmount / BASE_GOAL) * (BASE_MONTHS / months) * LEVEL

  const actions = useMemo(() => {
    const round = (n) => Math.max(1, Math.round(n * scale))
    const a = {
      invites: round(BASE_ACTIONS.invites) * ACTION_MULTIPLIER,
      remind: round(BASE_ACTIONS.remind) * ACTION_MULTIPLIER,
      ppp: round(BASE_ACTIONS.ppp) * ACTION_MULTIPLIER,
      sharp: round(BASE_ACTIONS.sharp) * ACTION_MULTIPLIER,
    }
    return { ...a, total: a.invites + a.remind + a.ppp + a.sharp }
  }, [scale])

  const networkReach = useMemo(() => {
    const round = (n) => Math.max(1, Math.round(n * scale))
    return { merchants: round(BASE_NETWORK.merchants), influencers: round(BASE_NETWORK.influencers) }
  }, [scale])

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (file) setAvatarUrl(URL.createObjectURL(file))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <main className="stage">
      <div className="viewport" style={{ width: 390, height: 844 }}>
        <section className="phone" style={{ transform: 'scale(1)', height: 844 }} aria-label="Referral dashboard prototype">
          <div className="status-bar">
            <span>9:41</span>
            <div>
              <Signal size={17} />
              <Wifi size={18} />
              <BatteryFull size={25} />
            </div>
          </div>

          <div className="dashboard-scroll" tabIndex={0} aria-label="Dashboard content">
            <div className="dashboard-content">
              <div className="app-header">
                <BankIcon width={27} height={24} aria-label="VietPay" />
              </div>

              <section className="profile-card card">
                <div className="profile-row">
                  <button
                    className="avatar profile-avatar"
                    aria-label="Change profile photo"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" />
                    ) : (
                      <UserRound size={30} className="default-profile-icon" aria-hidden="true" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Choose profile photo"
                    tabIndex={-1}
                    onChange={handleAvatarChange}
                  />
                  <strong>Hi, Y Dang</strong>
                  <span className="tier">Silver</span>
                </div>

                <div className="points-row">
                  <div className="points-total">
                    <span className="points-label">
                      Available points
                      <button
                        id="points-help"
                        className="info-button"
                        aria-label="About available points"
                        aria-expanded={pointsInfoOpen}
                        onClick={() => setPointsInfoOpen((v) => !v)}
                      >
                        <Info size={16} />
                      </button>
                    </span>
                    <div><strong>1,245</strong><b>pts</b></div>
                  </div>
                  <div className="points-total lifetime-points">
                    <span>Lifetime points</span>
                    <div><strong>1,245</strong><b>pts</b></div>
                  </div>
                </div>
              </section>

              {pointsInfoOpen && (
                <InfoBubble
                  variant="points"
                  title="Available points"
                  onClose={() => setPointsInfoOpen(false)}
                  onOpenGuide={() => { setPointsInfoOpen(false); setGuideTopic('points') }}
                >
                  Points you can redeem right now for cash or rewards.
                </InfoBubble>
              )}

              <section className="dashboard-goal-editor card" aria-label="Edit income goal">
                <div className="sheet-label sheet-label-with-info">
                  <label htmlFor="income-goal">Monthly income goal</label>
                  <button
                    id="goal-help"
                    className="info-button"
                    aria-label="About monthly income goal"
                    aria-expanded={goalInfoOpen}
                    onClick={() => setGoalInfoOpen((v) => !v)}
                  >
                    <Info size={16} />
                  </button>
                  {goalInfoOpen && (
                    <>
                      <button className="dismiss-tip" aria-label="Dismiss" onClick={() => setGoalInfoOpen(false)} />
                      <div className="sheet-help-bubble" role="dialog">
                        <button className="tip-close" aria-label="Close" onClick={() => setGoalInfoOpen(false)}>
                          <X size={16} />
                        </button>
                        <strong>Monthly income goal</strong>
                        <p>Set a target and timeline — we estimate the daily actions needed to hit it.</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="sheet-amount">
                  <output htmlFor="income-goal">{formatVnd(goalAmount * 1_000_000)}</output>
                  <span>VND</span>
                </div>

                <div className="sheet-slider">
                  <div className="slider-track">
                    <div style={{ width: `${sliderPct}%` }} />
                  </div>
                  <input
                    id="income-goal"
                    aria-valuetext={`${goalAmount} million VND per month`}
                    type="range"
                    min={MIN_GOAL}
                    max={MAX_GOAL}
                    step={STEP_GOAL}
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                  />
                </div>
                <div className="sheet-bounds"><span>5M</span><span>100M</span></div>

                <div className="sheet-months" role="group" aria-label="Time to reach your goal">
                  {[6, 12, 18].map((m) => (
                    <button key={m} aria-pressed={months === m} onClick={() => setMonths(m)}>
                      {months === m && <CircleCheck size={16} fill="var(--color-primary)" stroke="white" />}
                      {m} months
                    </button>
                  ))}
                </div>

                <button
                  className={`goal-network-stats card ${networkStatsOpen ? '' : 'collapsed'}`}
                  onClick={() => setNetworkStatsOpen((v) => !v)}
                  aria-expanded={networkStatsOpen}
                >
                  {networkStatsOpen ? (
                    <>
                      <span className="stat"><strong>{networkReach.merchants}</strong><span>Merchants</span></span>
                      <span className="divider" aria-hidden="true" />
                      <span className="stat"><strong>{networkReach.influencers}</strong><span>Influencers</span></span>
                    </>
                  ) : (
                    <span className="goal-network-stats-label">Network Reach</span>
                  )}
                  <ChevronDown
                    size={20}
                    className="goal-network-stats-chevron"
                    style={{ transform: networkStatsOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                <section className="sheet-preview" aria-live="polite" aria-atomic="true" style={{ position: 'relative' }}>
                  <div className="preview-heading">
                    <span className="activities-day-label">
                      Activities / day
                      <button
                        id="activities-help"
                        className="info-button"
                        aria-label="About activities per day"
                        aria-expanded={activitiesInfoOpen}
                        onClick={() => setActivitiesInfoOpen((v) => !v)}
                      >
                        <Info size={16} />
                      </button>
                    </span>
                    <span>{actions.total} actions</span>
                  </div>
                  {activitiesInfoOpen && (
                    <>
                      <button className="dismiss-tip" aria-label="Dismiss" onClick={() => setActivitiesInfoOpen(false)} />
                      <div className="sheet-help-bubble" role="dialog">
                        <button className="tip-close" aria-label="Close" onClick={() => setActivitiesInfoOpen(false)}>
                          <X size={16} />
                        </button>
                        <strong>Activities / day</strong>
                        <p>The daily actions needed to hit your goal — scales with the amount and timeline above.</p>
                        <button
                          className="video-link"
                          onClick={() => { setActivitiesInfoOpen(false); setGuideTopic('activities') }}
                        >
                          <Play size={14} /> Watch guide
                        </button>
                      </div>
                    </>
                  )}
                  <div className="preview-counts">
                    <div><strong>{actions.invites}</strong><span>Invites</span></div>
                    <div><strong>{actions.remind}</strong><span>Remind</span></div>
                    <div><strong>{actions.ppp}</strong><span>PPP</span></div>
                    <div><strong>{actions.sharp}</strong><span>SHARP</span></div>
                  </div>
                </section>

                <button className="sheet-save" onClick={handleSave}>
                  {saved ? 'Saved' : 'Save changes'}
                </button>
              </section>

              <button className="checkin-card card" onClick={() => setCheckinOpen((v) => !v)} aria-expanded={checkinOpen}>
                <CalendarCheck size={25} />
                <span><strong>Check in</strong><small>Keep your daily streak going</small></span>
                <ChevronDown size={22} style={{ transform: checkinOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {checkinOpen && (
                <div className="card" style={{ margin: '0 11px 10px', padding: '14px 16px', fontSize: 14, color: 'var(--color-text)' }}>
                  Daily streak: 3 days. Check in today to keep it going and earn bonus points.
                </div>
              )}

              <button className="activities card" onClick={() => setActivitiesOpen((v) => !v)} aria-expanded={activitiesOpen}>
                <Clock3 size={26} strokeWidth={1.5} />
                <span>Recent Activities</span>
                <ChevronDown size={25} style={{ transform: activitiesOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {activitiesOpen && (
                <div className="card" style={{ margin: '0 11px 10px', padding: '14px 16px', fontSize: 14, color: 'var(--color-text)' }}>
                  No recent activity yet — invite a merchant to get started.
                </div>
              )}
            </div>
          </div>

          <nav className="bottom-bar" aria-label="Main navigation">
            {[
              { key: 'Home', icon: House },
              { key: 'Network', icon: UsersRound },
              { key: 'Plan', icon: GoalIcon },
              { key: 'Points', icon: CircleStar },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                className={`nav-item ${selectedNav === key ? 'selected' : ''}`}
                aria-pressed={selectedNav === key}
                onClick={() => setSelectedNav(key)}
              >
                <Icon size={25} strokeWidth={1.7} />
                <span>{key}</span>
              </button>
            ))}
          </nav>
        </section>
      </div>

      {guideTopic && <GuideDialog topic={guideTopic} onClose={() => setGuideTopic(null)} />}
    </main>
  )
}
