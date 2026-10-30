import { render, screen } from '@testing-library/react'
import App from './App'

test('smoke: renders the app title', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument()
})
