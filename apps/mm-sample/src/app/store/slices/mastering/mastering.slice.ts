import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import MapiJobProcessor from 'apps/mm-sample/src/app/utils/mapi-job-processor';
import { MasteringOutput } from 'apps/mm-sample/src/app/utils/mapi-job-processor.types';

import { ReactComponent as BubblyIcon } from 'apps/mm-sample/src/assets/svg/bubbly.svg';
import { ReactComponent as OasisIcon } from 'apps/mm-sample/src/assets/svg/oasis.svg';
import { ReactComponent as BouncyIcon } from 'apps/mm-sample/src/assets/svg/bouncy.svg';
import { ReactComponent as ThumpIcon } from 'apps/mm-sample/src/assets/svg/thump.svg';
import { ReactComponent as RumbleIcon } from 'apps/mm-sample/src/assets/svg/rumble.svg';
import { ReactComponent as AmbianceIcon } from 'apps/mm-sample/src/assets/svg/ambiance.svg';
import { ReactComponent as CrystalIcon } from 'apps/mm-sample/src/assets/svg/crystal.svg';

import { ReactComponent as ElectricIcon } from 'apps/mm-sample/src/assets/svg/electric.svg';
import { ReactComponent as BalanceIcon } from 'apps/mm-sample/src/assets/svg/balance.svg';
import { ReactComponent as SkyscraperIcon } from 'apps/mm-sample/src/assets/svg/skyscraper.svg';
import { ReactComponent as HilltopIcon } from 'apps/mm-sample/src/assets/svg/hilltop.svg';
import { ReactComponent as LiftIcon } from 'apps/mm-sample/src/assets/svg/lift.svg';
import { ReactComponent as ShimmerIcon } from 'apps/mm-sample/src/assets/svg/shimmer.svg';
import { ReactComponent as SubtleIcon } from 'apps/mm-sample/src/assets/svg/subtle.svg';

import { RootState } from '../../configureAppStore';
import { fetchTracks, TracksEntity } from 'apps/mm-sample/src/app/store/slices';

export type MasteringApiThunkParams = {
  inputKey: string;
  outputKeys: string[];
  presets: (MasteringPresets | CustomMasteringPresets)[];
  variant: MasteringApiOptions;
};

export enum MasteringApiOptions {
  Master = 'master',
  Preview = 'preview',
}

export enum MasteringPresets {
  Bubbly = 'a',
  Oasis = 'b',
  Bouncy = 'c',
  Thump = 'd',
  Rumble = 'e',
  Ambiance = 'f',
  Crystal = 'g',
  Electric = 'h',
  Balance = 'i',
  Skyscraper = 'j',
  Hilltop = 'k',
  Lift = 'l',
  Shimmer = 'm',
  Subtle = 'n',
}

export enum CustomMasteringPresets {
  Trimmed = 'trimmed',
}

export const MasteringPresetsMap: {
  [key in MasteringPresets]: {
    icon: React.FunctionComponent;
    description: string;
    waveProgressColor: string;
    suggestedGenres: string[];
  };
} = {
  [MasteringPresets.Bubbly]: {
    icon: BubblyIcon,
    waveProgressColor: '#4446be',
    description:
      'Tight dynamics and ample brightness in the upper frequencies.',
    suggestedGenres: ['Pop'],
  },
  [MasteringPresets.Oasis]: {
    icon: OasisIcon,
    waveProgressColor: '#6468dd',
    description:
      'Tight dynamics, a solid low-end, and mid-frequency clarity for vocal emphasis.',
    suggestedGenres: ['Club', 'EDM'],
  },
  [MasteringPresets.Bouncy]: {
    icon: BouncyIcon,
    waveProgressColor: '#9161e0',
    description: 'Big bass presence and tight dynamics.',
    suggestedGenres: ['Hip hop'],
  },
  [MasteringPresets.Thump]: {
    icon: ThumpIcon,
    waveProgressColor: '#23bd78',
    description: 'Heavy bass and sub-bass presence.',
    suggestedGenres: ['Hip hop'],
  },
  [MasteringPresets.Rumble]: {
    icon: RumbleIcon,
    waveProgressColor: '#43c9ac',
    description:
      'Big bass and sub-bass presence with additional openness in the mid and high frequencies.',
    suggestedGenres: ['Hip hop', 'Trap'],
  },
  [MasteringPresets.Ambiance]: {
    icon: AmbianceIcon,
    waveProgressColor: '#319aad',
    description: 'Wide low-end processing with a light and ethereal tone.',
    suggestedGenres: ['Lighter electronic', 'EDM'],
  },
  [MasteringPresets.Crystal]: {
    icon: CrystalIcon,
    waveProgressColor: '#45a9e6',
    description: 'Wide low-end processing with dark and moody tone.',
    suggestedGenres: ['Darker electronic', 'EDM'],
  },
  [MasteringPresets.Electric]: {
    icon: ElectricIcon,
    waveProgressColor: '#953791',
    description:
      'Wide dynamics and ample openness in the mids and highs to allow for a wide spectrum of sound.',
    suggestedGenres: ['Electronic', 'EDM'],
  },
  [MasteringPresets.Balance]: {
    icon: BalanceIcon,
    waveProgressColor: '#bf40ba',
    description: 'Tight dynamics, and a well rounded, balanced tone.',
    suggestedGenres: ['Pop', 'Rock', 'Country'],
  },
  [MasteringPresets.Skyscraper]: {
    icon: SkyscraperIcon,
    waveProgressColor: '#df479b',
    description:
      'Smooth, tight dynamics, and a light lift in the upper frequencies.',
    suggestedGenres: ['Rock', 'Country'],
  },
  [MasteringPresets.Hilltop]: {
    icon: HilltopIcon,
    waveProgressColor: '#f5745a',
    description: 'Wide dynamics with a solid low and mid-frequency boost.',
    suggestedGenres: ['Pop'],
  },
  [MasteringPresets.Lift]: {
    icon: LiftIcon,
    waveProgressColor: '#fe9c11',
    description: 'Emphasis on the mid-frequencies to highlight vocals.',
    suggestedGenres: ['Vocal'],
  },
  [MasteringPresets.Shimmer]: {
    icon: ShimmerIcon,
    waveProgressColor: '#ff544f',
    description:
      'Light touch with ample mid-frequency clarity to let acoustic instruments shine in the mix.',
    suggestedGenres: ['Folk', 'Acoustic'],
  },
  [MasteringPresets.Subtle]: {
    icon: SubtleIcon,
    waveProgressColor: '#ff3c8a',
    description:
      'Wide dynamics, and warm full tones for orchestral instruments.',
    suggestedGenres: ['Classical'],
  },
};

