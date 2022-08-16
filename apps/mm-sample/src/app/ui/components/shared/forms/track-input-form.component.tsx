/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useForm } from 'react-hook-form';

import { InputGroup, VStack } from '@chakra-ui/react';

import { TracksEntity } from 'apps/mm-sample/src/app/store/slices';
import useTracks from '../../../hooks/track-data.ui-hook';

import {
  FormProps,
  FormRegisterKeys,
  InputControlProps,
} from './form.constants';
import InputControl from './input/input-control.component';

const TrackInputForm = ({
  onSubmit = () => {},
  isReadOnly = false,
  track,
}: FormProps & { track: TracksEntity }) => {
  const {
    form: { saveTrackFormValueToStore, saveTrackTagsValueToStore },
  } = useTracks();
  const { handleSubmit, register, formState } = useForm();

  const trackFormArgs = (args: Partial<InputControlProps>): InputControlProps =>
    ({
      ...args,
      fontSize: 'md',
      isReadOnly,
      onBlurInput: saveTrackFormValueToStore(track),
    } as InputControlProps);

  return (
    <form
      css={css`
        width: 100%;
      `}
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputGroup>
        <VStack w={'full'} spacing={'8'}>
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputTitle,
              defaultValue: track?.metadata?.title || track?.fileName || '',
              placeholder: 'Title name',
              leftElementValue: 'Title',
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputArtist,
              defaultValue: track?.metadata?.artist || '',
              placeholder: 'Artist name',
              leftElementValue: 'Artist',
              errors: formState.errors,
            })}
          />
          <InputControl
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputGenre,
              defaultValue: track?.metadata?.genre || '',
              placeholder: 'Genre type',
              leftElementValue: 'Genre',
              errors: formState.errors,
            })}
          />
          <InputControl
            hasTags={true}
            onTagsChange={saveTrackTagsValueToStore(track)}
            {...trackFormArgs({
              register,
              name: FormRegisterKeys.TrackInputTags,
              defaultValue: track?.metadata?.tags || [],
              placeholder: 'Add tags to describe the mood of your track',
              leftElementValue: 'Tags',
              errors: formState.errors,
            })}
          />
        </VStack>
      </InputGroup>
    </form>
  );
};

export default TrackInputForm;
