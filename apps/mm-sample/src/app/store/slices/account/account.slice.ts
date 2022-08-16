import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '../../configureAppStore';

export const ACCOUNT_FEATURE_KEY = 'account';

/*
 * Update these interfaces according to your requirements.
 */
export interface AccountEntity {
  id: string;
  name?: string;
  rawDataPrefix: string;
  previewDataPrefix: string;
  masterDataPrefix: string;
}

export interface AccountState extends EntityState<AccountEntity> {
  selectedId: string;
}

export const accountAdapter = createEntityAdapter<AccountEntity>();

export const initialAccountState: AccountState = {
  selectedId: '',
  ...accountAdapter.getInitialState(),
};

export const accountSlice = createSlice({
  name: ACCOUNT_FEATURE_KEY,
  initialState: initialAccountState,
  reducers: {
    add: accountAdapter.addOne,
    remove: accountAdapter.removeOne,
    addMany: accountAdapter.addMany,
    updateSelectedAccount: (state, action: PayloadAction<string>) => {
      return { ...state, selectedId: action.payload };
    },
    // ...
  },
});

/*
 * Export reducer for store configuration.
 */
export const accountReducer = accountSlice.reducer;

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
 *   dispatch(accountActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const accountActions = accountSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllAccount);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities, selectById } = accountAdapter.getSelectors();

export const getAccountState = (rootState: RootState): AccountState =>
  rootState[ACCOUNT_FEATURE_KEY];

export const selectAllAccount = createSelector(getAccountState, selectAll);

export const selectAccountEntities = createSelector(
  getAccountState,
  selectEntities
);

export const selectAccountById = (id: string) =>
  createSelector(getAccountState, (state) => selectById(state, id));

export const selectDefaultAccount = createSelector(getAccountState, (state) => {
  const { selectedId } = state;
  return selectById(state, selectedId);
});