export enum MasteringStep {
  Upload,
  Details,
  ChoosePresets,
  Audition,
  // Payment,
  Mastered,
}

export const MasteringHeaders = {
  [MasteringStep.Upload]: null,
  [MasteringStep.Details]: 'Add details and preview',
  [MasteringStep.ChoosePresets]: 'Choose your presets',
  [MasteringStep.Audition]: 'Audition',
  // [MasteringStep.Payment]: 'Payment',
  [MasteringStep.Mastered]: 'Mastered',
};

export const MASTERING_FEATURE_KEY = 'mastering';

export interface MasteringState {
  trackId: string;
  previewTrackIds: string[];
  masteredTrackId: string;
  trimmedTrackId: string;
  currentStep: MasteringStep;
  furthestStep: MasteringStep;
  presets: MasteringPresets[];
  selectedPreset: MasteringPresets | null;
  loudness: number | null;
  intensity: number | null;
  apiProgress: number | null;
  apiIsDone: boolean;
  canProceedSteps: MasteringStep[];
  disableAllStepTabs: boolean;
}

export const initialMasteringState: MasteringState = {
  trackId: '',
  previewTrackIds: [],
  masteredTrackId: '',
  trimmedTrackId: '',
  currentStep: MasteringStep.Upload,
  furthestStep: MasteringStep.Upload,
  canProceedSteps: [MasteringStep.Upload, MasteringStep.Details],
  presets: [],
  selectedPreset: null,
  loudness: null,
  intensity: null,
  apiProgress: null,
  apiIsDone: false,
  disableAllStepTabs: false,
};

export const callMusicMasteringApi = createAsyncThunk<
  string | null,
  MasteringApiThunkParams,
  { state: RootState }
>(
  'mastering/callMusicMasteringApi',
  async (
    {
      inputKey,
      outputKeys = [],
      presets = [],
      variant = MasteringApiOptions.Preview,
    },
    thunkAPI
  ) => {
    const {
      mastering: { trackId, loudness, intensity },
      tracks: { entities },
    } = thunkAPI.getState();
    const rawTrack = entities[trackId];

    thunkAPI.dispatch(masteringActions.updateApiProgress(0));

    if (!rawTrack) {
      return null;
    }

    const intense = {
      intensity: intensity,
    };

    try {
      const { waveform: { preview: { start = 45, end = 75 } = {} } = {} } =
        rawTrack || {};
      let duration = end - start;
      if (duration > 30) {
        duration = 30;
      }
      if (duration < 0) {
        duration = 0;
      }
      let outputs: MasteringOutput[] = presets.map((preset, index) => {
        if (preset === CustomMasteringPresets.Trimmed) {
          const trimmedTrackConfig = {
            destination: `dlb://${outputKeys[index]}`,
            master: {
              dynamic_eq: { enable: false },
              loudness: { enable: false },
              stereo_image: { enable: false },
            },
          };
          return trimmedTrackConfig;
        }
        return {
          destination: `dlb://${outputKeys[index]}`,
          master: {
            dynamic_eq: {
              enable: true,
              preset,
              ...(variant === MasteringApiOptions.Master && intense),
            },
            loudness: { enable: true, target_level: loudness! },
          },
        };
      });
      const mapiJobProcessor = new MapiJobProcessor();
      await mapiJobProcessor.processApiJob({
        requestParams: {
          endpoint:
            variant === MasteringApiOptions.Preview
              ? '/media/master/preview'
              : '/media/master',
          body: {
            inputs: [
              {
                source: `dlb://${inputKey}`,
                ...(variant === MasteringApiOptions.Preview && {
                  segment: {
                    start,
                    duration,
                  },
                }),
              },
            ],
            outputs,
          },
        },
        requestCallbacks: {
          onResponse: () => {
            thunkAPI.dispatch(fetchTracks(outputKeys));
            thunkAPI.fulfillWithValue(null);
          },
          onProgress: (progress: number) =>
            thunkAPI.dispatch(masteringActions.updateApiProgress(progress)),
        },
      });
    } catch (err) {
      console.error('Failed to fetch tracks', { err });
      thunkAPI.rejectWithValue(null);
    }
    return null;
  }
);

