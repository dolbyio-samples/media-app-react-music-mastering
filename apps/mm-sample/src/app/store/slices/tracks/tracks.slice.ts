import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';

import useDolbyStorage from '../../../utils/dolby-storage-client.utils';

import { RootState } from '../../configureAppStore';

export const TRACKS_FEATURE_KEY = 'tracks';

export interface TracksEntityMetadata {
  title?: string;
  artist?: string;
  genre?: string;
  tags?: string[];
  album?: string;
  language?: string;
  discNumber?: string;
  creationDate?: string;
  isCompilation?: string;
  hasExplicitContent?: string;
  albumArtSrc?: string;
  releaseTitle?: string;
  irsc?: string;
  lyricist?: string;
  composer?: string;
  iswc?: string;
  copyright?: string;
  publisher?: string;
  band?: string;
  conductor?: string;
  upc?: string;
  engineer?: string;
  productionStudio?: string;
  recordingDate?: string;
  initialKey?: string;
  medium?: string;
  producedBy?: string;
  software?: string;
  technician?: string;
  bpm?: string;
  encodedBy?: string;
  mimeType?: string;
}
export interface TracksEntityWaveform {
  preview?: TracksEntityWaveformPreview;
}
export interface TracksEntityWaveformPreview {
  start: number;
  end: number;
}
/*
 * Update these interfaces according to your requirements.
 */
export interface TracksEntity {
  id: string;
  metadata?: TracksEntityMetadata;
  waveform?: TracksEntityWaveform;
  fileName?: string;
  uploadDate: string;
  size?: number;
  localBlobUrl?: string;
}

export interface TracksState extends EntityState<TracksEntity> {}

export const tracksAdapter = createEntityAdapter<TracksEntity>();

export const initialTracksState: TracksState = tracksAdapter.getInitialState();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
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
 *   dispatch(fetchTracks())
 * }, [dispatch]);
 * ```
 */
export const fetchTracks = createAsyncThunk<
  TracksEntity[],
  string[],
  { state: RootState }
>('tracks/fetchTracks', async (outputKeys: string[], thunkAPI) => {
  const { getFile } = useDolbyStorage();
  try {
    const trackEntities = await Promise.all(
      outputKeys.map(async (outputKey) => {
        const localBlobUrl = await getFile(outputKey);
        return {
          localBlobUrl,
          id: outputKey,
          fileName: outputKey.split('/').pop(),
        } as TracksEntity;
      })
    );
    if (trackEntities) {
      const {
        mastering: { trackId },
        tracks: { entities },
      } = thunkAPI.getState();
      const { metadata, uploadDate } = entities[trackId] || {}; // Grab the metadata from the raw file
      const tracksWithMetadata = trackEntities.map((trackEntity) => {
        return {
          ...trackEntity,
          metadata,
          uploadDate,
        } as TracksEntity;
      });
      return tracksWithMetadata;
    }
  } catch (err) {
    console.error('Failed to fetch tracks', { err });
    thunkAPI.rejectWithValue(err);
  }
  return [];
});

const updateWaveformPreviewReducer = function <T = void>(
  state: WritableDraft<TracksState>,
  action: PayloadAction<
    TracksEntityWaveformPreview & Pick<TracksEntity, 'id'>,
    any
  >
) {
  const { id, ...rest } = action.payload;
  const track = state.entities[id];
  if (!track) {
    return state;
  }
  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: {
        ...track,
        waveform: {
          ...track?.waveform,
          preview: {
            ...track?.waveform?.preview,
            ...rest,
          },
        },
      },
    },
  };
};

export const tracksSlice = createSlice({
  name: TRACKS_FEATURE_KEY,
  initialState: initialTracksState,
  reducers: {
    add: tracksAdapter.addOne,
    remove: tracksAdapter.removeOne,
    addMany: tracksAdapter.addMany,
    upsertMany: tracksAdapter.upsertMany,
    removeAll: tracksAdapter.removeAll,
    upsertOne: tracksAdapter.upsertOne,
    updateWaveformPreviewOnDrag: {
      reducer: updateWaveformPreviewReducer,
      prepare: (payload: any) => ({
        payload,
        meta: {
          debounce: {
            time: 1000,
          },
        },
      }),
    },
    updateWaveformPreview(
      state: WritableDraft<TracksState>,
      action: PayloadAction<
        TracksEntityWaveformPreview & Pick<TracksEntity, 'id'>
      >
    ) {
      const { id, ...rest } = action.payload;
      const track = state.entities[id];
      if (!track) {
        return state;
      }
      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: {
            ...track,
            waveform: {
              ...track?.waveform,
              preview: {
                ...track?.waveform?.preview,
                ...rest,
              },
            },
          },
        },
      };
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchTracks.pending, (state: TracksState) => {
      //   state.loadingStatus = 'loading';
      // })
      .addCase(
        fetchTracks.fulfilled,
        (state: TracksState, action: PayloadAction<TracksEntity[]>) => {
          if (action.payload && action.payload.length) {
            tracksAdapter.upsertMany(state, action.payload);
          }
          // state.loadingStatus = 'loaded';
        }
      );
    // .addCase(fetchTracks.rejected, (state: TracksState, action) => {
    //   state.loadingStatus = 'error';
    //   state.error = action.error.message;
    // });
  },
});

/*
 * Export reducer for store configuration.
 */
export const tracksReducer = tracksSlice.reducer;

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
 *   dispatch(tracksActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const tracksActions = tracksSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllTracks);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities, selectById } = tracksAdapter.getSelectors();

export const getTracksState = (rootState: RootState): TracksState =>
  rootState[TRACKS_FEATURE_KEY];

export const selectAllTracks = createSelector(getTracksState, selectAll);

export const selectTracksEntities = createSelector(
  getTracksState,
  selectEntities
);

export const selectLatestTrack = createSelector(selectAllTracks, (tracks) => {
  const mostRecentTrackDate = new Date(
    Math.max.apply(
      null,
      tracks.map((track) => new Date(track.uploadDate!).getTime())
    )
  );
  const mostRecentTrack = tracks.filter(
    (track) =>
      new Date(track.uploadDate!).getTime() === mostRecentTrackDate.getTime()
  )[0];
  return mostRecentTrack;
});

export const selectTrackById = (id: string) =>
  createSelector(getTracksState, (state) => selectById(state, id));

export const selectTracksByIds = (ids: string[]) =>
  createSelector(getTracksState, (state) =>
    ids
      .map((id) =>
        Object.values(state.entities).find((entity) => entity!.id === id)
      )
      .filter((entity) => entity!!)
  );
