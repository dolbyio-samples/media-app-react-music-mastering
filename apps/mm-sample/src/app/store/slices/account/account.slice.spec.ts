import { accountAdapter, accountReducer } from './account.slice';

describe('account reducer', () => {
  it('should handle initial state', () => {
    const expected = accountAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(accountReducer(undefined, { type: '' })).toEqual(expected);
  });
});
