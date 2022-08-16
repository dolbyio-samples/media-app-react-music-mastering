import { tracksAdapter, tracksReducer } from './tracks.slice';

describe('tracks reducer', () => {
  it('should handle initial state', () => {
    const expected = tracksAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(tracksReducer(undefined, { type: '' })).toEqual(expected);
  });
});
