import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'

describe('LandingPage Component', () => {

  it('menampilkan nama aplikasi SIPILIH', () => {

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: /sipilih/i,
        level: 2
      })
    ).toBeInTheDocument()

  })

  it('menampilkan tombol Masuk dan Daftar Akun', () => {

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/masuk/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/daftar akun/i)
    ).toBeInTheDocument()

  })

})