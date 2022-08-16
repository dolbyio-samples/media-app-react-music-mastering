import { useCallback } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';

import { Tag as ChakraTag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import type {
  TagProps,
  TagLabelProps,
  TagCloseButtonProps,
} from '@chakra-ui/react';

export type ChakraTagInputTagProps = TagProps & {
  children: string;
  onRemove?(event: SyntheticEvent): void;
  tagLabelProps?: TagLabelProps;
  tagCloseButtonProps?: TagCloseButtonProps;
  isReadOnly?: boolean;
};

const Tag = ({
  children,
  onRemove,
  tagLabelProps,
  tagCloseButtonProps,
  isReadOnly = false,
  ...props
}: ChakraTagInputTagProps) => {
  const onTagCloseButtonClick = tagCloseButtonProps?.onClick;
  const handleClickTagCloseButton = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onTagCloseButtonClick?.(event);
      if (event.isDefaultPrevented()) return;

      onRemove?.(event);
    },
    [onRemove, onTagCloseButtonClick]
  );
  return (
    <ChakraTag {...props}>
      <TagLabel {...tagLabelProps}>{children}</TagLabel>
      {!isReadOnly && (
        <TagCloseButton
          {...tagCloseButtonProps}
          onClick={handleClickTagCloseButton}
        />
      )}
    </ChakraTag>
  );
};

export default Tag;
