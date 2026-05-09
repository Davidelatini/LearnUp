import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-4 text-center bg-red-50 border border-red-200">
          <p className="text-red-600 font-semibold text-sm">
            ⚠ Componente non caricato: {this.state.error?.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
