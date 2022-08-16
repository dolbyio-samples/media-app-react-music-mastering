import { useRef, forwardRef } from 'react';

import { Box, VStack } from '@chakra-ui/react';

import { WaveformProps } from '@dolbyio/media-uikit-react';

import { TracksEntity } from 'apps/mm-sample/src/app/store/slices';
import TrackWaveform from './track-waveform.component';
import TrackDataDisplay from './track-data-display.component';

const Track = forwardRef<
  HTMLElement,
  { track: TracksEntity } & Partial<WaveformProps>
>(
  (
    {
      track,
      onReady,
      ...props
    }: { track: TracksEntity } & Partial<WaveformProps>,
    ref?: any
  ) => {
    if (!track || !track?.localBlobUrl) {
      return null;
    }

    let waveformRef = ref;
    if (!waveformRef) {
      waveformRef = useRef();
    }

    const { fileName = '', metadata: { title = '', artist = '' } = {} } = track;
    return (
      <Box
        {...props}
        w={'full'}
        p={10}
        borderRadius={'6px'}
        backgroundColor={'white'}
      >
        <VStack w={'full'} spacing={'4'}>
          <Box w={'full'}>
            <TrackDataDisplay
              artist={artist}
              title={title || fileName}
              imgSrc={
                track.metadata?.albumArtSrc ||
                '/assets/svg/default-album-art.svg'
              }
            />
          </Box>
          <Box w={'full'}>
            <TrackWaveform
              ref={waveformRef}
              track={track}
              onReady={onReady}
              {...props}
            />
          </Box>
        </VStack>
      </Box>
    );
  }
);

export default Track;
