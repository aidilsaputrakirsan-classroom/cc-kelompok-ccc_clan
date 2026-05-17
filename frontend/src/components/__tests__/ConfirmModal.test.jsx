import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ConfirmModal from '../ConfirmModal'

describe('ConfirmModal Component', () => {

  it('menampilkan title dan message modal', () => {

    render(
      <ConfirmModal
        show={true}
        title="Hapus Kandidat"
        message="Yakin ingin menghapus?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(
      screen.getByText(/hapus kandidat/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/yakin ingin menghapus/i)
    ).toBeInTheDocument()

  })

  it('memanggil onConfirm saat tombol Ya diklik', () => {

    const handleConfirm = vi.fn()

    render(
      <ConfirmModal
        show={true}
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    )

    fireEvent.click(
        screen.getByRole('button', {
            name: /^ya$/i
        })
    )

    expect(handleConfirm).toHaveBeenCalled()

  })

  it('memanggil onCancel saat tombol Batal diklik', () => {

    const handleCancel = vi.fn()

    render(
      <ConfirmModal
        show={true}
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    )

    fireEvent.click(
      screen.getByText(/batal/i)
    )

    expect(handleCancel).toHaveBeenCalled()

  })

})