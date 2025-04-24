Object.defineProperty(exports, '__esModule', { value: true });

const feedback = require('@sentry-internal/feedback');

/** Add a widget to capture user feedback to your application. */
const feedbackSyncIntegration = feedback.buildFeedbackIntegration({
  getModalIntegration: () => feedback.feedbackModalIntegration,
  getScreenshotIntegration: () => feedback.feedbackScreenshotIntegration,
});

exports.feedbackSyncIntegration = feedbackSyncIntegration;
//# sourceMappingURL=feedbackSync.js.map
