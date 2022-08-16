import { Image, Box } from '@chakra-ui/react';
import { RootState } from 'apps/mm-sample/src/app/store/configureAppStore';

import {
  MasteringStep,
  selectTrackById,
  tracksActions,
  TracksEntity,
} from 'apps/mm-sample/src/app/store/slices';

import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { FormRegisterKeys } from './form.constants';
import FileUploadForm from './input/file-upload-form.component';

const TrackImageUploadForm = ({
  trackId,
  albumArtSrc,
}: {
  trackId: string;
  albumArtSrc: string;
}) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.mastering.currentStep
  );
  const track = useSelector(selectTrackById(trackId));
  const { handleSubmit, control } = useForm();

  const onSubmit = (data: FieldValues) => {
    if (!track) {
      return;
    }
    const file = data[FormRegisterKeys.TrackInputImage];
    const albumArtSrc = URL.createObjectURL(file);
    dispatch(
      tracksActions.upsertOne({
        ...track,
        metadata: { ...track!.metadata, albumArtSrc },
      } as TracksEntity)
    );
  };

  return (
    <FileUploadForm
      allowMultipleFiles={false}
      name={FormRegisterKeys.TrackInputImage}
      acceptFileTypes={'.svg,.png,.jpeg,.webp'}
      control={control}
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        style={{
          cursor:
            currentStep !== MasteringStep.Mastered ? 'pointer' : 'default',
          pointerEvents:
            currentStep !== MasteringStep.Mastered ? 'auto' : 'none',
        }}
      >
        <Image
          src={albumArtSrc}
          margin="auto"
          width={'80'}
          height={'80'}
        ></Image>
        {currentStep !== MasteringStep.Mastered && (
          <Image
            style={{ position: 'absolute', bottom: '5px', right: '5px' }}
            src={'assets/svg/plus.svg'}
          />
        )}
      </Box>
    </FileUploadForm>
  );
};

export default TrackImageUploadForm;
