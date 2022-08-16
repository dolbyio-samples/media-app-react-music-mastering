/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/** @see https://github.com/aws/aws-sdk-js/issues/2141 */
// aws-sdk requires global to exist
(window as any).global = window;
