import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ItemList from '../components/ItemList'

describe('ItemList', () => {
  it('빈 배열이면 EmptyState를 보여준다', () => {
    render(<MemoryRouter><ItemList items={[]} /></MemoryRouter>)
    expect(screen.getByText('표시할 데이터가 없습니다.')).toBeInTheDocument()
  })

  it('데이터가 있으면 카드로 렌더링한다', () => {
    const items = [{ id: 7, title: '라우터', content: '정리', category: 'React' }]
    render(<MemoryRouter><ItemList items={items} /></MemoryRouter>)
    expect(screen.getByText('라우터')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /상세 보기/ })).toHaveAttribute('href', '/items/7')
  })
})
