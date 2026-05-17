import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, getPublicCandidates } from '../services/api'

globalThis.fetch = vi.fn()

describe('API Service', () => {

  beforeEach(() => {
    fetch.mockClear()
    localStorage.clear()
  })

  it('login memanggil endpoint yang benar', async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'fake-token',
        user: {
          email: 'admin@test.com'
        }
      }),
    })

    await login('admin@test.com', '123456')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.objectContaining({
        method: 'POST'
      })
    )

  })

  it('getPublicCandidates mengambil data kandidat', async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ([
        { id: 1, name: 'Kandidat A' }
      ]),
    })

    const data =
      await getPublicCandidates()

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/candidates',
      expect.objectContaining({
        method: 'GET'
      })
    )

    expect(data).toEqual([
      { id: 1, name: 'Kandidat A' }
    ])

  })

})