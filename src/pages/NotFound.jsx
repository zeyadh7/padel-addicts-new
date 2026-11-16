import { Link } from 'react-router-dom'
import { Container } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="font-display text-[120px] leading-none text-gold">404</div>
      <p className="mt-2 text-xl">That page isn't on the court.</p>
      <Link to="/" className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-gold px-7 py-3 font-bold text-ink">Back to home</Link>
    </Container>
  )
}
