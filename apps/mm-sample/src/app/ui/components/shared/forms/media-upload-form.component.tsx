import React, { useState, useCallback, useEffect } from 'react';

import { Stack, useToast } from '@chakra-ui/react';

import { FieldValues, useForm } from 'react-hook-form';

import { TracksEntity } from '../../../../store/slices';

import useAccount from '../../../hooks/account-data.ui-hook';
import useDolbyStorage from '../../../../utils/dolby-storage-client.utils';

import FileUploadForm, {
  FileUploadFormProps,
} from './input/file-upload-form.component';
import { FormRegisterKeys } from './form.constants';

const MediaUploadForm = ({
  onSubmitDone = (trackEntity: TracksEntity) => {},
  onProgressChange = () => {},
  children,
  ...props
}: {
  onSubmitDone: Function;
  onProgressChange?: Function;
  children: React.ReactNode;
} & Partial<FileUploadFormProps>) => {
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const { handleSubmit, control } = useForm();
  const { uploadFile } = useDolbyStorage();
  const { rawDataPrefix } = useAccount();

  useEffect(() => {
    return () => {
      // Set state to resolve "Can't perform a React state update on an unmounted component." memory leak issue
      setProgress(0);
    };
  }, []);

  useEffect(() => {
    onProgressChange(progress);
  }, [progress]);

  const onSubmit = useCallback(
    (data: FieldValues) => {
      const file = data[FormRegisterKeys.AudioUpload];

      uploadFile(`${rawDataPrefix}/${file.name}`, file, {
        onStart: () => setProgress(1),
        onDone: async () => {
          onSubmitDone({
            id: `${rawDataPrefix}/${file.name}`,
            localBlobUrl: URL.createObjectURL(file),
            uploadDate: new Date().toString(),
            fileName: file.name,
          } as TracksEntity);
          toast({
            title: 'Track uploaded.',
            description: "We've uploaded your track for you.",
            status: 'success',
            duration: 7000,
            isClosable: true,
          });
        },
        onError: () => {
          toast({
            title: 'Upload failed!',
            description:
              "We're having some trouble uploading your track. Please try again.",
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        },
      });
    },
    [rawDataPrefix]
  );

  return (
    <FileUploadForm
      {...props}
      isLoading={progress > 0 && progress < 100}
      allowMultipleFiles={false}
      // acceptedFileTypes="audio/*"
      placeholder="Select audio"
      control={control}
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      progress={progress}
      acceptedFileTypes={
        '.m4a,.mp4,.3gp,.m4b,.aac,.aif,.aiff,.aifc,.flac,.mp3,.opus,.ogg,.wav'
      }
    >
      {children}
    </FileUploadForm>
  );
};

export default MediaUploadForm;
