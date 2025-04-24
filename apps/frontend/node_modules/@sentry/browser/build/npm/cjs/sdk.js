Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const client = require('./client.js');
const debugBuild = require('./debug-build.js');
const helpers = require('./helpers.js');
const breadcrumbs = require('./integrations/breadcrumbs.js');
const browserapierrors = require('./integrations/browserapierrors.js');
const browsersession = require('./integrations/browsersession.js');
const globalhandlers = require('./integrations/globalhandlers.js');
const httpcontext = require('./integrations/httpcontext.js');
const linkederrors = require('./integrations/linkederrors.js');
const stackParsers = require('./stack-parsers.js');
const fetch = require('./transports/fetch.js');

/** Get the default integrations for the browser SDK. */
function getDefaultIntegrations(options) {
  /**
   * Note: Please make sure this stays in sync with Angular SDK, which re-exports
   * `getDefaultIntegrations` but with an adjusted set of integrations.
   */
  const integrations = [
    core.inboundFiltersIntegration(),
    core.functionToStringIntegration(),
    browserapierrors.browserApiErrorsIntegration(),
    breadcrumbs.breadcrumbsIntegration(),
    globalhandlers.globalHandlersIntegration(),
    linkederrors.linkedErrorsIntegration(),
    core.dedupeIntegration(),
    httpcontext.httpContextIntegration(),
  ];

  // eslint-disable-next-line deprecation/deprecation
  if (options.autoSessionTracking !== false) {
    integrations.push(browsersession.browserSessionIntegration());
  }

  return integrations;
}

function applyDefaultOptions(optionsArg = {}) {
  const defaultOptions = {
    defaultIntegrations: getDefaultIntegrations(optionsArg),
    release:
      typeof __SENTRY_RELEASE__ === 'string' // This allows build tooling to find-and-replace __SENTRY_RELEASE__ to inject a release value
        ? __SENTRY_RELEASE__
        : helpers.WINDOW.SENTRY_RELEASE && helpers.WINDOW.SENTRY_RELEASE.id // This supports the variable that sentry-webpack-plugin injects
          ? helpers.WINDOW.SENTRY_RELEASE.id
          : undefined,
    autoSessionTracking: true,
    sendClientReports: true,
  };

  // TODO: Instead of dropping just `defaultIntegrations`, we should simply
  // call `dropUndefinedKeys` on the entire `optionsArg`.
  // However, for this to work we need to adjust the `hasTracingEnabled()` logic
  // first as it differentiates between `undefined` and the key not being in the object.
  if (optionsArg.defaultIntegrations == null) {
    delete optionsArg.defaultIntegrations;
  }

  return { ...defaultOptions, ...optionsArg };
}

function shouldShowBrowserExtensionError() {
  const windowWithMaybeExtension =
    typeof helpers.WINDOW.window !== 'undefined' && (helpers.WINDOW );
  if (!windowWithMaybeExtension) {
    // No need to show the error if we're not in a browser window environment (e.g. service workers)
    return false;
  }

  const extensionKey = windowWithMaybeExtension.chrome ? 'chrome' : 'browser';
  const extensionObject = windowWithMaybeExtension[extensionKey];

  const runtimeId = extensionObject && extensionObject.runtime && extensionObject.runtime.id;
  const href = (helpers.WINDOW.location && helpers.WINDOW.location.href) || '';

  const extensionProtocols = ['chrome-extension:', 'moz-extension:', 'ms-browser-extension:', 'safari-web-extension:'];

  // Running the SDK in a dedicated extension page and calling Sentry.init is fine; no risk of data leakage
  const isDedicatedExtensionPage =
    !!runtimeId && helpers.WINDOW === helpers.WINDOW.top && extensionProtocols.some(protocol => href.startsWith(`${protocol}//`));

  // Running the SDK in NW.js, which appears like a browser extension but isn't, is also fine
  // see: https://github.com/getsentry/sentry-javascript/issues/12668
  const isNWjs = typeof windowWithMaybeExtension.nw !== 'undefined';

  return !!runtimeId && !isDedicatedExtensionPage && !isNWjs;
}

/**
 * A magic string that build tooling can leverage in order to inject a release value into the SDK.
 */

/**
 * The Sentry Browser SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the web page. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/browser';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/browser';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/browser';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link BrowserOptions} for documentation on configuration options.
 */
function init(browserOptions = {}) {
  const options = applyDefaultOptions(browserOptions);

  if (!options.skipBrowserExtensionCheck && shouldShowBrowserExtensionError()) {
    core.consoleSandbox(() => {
      // eslint-disable-next-line no-console
      console.error(
        '[Sentry] You cannot run Sentry this way in a browser extension, check: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/',
      );
    });
    return;
  }

  if (debugBuild.DEBUG_BUILD) {
    if (!core.supportsFetch()) {
      core.logger.warn(
        'No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill.',
      );
    }
  }
  const clientOptions = {
    ...options,
    stackParser: core.stackParserFromStackParserOptions(options.stackParser || stackParsers.defaultStackParser),
    integrations: core.getIntegrationsToSetup(options),
    transport: options.transport || fetch.makeFetchTransport,
  };

  return core.initAndBind(client.BrowserClient, clientOptions);
}

/**
 * All properties the report dialog supports
 */

/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the global scope.
 */
function showReportDialog(options = {}) {
  // doesn't work without a document (React Native)
  if (!helpers.WINDOW.document) {
    debugBuild.DEBUG_BUILD && core.logger.error('Global document not defined in showReportDialog call');
    return;
  }

  const scope = core.getCurrentScope();
  const client = scope.getClient();
  const dsn = client && client.getDsn();

  if (!dsn) {
    debugBuild.DEBUG_BUILD && core.logger.error('DSN not configured for showReportDialog call');
    return;
  }

  if (scope) {
    options.user = {
      ...scope.getUser(),
      ...options.user,
    };
  }

  if (!options.eventId) {
    const eventId = core.lastEventId();
    if (eventId) {
      options.eventId = eventId;
    }
  }

  const script = helpers.WINDOW.document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = core.getReportDialogEndpoint(dsn, options);

  if (options.onLoad) {
    script.onload = options.onLoad;
  }

  const { onClose } = options;
  if (onClose) {
    const reportDialogClosedMessageHandler = (event) => {
      if (event.data === '__sentry_reportdialog_closed__') {
        try {
          onClose();
        } finally {
          helpers.WINDOW.removeEventListener('message', reportDialogClosedMessageHandler);
        }
      }
    };
    helpers.WINDOW.addEventListener('message', reportDialogClosedMessageHandler);
  }

  const injectionPoint = helpers.WINDOW.document.head || helpers.WINDOW.document.body;
  if (injectionPoint) {
    injectionPoint.appendChild(script);
  } else {
    debugBuild.DEBUG_BUILD && core.logger.error('Not injecting report dialog. No injection point found in HTML');
  }
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
function forceLoad() {
  // Noop
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
function onLoad(callback) {
  callback();
}

/**
 * Captures user feedback and sends it to Sentry.
 *
 * @deprecated Use `captureFeedback` instead.
 */
function captureUserFeedback(feedback) {
  const client = core.getClient();
  if (client) {
    // eslint-disable-next-line deprecation/deprecation
    client.captureUserFeedback(feedback);
  }
}

exports.captureUserFeedback = captureUserFeedback;
exports.forceLoad = forceLoad;
exports.getDefaultIntegrations = getDefaultIntegrations;
exports.init = init;
exports.onLoad = onLoad;
exports.showReportDialog = showReportDialog;
//# sourceMappingURL=sdk.js.map
