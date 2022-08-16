import { HStack, VStack } from '@chakra-ui/layout';

import { useForm } from 'react-hook-form';

import useTracks from '../../../hooks/track-data.ui-hook';

import InputControl from './input/input-control.component';
import {
  FormProps,
  FormRegisterKeys,
  InputControlProps,
} from './form.constants';
import { TracksEntity } from 'apps/mm-sample/src/app/store/slices';

const TrackMetadataGeneralForm = ({
  onSubmit = () => {},
  isReadOnly = false,
  track,
}: FormProps & { track: TracksEntity }) => {
  const {
    form: { saveTrackFormValueToStore },
  } = useTracks();
  const { handleSubmit, register, formState } = useForm();

  const trackFormArgs = (args: Partial<InputControlProps>): InputControlProps =>
    ({
      ...args,
      isReadOnly,
      onBlurInput: saveTrackFormValueToStore(track),
    } as InputControlProps);

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
      <HStack w={'full'} align={'stretch'} spacing={'12'}>
        <VStack w={'full'}>
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputAlbum,
              leftElementValue: 'Album',
              defaultValue: track?.metadata?.album,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputTitle,
              leftElementValue: 'Track',
              defaultValue: track?.metadata?.title,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputLanguage,
              leftElementValue: 'Language',
              defaultValue: track?.metadata?.language,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputDiscNumber,
              leftElementValue: 'Disc #',
              defaultValue: track?.metadata?.discNumber,
              errors: formState.errors,
            })}
          />
        </VStack>
        <VStack w={'full'}>
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputReleaseTitle,
              leftElementValue: 'Release title',
              defaultValue: track?.metadata?.releaseTitle,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputCreationDate,
              leftElementValue: 'Creation date',
              defaultValue: track?.metadata?.creationDate,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputCompilation,
              leftElementValue: 'Compilation',
              defaultValue: track?.metadata?.isCompilation,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputExplicitContent,
              leftElementValue: 'Explicit content',
              defaultValue: track?.metadata?.hasExplicitContent,
              errors: formState.errors,
            })}
          />
        </VStack>
      </HStack>
    </form>
  );
};

export default TrackMetadataGeneralForm;
