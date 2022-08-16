import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/configureAppStore';

import {
  selectAllTracks,
  tracksActions,
  TracksEntity,
  selectTrackById,
} from '../../store/slices/tracks/tracks.slice';
import {
  FormRegisterKeys,
  TrackFormToEntityKey,
} from '../components/shared/forms/form.constants';

const useTracks = () => {
  const dispatch = useDispatch();
  const tracks: TracksEntity[] = useSelector(selectAllTracks);
  const rawTrackId = useSelector((state: RootState) => state.mastering.trackId);
  const rawTrack = useSelector(selectTrackById(rawTrackId));
  const trimmedTrackId = useSelector(
    (state: RootState) => state.mastering.trimmedTrackId
  );
  const trimmedTrack = useSelector(selectTrackById(trimmedTrackId));

  const saveTrackFormValueToStore =
    (track: TracksEntity) => (name: FormRegisterKeys, value: string) => {
      // Ignore tags as they are handled differently
      if (
        !track ||
        !name ||
        !value ||
        name === FormRegisterKeys.TrackInputTags
      ) {
        return;
      }
      const trackEntityStoreKey = TrackFormToEntityKey[
        name as FormRegisterKeys
      ] as string;
      const payload = {
        ...track,
        metadata: {
          ...track?.metadata,
          [trackEntityStoreKey]: value,
        },
      };
      dispatch(tracksActions.upsertOne(payload as TracksEntity));
    };

  const saveTrackTagsValueToStore =
    (track: TracksEntity) =>
    (tags: string[] = []) => {
      dispatch(
        tracksActions.upsertOne({
          ...track,
          metadata: {
            ...track?.metadata,
            tags,
          },
        } as TracksEntity)
      );
    };

  return {
    tracks,
    rawTrack,
    trimmedTrack,
    form: {
      saveTrackFormValueToStore,
      saveTrackTagsValueToStore,
    },
  };
};

export default useTracks;
