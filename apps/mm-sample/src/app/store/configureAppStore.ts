/** @see https://stackoverflow.com/questions/40568176/webpack-typescript-module-hot-does-not-exist */
/// <reference types="webpack-env" />
import { Middleware } from 'redux';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitor-reducers';
import loggerMiddleware from './middleware/logger';
import debounceMiddleware from './middleware/debounce';
import {
  LIBRARY_FEATURE_KEY,
  libraryReducer,
  TRACKS_FEATURE_KEY,
  tracksReducer,
  ACCOUNT_FEATURE_KEY,
  accountReducer,
  MASTERING_FEATURE_KEY,
  masteringReducer,
} from './slices';
import { loadState } from './browser-storage';

const nodeEnvIsProd = () => {
  const { NODE_ENV: nodeEnv } = process.env;
  return nodeEnv === 'production';
};

// Reducers
const rootReducer = combineReducers({
  [LIBRARY_FEATURE_KEY]: libraryReducer,
  [TRACKS_FEATURE_KEY]: tracksReducer,
  [ACCOUNT_FEATURE_KEY]: accountReducer,
  [MASTERING_FEATURE_KEY]: masteringReducer,
});

export const configureAppStore = (initialState = {}) => {
  // Middleware
  let middleware: Middleware[] = [];
  if (!nodeEnvIsProd()) {
    middleware = [...middleware, loggerMiddleware, debounceMiddleware()];
  }

  // Configure store
  const store = configureStore({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      ...middleware,
    ],
    // @ts-ignore
    enhancers: [monitorReducersEnhancer],
    preloadedState: loadState(),
  });

  if (!nodeEnvIsProd() && module.hot) {
    module.hot.accept('./slices', () => store.replaceReducer(rootReducer));
  }

  return store;
};

// Types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
