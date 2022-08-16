import { useState, SyntheticEvent, useCallback } from 'react';

import {
  FormControl,
  FormErrorMessage,
  InputLeftElement,
  InputGroup,
  Input,
} from '@chakra-ui/react';

import { InputControlProps } from '../form.constants';
import InputTag from './input-tag.component';

const InputControl = ({
  register,
  name,
  isRequired = false,
  defaultValue,
  leftElementValue,
  errors,
  hasTags = false,
  onTagsChange = () => {},
  onBlurInput = () => {},
  fontSize = 'sm',
  ...props
}: InputControlProps) => {
  const [tags, setTags] = useState<string[]>(hasTags ? defaultValue || [] : []);

  const defaultArgs = {
    paddingLeft: '28',
    variant: 'flushed',
    defaultValue: hasTags ? '' : defaultValue,
  };

  const leftElementArgs = (children: any): any => ({
    children,
    pointerEvents: 'none',
    color: 'base.gray.09.value',
    fontSize,
    justifyContent: 'flex-start',
    fontWeight: 'semibold',
    w: '28',
  });

  const handleTagsChange = useCallback(
    (event: SyntheticEvent, tags: string[]) => {
      setTags(tags);
      onTagsChange(tags);
    },
    [onTagsChange]
  );

  const handleBlur = useCallback(
    (e: any) => {
      if (!e) {
        return;
      }
      const { target: { value = null } = {} } = e || {};
      if (value !== null) {
        onBlurInput(name, value);
      }
    },
    [onBlurInput]
  );

  return (
    <FormControl isInvalid={errors && errors['name']} isRequired>
      <InputGroup>
        {leftElementValue!! && (
          <InputLeftElement
            {...leftElementArgs(leftElementValue)}
          ></InputLeftElement>
        )}
        {hasTags ? (
          <InputTag
            tags={tags}
            onTagsChange={handleTagsChange}
            id={name}
            {...props}
            {...defaultArgs}
            {...register(name, {
              required: 'This is required',
              onBlur: handleBlur,
            })}
          ></InputTag>
        ) : (
          <Input
            id={name}
            {...props}
            {...defaultArgs}
            {...register(name, {
              required: 'This is required',
              onBlur: handleBlur,
            })}
          />
        )}

        <FormErrorMessage>
          {errors && errors['name'] && errors['name']['message']}
        </FormErrorMessage>
      </InputGroup>
    </FormControl>
  );
};

export default InputControl;
