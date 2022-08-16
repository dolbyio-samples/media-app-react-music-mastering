import React, { useRef } from 'react';

import {
  Input,
  FormControl,
  InputGroup,
  FormErrorMessage,
  Center,
  Stack,
} from '@chakra-ui/react';

import { useController } from 'react-hook-form';

import { FormProps, FormRegisterKeys } from '../form.constants';
import FileDragAndDrop from './file-drag-and-drop.component';

export interface FileUploadFormProps {
  name: string;
  acceptedFileTypes?: string;
  control: any;
  children: React.ReactNode;
  allowMultipleFiles?: boolean;
  isRequired?: boolean;
  onSubmit?: Function;
  dragAndDrop?: boolean;
}

export const FileUploadForm = ({
  name,
  acceptedFileTypes,
  control,
  children,
  allowMultipleFiles = false,
  isRequired = false,
  onSubmit = () => {},
  dragAndDrop = false,
}: FormProps & FileUploadFormProps) => {
  const inputRef = useRef<any>();
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      return React.cloneElement<any>(child, {
        onClick: () => {
          inputRef &&
            inputRef.current &&
            inputRef.current.click &&
            inputRef.current.click();
        },
      });
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl isInvalid={invalid} isRequired>
        <InputGroup>
          <Stack direction={'column'}>
            <input
              // @ts-ignore
              name={name}
              type="file"
              // @ts-ignore
              onChange={(e) => {
                if (!e || !e.target || !e.target.files) {
                  return;
                }
                onChange(e.target.files[0]);
                onSubmit(e.target.files[0]);
              }}
              accept={acceptedFileTypes}
              // @ts-ignore
              ref={inputRef}
              {...inputProps}
              style={{ display: 'none' }}
              multiple={allowMultipleFiles}
            />
            <Center>
              {dragAndDrop && (
                <FileDragAndDrop
                  onDrop={(item) => {
                    onChange(item.files[0]);
                    onSubmit(item.files[0]);
                  }}
                >
                  {renderChildren()}
                </FileDragAndDrop>
              )}
              {!dragAndDrop && renderChildren()}
            </Center>
          </Stack>
        </InputGroup>
        <FormErrorMessage>{invalid}</FormErrorMessage>
      </FormControl>
    </form>
  );
};

FileUploadForm.defaultProps = {
  allowMultipleFiles: false,
  name: FormRegisterKeys.AudioUpload,
};

export default FileUploadForm;
