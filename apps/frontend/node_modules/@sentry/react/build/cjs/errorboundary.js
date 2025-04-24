Object.defineProperty(exports, '__esModule', { value: true });

const browser = require('@sentry/browser');
const core = require('@sentry/core');
const hoistNonReactStatics = require('hoist-non-react-statics');
const React = require('react');
const debugBuild = require('./debug-build.js');
const error = require('./error.js');

const _interopDefault = e => e && e.__esModule ? e.default : e;

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null);
  if (e) {
    for (const k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return n;
}

const hoistNonReactStatics__default = /*#__PURE__*/_interopDefault(hoistNonReactStatics);
const React__namespace = /*#__PURE__*/_interopNamespace(React);

const UNKNOWN_COMPONENT = 'unknown';

const INITIAL_STATE = {
  componentStack: null,
  error: null,
  eventId: null,
};

/**
 * A ErrorBoundary component that logs errors to Sentry.
 * NOTE: If you are a Sentry user, and you are seeing this stack frame, it means the
 * Sentry React SDK ErrorBoundary caught an error invoking your application code. This
 * is expected behavior and NOT indicative of a bug with the Sentry React SDK.
 */
class ErrorBoundary extends React__namespace.Component {

   constructor(props) {
    super(props);ErrorBoundary.prototype.__init.call(this);
    this.state = INITIAL_STATE;
    this._openFallbackReportDialog = true;

    const client = browser.getClient();
    if (client && props.showDialog) {
      this._openFallbackReportDialog = false;
      this._cleanupHook = client.on('afterSendEvent', event => {
        if (!event.type && this._lastEventId && event.event_id === this._lastEventId) {
          browser.showReportDialog({ ...props.dialogOptions, eventId: this._lastEventId });
        }
      });
    }
  }

   componentDidCatch(error$1, errorInfo) {
    const { componentStack } = errorInfo;
    // TODO(v9): Remove this check and type `componentStack` to be React.ErrorInfo['componentStack'].
    const passedInComponentStack = componentStack == null ? undefined : componentStack;

    const { beforeCapture, onError, showDialog, dialogOptions } = this.props;
    browser.withScope(scope => {
      if (beforeCapture) {
        beforeCapture(scope, error$1, passedInComponentStack);
      }

      const handled = this.props.handled != null ? this.props.handled : !!this.props.fallback;
      const eventId = error.captureReactException(error$1, errorInfo, { mechanism: { handled } });

      if (onError) {
        onError(error$1, passedInComponentStack, eventId);
      }
      if (showDialog) {
        this._lastEventId = eventId;
        if (this._openFallbackReportDialog) {
          browser.showReportDialog({ ...dialogOptions, eventId });
        }
      }

      // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.
      this.setState({ error: error$1, componentStack, eventId });
    });
  }

   componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount();
    }
  }

   componentWillUnmount() {
    const { error, componentStack, eventId } = this.state;
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount(error, componentStack, eventId);
    }

    if (this._cleanupHook) {
      this._cleanupHook();
      this._cleanupHook = undefined;
    }
  }

   __init() {this.resetErrorBoundary = () => {
    const { onReset } = this.props;
    const { error, componentStack, eventId } = this.state;
    if (onReset) {
      onReset(error, componentStack, eventId);
    }
    this.setState(INITIAL_STATE);
  };}

   render() {
    const { fallback, children } = this.props;
    const state = this.state;

    if (state.error) {
      let element = undefined;
      if (typeof fallback === 'function') {
        element = React__namespace.createElement(fallback, {
          error: state.error,
          componentStack: state.componentStack ,
          resetError: this.resetErrorBoundary,
          eventId: state.eventId ,
        });
      } else {
        element = fallback;
      }

      if (React__namespace.isValidElement(element)) {
        return element;
      }

      if (fallback) {
        debugBuild.DEBUG_BUILD && core.logger.warn('fallback did not produce a valid ReactElement');
      }

      // Fail gracefully if no fallback provided or is not valid
      return null;
    }

    if (typeof children === 'function') {
      return (children )();
    }
    return children;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorBoundary(
  WrappedComponent,
  errorBoundaryOptions,
) {
  const componentDisplayName = WrappedComponent.displayName || WrappedComponent.name || UNKNOWN_COMPONENT;

  const Wrapped = (props) => (
    React__namespace.createElement(ErrorBoundary, { ...errorBoundaryOptions,}
      , React__namespace.createElement(WrappedComponent, { ...props,} )
    )
  );

  Wrapped.displayName = `errorBoundary(${componentDisplayName})`;

  // Copy over static methods from Wrapped component to Profiler HOC
  // See: https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  hoistNonReactStatics__default(Wrapped, WrappedComponent);
  return Wrapped;
}

exports.ErrorBoundary = ErrorBoundary;
exports.UNKNOWN_COMPONENT = UNKNOWN_COMPONENT;
exports.withErrorBoundary = withErrorBoundary;
//# sourceMappingURL=errorboundary.js.map