export const masteringSlice = createSlice({
  name: MASTERING_FEATURE_KEY,
  initialState: initialMasteringState,
  reducers: {
    disableAllStepTabs: (state) => {
      return { ...state, disableAllStepTabs: true };
    },
    enableAllStepTabs: (state) => {
      return { ...state, disableAllStepTabs: false };
    },
    updateTrackId: (state, action: PayloadAction<string>) => {
      return { ...state, trackId: action.payload };
    },
    updateApiProgress: (state, action: PayloadAction<number>) => {
      return { ...state, apiProgress: action.payload };
    },
    updateCurrentStep: (state, action: PayloadAction<MasteringStep>) => {
      const currentStep = action.payload;
      const newFurthestStep =
        currentStep > state.furthestStep ? currentStep : state.furthestStep;
      return { ...state, currentStep, furthestStep: newFurthestStep };
    },
    updateCanProceedStep: (state, action: PayloadAction<MasteringStep>) => {
      const index = state.canProceedSteps.indexOf(action.payload);
      if (index > -1) {
        return state;
      }
      return {
        ...state,
        canProceedSteps: [...state.canProceedSteps, action.payload].sort(),
      };
    },
    updateCannotProceedStep: (state, action: PayloadAction<MasteringStep>) => {
      const newCanProceedSteps = [...state.canProceedSteps];
      const index = newCanProceedSteps.indexOf(action.payload);
      if (index > -1) {
        newCanProceedSteps.splice(index, 1);
      }
      return { ...state, canProceedSteps: [...newCanProceedSteps] };
    },
    updateMasteredTrackId: (state, action: PayloadAction<string>) => {
      return { ...state, masteredTrackId: action.payload };
    },
    updateTrimmedTrackId: (state, action: PayloadAction<string>) => {
      return { ...state, trimmedTrackId: action.payload };
    },
    updatePreviewTrackIds: (state, action: PayloadAction<string[]>) => {
      return { ...state, previewTrackIds: [...action.payload] };
    },
    addPreset: (state, action: PayloadAction<MasteringPresets>) => {
      const index = state.presets.indexOf(action.payload);
      if (index > -1) {
        return state;
      }
      return { ...state, presets: [...state.presets, action.payload] };
    },
    removePreset: (state, action: PayloadAction<MasteringPresets>) => {
      const newPresets = [...state.presets];
      const index = newPresets.indexOf(action.payload);
      if (index > -1) {
        newPresets.splice(index, 1);
      }
      return { ...state, presets: [...newPresets] };
    },
    updateSelectedPreset: {
      reducer: (state, action: PayloadAction<MasteringPresets | null>) => {
        return { ...state, selectedPreset: action.payload };
      },
      prepare: (payload: any) => ({
        payload,
        meta: {
          debounce: {
            time: 500,
          },
        },
      }),
    },
    updateLoudness: {
      reducer: (state, action: PayloadAction<number>) => {
        return {
          ...state,
          loudness: action.payload,
        };
      },
      prepare: (payload: any) => ({
        payload,
        meta: {
          debounce: {
            time: 500,
          },
        },
      }),
    },
    updateIntensity: {
      reducer: (state, action: PayloadAction<number>) => {
        return {
          ...state,
          intensity: action.payload,
        };
      },
      prepare: (payload: any) => ({
        payload,
        meta: {
          debounce: {
            time: 500,
          },
        },
      }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callMusicMasteringApi.pending, (state: MasteringState) => {
        return { ...state, apiIsDone: false, apiProgress: 0 };
      })
      .addCase(
        fetchTracks.fulfilled,
        (state: MasteringState, action: PayloadAction<TracksEntity[]>) => {
          return { ...state, apiIsDone: true };
        }
      );
  },
});

/*
 * Export reducer for store configuration.
 */
export const masteringReducer = masteringSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch, useSelector } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(masteringActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const masteringActions = masteringSlice.actions;
