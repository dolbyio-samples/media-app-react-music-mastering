import { libraryAdapter, libraryReducer } from './library.slice';

describe('library reducer', () => {
  it('should handle initial state', () => {
    const expected = libraryAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(libraryReducer(undefined, { type: '' })).toEqual(expected);
  });
});
