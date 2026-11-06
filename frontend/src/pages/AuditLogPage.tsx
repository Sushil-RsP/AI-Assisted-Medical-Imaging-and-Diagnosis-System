import React, { useEffect, useState } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import { getAuditLog, formatDateTime, type AuditLogEntry } from '../api/client'

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLog = async () => {
    setLoading(true)
    try {
      const data = await getAuditLog()
      setEntries(data)
    } catch (e: any) {
      setError(e.message || 'Failed to retrieve audit log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLog()
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>System Audit Ledger</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Append-only security log tracking model provenance, reviews, and operator actions.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchLog} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          Refresh Log
        </button>
      </div>

      {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="loading-overlay"><span className="spinner" /> Loading audit trail…</div>
      ) : entries.length === 0 ? (
        <div className="empty-state card">
          <FileText size={36} />
          <div style={{ fontWeight: 600 }}>Audit ledger is empty</div>
          <div style={{ fontSize: '0.82rem' }}>Audit entries are recorded automatically upon case adjudication</div>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                {['Timestamp (UTC)', 'Action Event', 'Entity Reference', 'Operator / Reviewer', 'Audit Metadata'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatDateTime(e.created_at)}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <span className="badge badge-inference" style={{ fontSize: '0.75rem' }}>{e.event_type}</span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--color-primary)' }}>
                    {e.entity_id ? e.entity_id.slice(0, 8) + '…' : '—'}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text)' }}>{e.reviewer_id}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)' }}>{e.detail || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

