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

const TrackMetadataRecordingForm = ({
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
              name: FormRegisterKeys.TrackInputEngineer,
              leftElementValue: 'Engineer',
              defaultValue: track?.metadata?.engineer,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputProductionStudio,
              leftElementValue: 'Production studio',
              defaultValue: track?.metadata?.productionStudio,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputRecordingDate,
              leftElementValue: 'Recording date',
              defaultValue: track?.metadata?.recordingDate,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputInitialKey,
              leftElementValue: 'Initial key',
              defaultValue: track?.metadata?.initialKey,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputMedium,
              leftElementValue: 'Medium',
              defaultValue: track?.metadata?.medium,
              errors: formState.errors,
            })}
          />
        </VStack>
        <VStack w={'full'}>
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputProducedBy,
              leftElementValue: 'Produced by',
              defaultValue: track?.metadata?.producedBy,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputSoftware,
              leftElementValue: 'Software',
              defaultValue: track?.metadata?.software,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputTechnician,
              leftElementValue: 'Technician',
              defaultValue: track?.metadata?.technician,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputBPM,
              leftElementValue: 'BPM',
              defaultValue: track?.metadata?.bpm,
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputEncodedBy,
              leftElementValue: 'Encoded by',
              defaultValue: track?.metadata?.encodedBy,
              errors: formState.errors,
            })}
          />
        </VStack>
      </HStack>
    </form>
  );
};

export default TrackMetadataRecordingForm;
