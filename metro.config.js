// Metro configuration for Expo (web export).
//
// @supabase/supabase-js v2 contains an optional dynamic
// `import("@opentelemetry/api")` for tracing. Metro's static dependency
// crawler can't reason about the runtime conditional, so the bundle fails
// to resolve the otel module unless it exists on disk. We don't use otel
// in this app, so we redirect the request to an empty stub.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  '@opentelemetry/api': path.resolve(__dirname, 'shims/otel-stub.js'),
};

module.exports = config;
