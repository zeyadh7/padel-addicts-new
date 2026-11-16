import { Component } from 'react'

// Catches any rendering crash so the visitor sees a message instead of a blank screen.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="font-display text-6xl text-gold">Something went wrong</div>
        <p className="mt-3 text-white/90">This page hit a problem. Try refreshing, or go back to the home page.</p>
        <pre className="mt-5 overflow-auto rounded-xl bg-black/30 p-4 text-left text-xs text-white/80">{String(this.state.error?.message ?? this.state.error)}</pre>
        <a href={import.meta.env.BASE_URL} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-gold px-7 py-3 font-bold text-ink">
          Back to home
        </a>
      </div>
    )
  }
}
