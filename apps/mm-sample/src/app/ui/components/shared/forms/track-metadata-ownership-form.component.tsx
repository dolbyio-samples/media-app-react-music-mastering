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

const TrackMetadataOwnershipForm = ({
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
              name: FormRegisterKeys.TrackInputArtist,
              leftElementValue: 'Album artist',
              defaultValue: track?.metadata?.artist,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputIRSC,
              leftElementValue: 'IRSC',
              defaultValue: track?.metadata?.irsc,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputLyricist,
              leftElementValue: 'Lyricist',
              defaultValue: track?.metadata?.lyricist,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputComposer,
              leftElementValue: 'Composer',
              defaultValue: track?.metadata?.composer,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputISWC,
              leftElementValue: 'ISWC',
              defaultValue: track?.metadata?.iswc,
              errors: formState.errors,
            })}
          />
        </VStack>
        <VStack w={'full'}>
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputCopyright,
              leftElementValue: 'Copyright',
              defaultValue: track?.metadata?.copyright,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputPublisher,
              leftElementValue: 'Publisher',
              defaultValue: track?.metadata?.publisher,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputBand,
              leftElementValue: 'Band',
              defaultValue: track?.metadata?.band,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputConductor,
              leftElementValue: 'Conductor',
              defaultValue: track?.metadata?.conductor,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputUPC,
              leftElementValue: 'UPC',
              defaultValue: track?.metadata?.upc,
              errors: formState.errors,
            })}
          />
        </VStack>
      </HStack>
    </form>
  );
};

export default TrackMetadataOwnershipForm;
