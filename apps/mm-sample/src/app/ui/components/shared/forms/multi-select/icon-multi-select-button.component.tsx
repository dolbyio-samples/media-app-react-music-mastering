import { ButtonHTMLAttributes } from 'react';

import { css } from '@emotion/react';

import { useState, useEffect } from 'react';

import { Popover, PopoverTrigger, Flex, Box } from '@chakra-ui/react';

import { Icon, Icons } from '@dolbyio/media-uikit-react';

export interface IconMultiSelectProps
  extends ButtonHTMLAttributes<HTMLDivElement> {
  icon?: Icons | React.FunctionComponent;
  text: string;
  value: string | number;
  direction?: 'row' | 'column';
  isDisabled?: boolean;
  isFocused?: boolean; // Initial focus state
  focus?: boolean; // Lifecycle focus state
  style?: React.CSSProperties & {
    focus?: React.CSSProperties;
    disabled?: React.CSSProperties;
    hover?: React.CSSProperties;
    icon?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  popoverElement?: React.FunctionComponent<any> | null;
  key?: string | number;
}

const DefaultStyle = (
  borderSize = 1,
  paddingTopBottom = 8,
  paddingLeftRight = 30
) => ({
  padding: `${paddingTopBottom - borderSize}px ${paddingLeftRight}px`,
  border: `${borderSize}px solid #B9B9BA`,
  fontWeight: 'bold',
  boxSizing: 'border-box',
  borderRadius: '3.5px',
  color: '#6A6A6D',
  background: '#FFFFFF',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundPosition: 'center',
});

const DefaultFocusStyle = (
  borderSize = 2,
  paddingTopBottom = 8,
  paddingLeftRight = 30
) => ({
  padding: `${paddingTopBottom - borderSize}px ${paddingLeftRight}px`,
  border: `${borderSize}px solid #AA33FF`,
  color: '#2C2C31',
});

const DefaultHoverStyle = (
  borderSize = 2,
  paddingTopBottom = 8,
  paddingLeftRight = 30
) => ({
  padding: `${paddingTopBottom - borderSize}px ${paddingLeftRight}px`,
  border: `${borderSize}px solid #AA33FF`,
  color: '#2C2C31',
  cursor: 'pointer',
});

const DefaultDisabledStyle = (borderSize = 1) => ({
  background: ' #F2F2F2',
  color: '#B9B9BA',
  border: `none`,
  cursor: 'not-allowed',
  pointerEvents: 'none',
});

const IconMultiSelectButton = ({
  icon,
  text,
  value,
  direction = 'row',
  isDisabled = false,
  isFocused = false,
  focus: forcedFocus,
  style = {},
  popoverElement: PopoverElement = null,
  key,
  ...props
}: IconMultiSelectProps) => {
  const {
    focus: focusStyle,
    disabled: disabledStyle,
    hover: hoverStyle,
    icon: iconStyle,
    text: textStyle,
    ...restInputStyle
  } = style;
  const [focus, setFocus] = useState(isFocused);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setFocus(forcedFocus!);
  }, [forcedFocus]);

  let focusOverride = forcedFocus ? true : focus;

  const defaultStyle = css({
    ...DefaultStyle(),
    ...restInputStyle,
    ...(hover && { ...DefaultHoverStyle(), ...hoverStyle }),
    ...(focusOverride && { ...DefaultFocusStyle(), ...focusStyle }),
    ...(isDisabled && { ...DefaultDisabledStyle(), ...disabledStyle }),
  } as any);

  return (
    <Popover trigger={'hover'} placement={'top'} key={key}>
      <PopoverTrigger key={key}>
        <div
          {...props}
          key={key}
          onMouseEnter={(e) => {
            setHover(true);
            props.onMouseEnter && props.onMouseEnter(e);
          }}
          onMouseLeave={(e) => {
            setHover(false);
            props.onMouseLeave && props.onMouseLeave(e);
          }}
          onClick={(e) => {
            setFocus(!focusOverride);
            props.onClick &&
              props.onClick({
                ...e,
                isFocused: !focusOverride,
                value,
                id: props.id,
              } as any);
          }}
          css={defaultStyle}
        >
          <Flex
            direction={direction}
            justifyContent={'center'}
            alignItems={'center'}
          >
            {icon && (
              <Box>
                <Icon
                  style={{
                    color: DefaultStyle().color,
                    ...(direction === 'row'
                      ? { marginRight: '8' }
                      : { marginBottom: '8' }),
                    ...iconStyle,
                    ...(hover && { color: hoverStyle?.color }),
                    ...(focusOverride && { color: focusStyle?.color }),
                    ...(isDisabled && { color: disabledStyle?.color }),
                  }}
                  icon={icon}
                ></Icon>
              </Box>
            )}
            <Box style={{ ...textStyle }}>{text}</Box>
          </Flex>
        </div>
      </PopoverTrigger>
      {PopoverElement && <PopoverElement key={key} />}
    </Popover>
  );
};

export default IconMultiSelectButton;
