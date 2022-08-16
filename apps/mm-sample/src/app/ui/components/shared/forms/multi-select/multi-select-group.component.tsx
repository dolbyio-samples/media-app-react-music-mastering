import React, { useState, DOMAttributes, useEffect, useCallback } from 'react';

import { Wrap, WrapItem } from '@chakra-ui/layout';
import { IconMultiSelectProps } from './icon-multi-select-button.component';

export type SelectionChangeHandler = (
  change: Partial<MultiSelectEntity> | null,
  newState: Record<string, MultiSelectEntity>
) => void;

interface MultiSelectEntity extends IconMultiSelectProps {}

interface MultiSelectGroupProps {
  onSelectionChange?: SelectionChangeHandler;
  children?: React.ReactNode;
  maxSelection?: number;
  disableOnMax?: boolean;
}

const MultiSelectGroup = ({
  onSelectionChange = (change, newState) => {},
  children,
  maxSelection = Number.MAX_VALUE,
  disableOnMax = false,
}: MultiSelectGroupProps & DOMAttributes<any>) => {
  const [numSelections, setNumSelections] = useState(0);
  const [entities, setEntities] = useState<Record<string, MultiSelectEntity>>(
    {}
  );

  const handleChildClick = useCallback(
    (entity: MultiSelectEntity) => {
      const newEntityState = updateEntity(entity as MultiSelectEntity);
      onSelectionChange(entity, newEntityState);
      updateNumSelectionsOnChange(entity);
    },
    [entities]
  );

  useEffect(() => {
    countFocusedChildren();
    const initialEntityState: Record<string, MultiSelectEntity> | undefined =
      getInitialEntities();
    if (initialEntityState) {
      setEntities(initialEntityState);
      onSelectionChange(null, initialEntityState);
    }
  }, []);

  const getInitialEntities = () => {
    const newEntityState: Record<string, MultiSelectEntity> = {};

    for (let i = 0; i < React.Children.toArray(children).length; i++) {
      const child = React.Children.toArray(children)[i];
      if (!React.isValidElement(child)) {
        return;
      }
      const props = buildChildProps(child, i);
      newEntityState[`${props.id}`] = props;
    }
    return newEntityState;
  };

  const countFocusedChildren = () => {
    let numFocused = 0;
    for (let i = 0; i < React.Children.toArray(children).length; i++) {
      const child = React.Children.toArray(children)[i];
      if (!React.isValidElement(child)) {
        return;
      }
      const { isFocused, focus } = child.props || {};
      if (isFocused || focus) {
        numFocused++;
      }
    }
    updateNumSelections(numFocused);
  };

  const updateNumSelectionsOnChange = (entity: Partial<MultiSelectEntity>) => {
    const increment = entity.isFocused || entity.focus ? 1 : -1;
    updateNumSelections(increment);
  };

  const updateNumSelections = (increment: number) => {
    const next = numSelections + increment;
    if (next < 0) {
      return;
    }
    if (next > maxSelection) {
      return;
    }
    setNumSelections(next);
  };

  const buildChildProps = (
    child: React.ReactElement,
    index: number
  ): MultiSelectEntity => {
    const { props: { id = index.toString(), isDisabled = false } = {} } = child;

    const buttonProps = {
      ...child.props,
      key: id,
      id,
      onClick: handleChildClick,
      ...(disableOnMax && {
        isDisabled: shouldDisableButton({
          id,
          isDisabled,
          focus: child.props.focus,
        }),
      }),
    };
    return buttonProps;
  };

  const updateEntity = (entity: MultiSelectEntity) => {
    const { value, isFocused, id } = entity;
    const currentEntity = entities[id!] || {};
    const newEntityState = {
      ...entities,
      [id!]: { ...currentEntity, value, isFocused },
    };
    setEntities(newEntityState);
    return newEntityState;
  };

  const shouldDisableButton = ({
    id,
    isDisabled = false,
    focus,
  }: Partial<MultiSelectEntity>) => {
    let disableButton = isDisabled;
    const { isDisabled: disabledFromEntity, isFocused: focusedFromEntity } =
      entities[id!] || {};
    if (numSelections >= maxSelection) {
      if (!disabledFromEntity && !focusedFromEntity && !focus) {
        disableButton = true;
      }
    }

    return disableButton;
  };

  return (
    <Wrap w={'full'} spacing={4}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <WrapItem key={index}>
              {React.cloneElement(child, buildChildProps(child, index))}
            </WrapItem>
          );
        }
        return null;
      })}
    </Wrap>
  );
};

export default MultiSelectGroup;
