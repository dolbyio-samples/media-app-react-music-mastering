import './track-waveform.scss';

import { forwardRef, useRef, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import WaveSurfer from 'wavesurfer.js';

import { Waveform, WaveformProps } from '@dolbyio/media-uikit-react';

import {
  tracksActions,
  TracksEntity,
} from 'apps/mm-sample/src/app/store/slices';

const TrackWaveform = forwardRef<
  HTMLElement,
  { track: TracksEntity } & Partial<WaveformProps>
>(
  (
    {
      track,
      onReady = () => {},
      ...props
    }: { track: TracksEntity } & Partial<WaveformProps>,
    ref?: any
  ) => {
    if (!track) {
      return null;
    }
    let waveformRef = ref;
    if (!waveformRef) {
      waveformRef = useRef<WaveSurfer>();
    }
    const dispatch = useDispatch();

    useEffect(() => {
      return () => {
        const waveform = waveformRef?.current?.$waveform;
        if (waveform) {
          waveform.unAll();
        }
      };
    }, []);

    useEffect(() => {
      const playRegionOnUpdate = () => {
        const waveform = waveformRef?.current?.$waveform as WaveSurfer;
        if (!waveformRef?.current?.loopActive) {
          return;
        }
        if (waveform.isPlaying()) {
          if (
            waveform.regions?.list['preview-window'].start >
              waveform.getCurrentTime() ||
            waveform.regions?.list['preview-window'].end <
              waveform.getCurrentTime()
          ) {
            waveform.regions?.list['preview-window'].playLoop();
          }
        } else {
          waveform.regions?.list['preview-window'].playLoop();
        }
      };
      const waveform = waveformRef?.current?.$waveform;
      if (!waveform || waveform.registered) {
        return;
      }
      waveform.on('region-update-end', playRegionOnUpdate);
      waveform.registered = true;
    });

    const handleOnReady = () => {
      onReady();
      const { start, end } =
        ref?.current?.$waveform?.regions?.list['preview-window'] || {};
      // Update initial window value, falsy check except 0
      if ((!start && start !== 0) || (!end && end !== 0)) {
        return;
      }
      dispatch(
        tracksActions.updateWaveformPreview({
          id: track.id,
          start: ref?.current?.$waveform?.regions.list['preview-window'].start,
          end: ref?.current?.$waveform?.regions.list['preview-window'].end,
        })
      );
    };

    const updateWaveformPreviewOnDrag = ({
      start,
      end,
    }: {
      start: number;
      end: number;
    }) => {
      const { id } = track;
      dispatch(
        tracksActions.updateWaveformPreviewOnDrag({
          id,
          ...normalizePreviewWindow({ start, end }),
        })
      );
    };

    const normalizePreviewWindow = ({
      start,
      end,
    }: {
      start: number;
      end: number;
    }) => {
      let newStart = start;
      if (newStart < 0) {
        newStart = 0;
      }
      return {
        start: newStart,
        end,
      };
    };

    return (
      <Waveform
        onReady={handleOnReady}
        {...props}
        ref={waveformRef}
        url={track?.localBlobUrl || ''}
        onPreviewWindowChange={updateWaveformPreviewOnDrag}
        preview={{
          start: track.waveform?.preview?.start,
          end: track.waveform?.preview?.end,
        }}
      ></Waveform>
    );
  }
);

export default TrackWaveform;
