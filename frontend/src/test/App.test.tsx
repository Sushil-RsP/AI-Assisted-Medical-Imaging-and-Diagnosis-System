import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock api client to verify rendering without network dependency
vi.mock('../api/client', () => ({
  getHealth: vi.fn().mockResolvedValue({
    status: 'ok',
    version: '0.1.0',
    environment: 'test',
    disclaimer: 'For education only — not for clinical use.'
  }),
  getModels: vi.fn().mockResolvedValue([]),
  getReviews: vi.fn().mockResolvedValue([]),
  getAuditLog: vi.fn().mockResolvedValue([]),
  getStudies: vi.fn().mockResolvedValue([]),
  classify: vi.fn(),
  gradcam: vi.fn(),
  segment: vi.fn(),
  createReview: vi.fn(),
}))

describe('Medical Imaging Application Shell', () => {
  it('renders mandatory education disclaimer banner', async () => {
    render(<App />)
    const disclaimer = await screen.findByText(/For education only — not for clinical use/i)
    expect(disclaimer).toBeInTheDocument()
  })

  it('renders standard navigation routing items', async () => {
    render(<App />)
    const overviewElements = screen.getAllByText(/Overview/i)
    expect(overviewElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Scan & Analyze/i)).toBeInTheDocument()
    const reviewQueueElements = screen.getAllByText(/Review Queue/i)
    expect(reviewQueueElements.length).toBeGreaterThanOrEqual(1)
  })
})
