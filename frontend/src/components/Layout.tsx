import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity, Upload, BookOpen, Layers,
  ClipboardList, FileText, BarChart2, Settings
} from 'lucide-react'
import { Brain } from 'lucide-react'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/overview',       icon: Activity,      label: 'Overview' },
  { to: '/scan',           icon: Upload,        label: 'Scan & Analyze' },
  { to: '/studies',        icon: BookOpen,      label: 'Studies' },
  { to: '/segmentation',   icon: Layers,        label: 'Segmentation' },
  { to: '/review-queue',   icon: ClipboardList, label: 'Review Queue' },
  { to: '/audit-log',      icon: FileText,      label: 'Audit Log' },
  { to: '/model-metrics',  icon: BarChart2,     label: 'Model Metrics' },
  { to: '/settings',       icon: Settings,      label: 'Settings' },
]

export default function Layout() {
  return (
    <div className={styles.root}>
      {/* Mandatory Regulatory / Educational Notice Banner */}
      <header
        style={{
          background: 'rgba(239, 68, 68, 0.12)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '0.4rem 1rem',
          fontSize: '0.82rem',
          color: '#fca5a5',
          textAlign: 'center',
          fontWeight: 500,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <span>⚠️</span>
        <span>
          <strong>For education only — not for clinical use.</strong> Not approved for medical diagnosis or clinical decision-making.
        </span>
      </header>

      <div className={styles.shell}>
        {/* Sidebar */}
        <nav className={styles.sidebar} aria-label="Main navigation">
          <div className={styles.logo}>
            <Brain size={22} color="#38bdf8" />
            <span>MedImaging <em>AI</em></span>
          </div>
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.sidebarFooter}>
            <span className="badge badge-demo">v0.1 · Demo</span>
          </div>
        </nav>

        {/* Main content */}
        <main className={styles.main} id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
