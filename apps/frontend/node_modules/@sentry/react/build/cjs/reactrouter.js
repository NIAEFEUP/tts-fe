Object.defineProperty(exports, '__esModule', { value: true });

const browser = require('@sentry/browser');
const core = require('@sentry/core');
const hoistNonReactStatics = require('hoist-non-react-statics');
const React = require('react');

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

// We need to disable eslint no-explicit-any because any is required for the
// react-router typings.

/**
 * A browser tracing integration that uses React Router v4 to instrument navigations.
 * Expects `history` (and optionally `routes` and `matchPath`) to be passed as options.
 */
function reactRouterV4BrowserTracingIntegration(
  options,
) {
  const integration = browser.browserTracingIntegration({
    ...options,
    instrumentPageLoad: false,
    instrumentNavigation: false,
  });

  const { history, routes, matchPath, instrumentPageLoad = true, instrumentNavigation = true } = options;

  return {
    ...integration,
    afterAllSetup(client) {
      integration.afterAllSetup(client);

      instrumentReactRouter(
        client,
        instrumentPageLoad,
        instrumentNavigation,
        history,
        'reactrouter_v4',
        routes,
        matchPath,
      );
    },
  };
}

/**
 * A browser tracing integration that uses React Router v5 to instrument navigations.
 * Expects `history` (and optionally `routes` and `matchPath`) to be passed as options.
 */
function reactRouterV5BrowserTracingIntegration(
  options,
) {
  const integration = browser.browserTracingIntegration({
    ...options,
    instrumentPageLoad: false,
    instrumentNavigation: false,
  });

  const { history, routes, matchPath, instrumentPageLoad = true, instrumentNavigation = true } = options;

  return {
    ...integration,
    afterAllSetup(client) {
      integration.afterAllSetup(client);

      instrumentReactRouter(
        client,
        instrumentPageLoad,
        instrumentNavigation,
        history,
        'reactrouter_v5',
        routes,
        matchPath,
      );
    },
  };
}

function instrumentReactRouter(
  client,
  instrumentPageLoad,
  instrumentNavigation,
  history,
  instrumentationName,
  allRoutes = [],
  matchPath,
) {
  function getInitPathName() {
    if (history && history.location) {
      return history.location.pathname;
    }

    if (browser.WINDOW && browser.WINDOW.location) {
      return browser.WINDOW.location.pathname;
    }

    return undefined;
  }

  /**
   * Normalizes a transaction name. Returns the new name as well as the
   * source of the transaction.
   *
   * @param pathname The initial pathname we normalize
   */
  function normalizeTransactionName(pathname) {
    if (allRoutes.length === 0 || !matchPath) {
      return [pathname, 'url'];
    }

    const branches = matchRoutes(allRoutes, pathname, matchPath);
    for (const branch of branches) {
      if (branch.match.isExact) {
        return [branch.match.path, 'route'];
      }
    }

    return [pathname, 'url'];
  }

  if (instrumentPageLoad) {
    const initPathName = getInitPathName();
    if (initPathName) {
      const [name, source] = normalizeTransactionName(initPathName);
      browser.startBrowserTracingPageLoadSpan(client, {
        name,
        attributes: {
          [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'pageload',
          [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: `auto.pageload.react.${instrumentationName}`,
          [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: source,
        },
      });
    }
  }

  if (instrumentNavigation && history.listen) {
    history.listen((location, action) => {
      if (action && (action === 'PUSH' || action === 'POP')) {
        const [name, source] = normalizeTransactionName(location.pathname);
        browser.startBrowserTracingNavigationSpan(client, {
          name,
          attributes: {
            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'navigation',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: `auto.navigation.react.${instrumentationName}`,
            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: source,
          },
        });
      }
    });
  }
}

/**
 * Matches a set of routes to a pathname
 * Based on implementation from
 */
function matchRoutes(
  routes,
  pathname,
  matchPath,
  branch = [],
) {
  routes.some(route => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          branch[branch.length - 1].match // use parent match
        : computeRootMatch(pathname); // use default "root" match

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, matchPath, branch);
      }
    }

    return !!match;
  });

  return branch;
}

function computeRootMatch(pathname) {
  return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
function withSentryRouting(Route) {
  const componentDisplayName = Route.displayName || Route.name;

  const WrappedRoute = (props) => {
    if (props && props.computedMatch && props.computedMatch.isExact) {
      const route = props.computedMatch.path;
      const activeRootSpan = getActiveRootSpan();

      core.getCurrentScope().setTransactionName(route);

      if (activeRootSpan) {
        activeRootSpan.updateName(route);
        activeRootSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, 'route');
      }
    }

    // @ts-expect-error Setting more specific React Component typing for `R` generic above
    // will break advanced type inference done by react router params:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/13dc4235c069e25fe7ee16e11f529d909f9f3ff8/types/react-router/index.d.ts#L154-L164
    return React__namespace.createElement(Route, { ...props,} );
  };

  WrappedRoute.displayName = `sentryRoute(${componentDisplayName})`;
  hoistNonReactStatics__default(WrappedRoute, Route);
  // @ts-expect-error Setting more specific React Component typing for `R` generic above
  // will break advanced type inference done by react router params:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/13dc4235c069e25fe7ee16e11f529d909f9f3ff8/types/react-router/index.d.ts#L154-L164
  return WrappedRoute;
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */

function getActiveRootSpan() {
  const span = core.getActiveSpan();
  const rootSpan = span && core.getRootSpan(span);

  if (!rootSpan) {
    return undefined;
  }

  const op = core.spanToJSON(rootSpan).op;

  // Only use this root span if it is a pageload or navigation span
  return op === 'navigation' || op === 'pageload' ? rootSpan : undefined;
}

exports.reactRouterV4BrowserTracingIntegration = reactRouterV4BrowserTracingIntegration;
exports.reactRouterV5BrowserTracingIntegration = reactRouterV5BrowserTracingIntegration;
exports.withSentryRouting = withSentryRouting;
//# sourceMappingURL=reactrouter.js.map
