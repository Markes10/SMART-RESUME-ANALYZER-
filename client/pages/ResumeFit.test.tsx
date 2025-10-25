import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ResumeFit from './ResumeFit'

// Mock the API client
vi.mock('../services/api', () => ({
  uploadResume: vi.fn().mockResolvedValue({ 
    id: 1, 
    skills: ['React', 'TypeScript', 'Python'] 
  }),
  matchJobs: vi.fn().mockResolvedValue([
    {
      job: {
        id: 1,
        title: 'Senior Developer',
        description: 'Looking for a senior developer'
      },
      match_score: 0.85,
      matching_skills: ['React', 'TypeScript'],
      missing_skills: ['Python']
    }
  ])
}))

describe('ResumeFit Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ResumeFit />
      </BrowserRouter>
    )
  })

  it('renders resume upload section', () => {
    expect(screen.getByText(/Upload Resume/i)).toBeDefined()
  })

  it('shows skills after resume upload', async () => {
    const user = userEvent.setup()
    const fileInput = screen.getByLabelText(/upload resume/i)
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, file)
    
    expect(await screen.findByText(/Skills Found/i)).toBeDefined()
    expect(await screen.findByText(/React/i)).toBeDefined()
    expect(await screen.findByText(/TypeScript/i)).toBeDefined()
  })

  it('shows job matches after processing', async () => {
    const user = userEvent.setup()
    const fileInput = screen.getByLabelText(/upload resume/i)
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, file)
    
    expect(await screen.findByText(/Senior Developer/i)).toBeDefined()
    expect(await screen.findByText(/85%/i)).toBeDefined()
  })

  it('displays error message on upload failure', async () => {
    // Mock API error
    vi.mock('../services/api', () => ({
      uploadResume: vi.fn().mockRejectedValue(new Error('Upload failed'))
    }))

    const user = userEvent.setup()
    const fileInput = screen.getByLabelText(/upload resume/i)
    const file = new File(['invalid content'], 'invalid.txt', { type: 'text/plain' })
    
    await user.upload(fileInput, file)
    
    expect(await screen.findByText(/Error uploading resume/i)).toBeDefined()
  })
})