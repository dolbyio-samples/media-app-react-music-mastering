import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, HStack } from '@chakra-ui/layout';

import {
  selectTrackById,
  tracksActions,
  TracksEntity,
} from 'apps/mm-sample/src/app/store/slices';
import { FormProps } from '../forms/form.constants';

import TrackInputForm from '../forms/track-input-form.component';
import TrackImageUploadForm from '../forms/track-image-upload-form.component';
import { getAudioName } from '../../../../utils/file.utils';

const coverArt = [
  'breaking-free.png',
  'long-walk-to-freedom.png',
  'what-a-time.png',
  'naina.png',
  'the-day-i-learned-to-cry.png',
  'wishing-well.png',
];

const TrackInput = ({ trackId, ...props }: FormProps & { trackId: string }) => {
  if (!trackId) {
    return null;
  }
  const dispatch = useDispatch();
  const track = useSelector(selectTrackById(trackId));
  if (!track) {
    return null;
  }

  const ifExists = (imgNme: string) => {
    return coverArt.includes(imgNme);
  };

  var imageName = getAudioName(trackId).toLowerCase() + '.png';
  var imagePath = '/assets/cover-art/' + imageName;

  imagePath = ifExists(imageName)
    ? imagePath
    : '/assets/svg/default-album-art.svg';

  useEffect(() => {
    if (track.metadata && track.metadata.albumArtSrc) {
      return;
    }
    dispatch(
      tracksActions.upsertOne({
        ...track,
        metadata: {
          ...track.metadata,
          albumArtSrc: imagePath,
        },
      })
    );
  }, []);

  return (
    <HStack
      w={'full'}
      height={'min-content'}
      spacing={'8'}
      bgColor={'white'}
      pt={'8'}
      pr={'12'}
      pl={'12'}
      pb={'8'}
    >
      <Box>
        <TrackImageUploadForm
          trackId={track.id}
          albumArtSrc={
            track.metadata?.albumArtSrc || '/assets/svg/default-album-art.svg'
          }
        />
      </Box>
      {/* flexGrow=1 fills the remaining space */}
      <Box flexGrow={1}>
        <TrackInputForm track={track} {...props} />
      </Box>
    </HStack>
  );
};

export default TrackInput;
