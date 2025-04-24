import { metrics as metrics$1, BrowserMetricsAggregator } from '@sentry/core';

/**
 * Adds a value to a counter metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function increment(name, value = 1, data) {
  // eslint-disable-next-line deprecation/deprecation
  metrics$1.increment(BrowserMetricsAggregator, name, value, data);
}

/**
 * Adds a value to a distribution metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function distribution(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  metrics$1.distribution(BrowserMetricsAggregator, name, value, data);
}

/**
 * Adds a value to a set metric. Value must be a string or integer.
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function set(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  metrics$1.set(BrowserMetricsAggregator, name, value, data);
}

/**
 * Adds a value to a gauge metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function gauge(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  metrics$1.gauge(BrowserMetricsAggregator, name, value, data);
}

/**
 * Adds a timing metric.
 * The metric is added as a distribution metric.
 *
 * You can either directly capture a numeric `value`, or wrap a callback function in `timing`.
 * In the latter case, the duration of the callback execution will be captured as a span & a metric.
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */

function timing(
  name,
  value,
  unit = 'second',
  data,
) {
  // eslint-disable-next-line deprecation/deprecation
  return metrics$1.timing(BrowserMetricsAggregator, name, value, unit, data);
}

/**
 * The metrics API is used to capture custom metrics in Sentry.
 *
 * @deprecated The Sentry metrics beta has ended. This export will be removed in a future release.
 */
const metrics = {
  increment,
  distribution,
  set,
  gauge,
  timing,
};

export { metrics };
//# sourceMappingURL=metrics.js.map
