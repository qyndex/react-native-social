// Empty stub for @opentelemetry/api so Metro's static resolver is happy.
// @supabase/supabase-js v2 dynamically imports this for tracing; we don't
// use tracing on web, so any reference resolves to no-ops.
const noop = () => {};
const noopSpan = {
  end: noop,
  setAttribute: noop,
  setAttributes: noop,
  recordException: noop,
  setStatus: noop,
  updateName: noop,
  addEvent: noop,
  isRecording: () => false,
  spanContext: () => ({ traceId: '', spanId: '', traceFlags: 0 }),
};
const noopTracer = {
  startSpan: () => noopSpan,
  startActiveSpan: (_name, _opts, fn) => (typeof fn === 'function' ? fn(noopSpan) : noopSpan),
};
module.exports = {
  trace: {
    getTracer: () => noopTracer,
    getSpan: () => noopSpan,
    getActiveSpan: () => noopSpan,
    setSpan: (ctx) => ctx,
    deleteSpan: (ctx) => ctx,
    wrapSpanContext: () => noopSpan,
  },
  context: {
    active: () => ({}),
    with: (_ctx, fn) => (typeof fn === 'function' ? fn() : undefined),
  },
  SpanStatusCode: { UNSET: 0, OK: 1, ERROR: 2 },
  SpanKind: { INTERNAL: 0, SERVER: 1, CLIENT: 2, PRODUCER: 3, CONSUMER: 4 },
};
