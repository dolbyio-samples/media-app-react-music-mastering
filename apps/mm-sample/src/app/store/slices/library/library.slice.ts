import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

import { RootState } from '../../configureAppStore';

export const LIBRARY_FEATURE_KEY = 'library';

/*
 * Update these interfaces according to your requirements.
 */
export interface LibraryEntity {
  id: number;
}

export interface LibraryState extends EntityState<LibraryEntity> {}

export const libraryAdapter = createEntityAdapter<LibraryEntity>();

export const initialLibraryState: LibraryState =
  libraryAdapter.getInitialState();

export const librarySlice = createSlice({
  name: LIBRARY_FEATURE_KEY,
  initialState: initialLibraryState,
  reducers: {
    add: libraryAdapter.addOne,
    remove: libraryAdapter.removeOne,
    addMany: libraryAdapter.addMany,
    // ...
  },
});

/*
 * Export reducer for store configuration.
 */
export const libraryReducer = librarySlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(libraryActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const libraryActions = librarySlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllLibrary);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = libraryAdapter.getSelectors();

export const getLibraryState = (rootState: RootState): LibraryState =>
  rootState[LIBRARY_FEATURE_KEY];

export const selectAllLibrary = createSelector(getLibraryState, selectAll);

export const selectLibraryEntities = createSelector(
  getLibraryState,
  selectEntities
);
