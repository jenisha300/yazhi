import { Component } from "react";

// Wraps a page so that if something throws during render, the user sees a
// readable error (and it's logged to the console) instead of a blank page.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Page crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl mb-2 text-burgundy">Something went wrong</h2>
          <p className="text-sm text-charcoal/60 mb-4">
            {this.state.error.message || "This page hit an unexpected error."}
          </p>
          <p className="text-xs text-charcoal/40">
            Open the browser console (F12) for the full error details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;