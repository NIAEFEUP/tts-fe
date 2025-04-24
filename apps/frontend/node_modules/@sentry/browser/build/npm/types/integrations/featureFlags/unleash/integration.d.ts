import type { UnleashClientClass } from './types';
/**
 * Sentry integration for capturing feature flag evaluations from the Unleash SDK.
 *
 * See the [feature flag documentation](https://develop.sentry.dev/sdk/expected-features/#feature-flags) for more information.
 *
 * @example
 * ```
 * import { UnleashClient } from 'unleash-proxy-client';
 * import * as Sentry from '@sentry/browser';
 *
 * Sentry.init({
 *   dsn: '___PUBLIC_DSN___',
 *   integrations: [Sentry.unleashIntegration({unleashClientClass: UnleashClient})],
 * });
 *
 * const unleash = new UnleashClient(...);
 * unleash.start();
 *
 * unleash.isEnabled('my-feature');
 * unleash.getVariant('other-feature');
 * Sentry.captureException(new Error('something went wrong'));
 * ```
 */
export declare const unleashIntegration: (args_0: {
    unleashClientClass: UnleashClientClass;
}) => import("@sentry/core").Integration;
//# sourceMappingURL=integration.d.ts.map