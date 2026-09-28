import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ItemForm from '../components/ItemForm'

describe('ItemForm', () => {
  it('필수 입력이 비어 있으면 필드별 오류를 표시한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ItemForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: '저장하기' }))

    expect(screen.getByText('제목을 입력하세요.')).toBeInTheDocument()
    expect(screen.getByText('내용을 입력하세요.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('입력값을 state로 관리하고 유효한 값은 제출한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ItemForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('제목 *'), 'React 복습')
    await user.type(screen.getByLabelText('내용 *'), 'useEffect 흐름을 정리했다.')
    expect(screen.getByText('React 복습')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '저장하기' }))
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'React 복습',
      category: '기타',
      content: 'useEffect 흐름을 정리했다.'
    })
  })
})
