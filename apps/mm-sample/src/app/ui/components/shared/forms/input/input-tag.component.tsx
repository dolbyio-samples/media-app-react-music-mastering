import { forwardRef, useCallback } from 'react';
import type { ForwardedRef, KeyboardEvent, SyntheticEvent } from 'react';
import {
  Input,
  Wrap,
  WrapItem,
  WrapItemProps,
  WrapProps,
  VStack,
  Box,
} from '@chakra-ui/react';
import type {
  InputProps,
  TagProps,
  TagLabelProps,
  TagCloseButtonProps,
} from '@chakra-ui/react';

import Tag from './tag.component';

type MaybeIsInputProps<P> = MaybeFunc<[isInput: boolean, index?: number], P>;
type MaybeTagProps<P> = MaybeFunc<[tag: string, index?: number], P>;

export type ChakraTagInputProps = InputProps & {
  tags?: string[];
  onTagsChange?(event: SyntheticEvent, tags: string[]): void;
  onTagAdd?(event: SyntheticEvent, value: string): void;
  onTagRemove?(event: SyntheticEvent, index: number): void;
  vertical?: boolean;
  addKeys?: string[];
  wrapProps?: WrapProps;
  wrapItemProps?: MaybeIsInputProps<WrapItemProps> | any;
  tagProps?: MaybeTagProps<TagProps>;
  tagLabelProps?: MaybeTagProps<TagLabelProps>;
  tagCloseButtonProps?: MaybeTagProps<TagCloseButtonProps>;
};

export default forwardRef(function InputTag(
  {
    tags = [],
    onTagsChange,
    onTagAdd,
    onTagRemove,
    vertical = false,
    addKeys = ['Enter'],
    wrapProps,
    wrapItemProps,
    tagProps,
    tagLabelProps,
    tagCloseButtonProps,
    ...props
  }: ChakraTagInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const addTag = useCallback(
    (event: SyntheticEvent, tag: string) => {
      onTagAdd?.(event, tag);
      if (event.isDefaultPrevented()) return;

      onTagsChange?.(event, tags.concat([tag]));
    },
    [tags, onTagsChange, onTagAdd]
  );
  const removeTag = useCallback(
    (event: SyntheticEvent, index: number) => {
      onTagRemove?.(event, index);
      if (event.isDefaultPrevented()) return;

      onTagsChange?.(event, [
        ...tags.slice(0, index),
        ...tags.slice(index + 1),
      ]);
    },
    [tags, onTagsChange, onTagRemove]
  );
  const handleRemoveTag = useCallback(
    (index: number) => (event: SyntheticEvent) => {
      removeTag(event, index);
    },
    [removeTag]
  );
  const onKeyDown = props.onKeyDown;
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.isDefaultPrevented()) return;
      if (event.isPropagationStopped()) return;

      const { currentTarget, key } = event;
      const { selectionStart, selectionEnd } = currentTarget;
      if (addKeys.indexOf(key) > -1 && currentTarget.value) {
        addTag(event, currentTarget.value);
        if (!event.isDefaultPrevented()) {
          currentTarget.value = '';
        }
        event.preventDefault();
      } else if (
        key === 'Backspace' &&
        tags.length > 0 &&
        selectionStart === 0 &&
        selectionEnd === 0
      ) {
        removeTag(event, tags.length - 1);
      }
    },
    [addKeys, tags.length, addTag, removeTag, onKeyDown]
  );

  return (
    <VStack w={'full'}>
      <Input
        {...props}
        isReadOnly={props.isReadOnly}
        onKeyDown={handleKeyDown}
        ref={ref}
      />
      <Box w={'full'}>
        <Wrap {...{ ...wrapProps, shouldWrapChildren: true }}>
          {tags.map((tag, index) => (
            <WrapItem {...maybeCall(wrapItemProps, false, index)} key={index}>
              <Tag
                isReadOnly={props.isReadOnly}
                onRemove={handleRemoveTag(index)}
                tagLabelProps={maybeCall(tagLabelProps, tag, index)}
                tagCloseButtonProps={maybeCall(tagCloseButtonProps, tag, index)}
                colorScheme={props.colorScheme}
                size={props.size}
                {...maybeCall(tagProps, tag, index)}
              >
                {tag}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </VStack>
  );
});

type Func<A extends unknown[], R> = (...args: A) => R;
export type MaybeFunc<A extends unknown[], R> = R | Func<A, R>;
export function maybeCall<A extends unknown[], R>(
  maybeFunc: MaybeFunc<A, R>,
  ...args: A
) {
  if (typeof maybeFunc === 'function') {
    return (maybeFunc as Func<A, R>)(...args);
  } else {
    return maybeFunc;
  }
}
