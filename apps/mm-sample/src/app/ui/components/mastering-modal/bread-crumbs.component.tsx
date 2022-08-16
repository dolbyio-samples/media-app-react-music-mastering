import './bread-crumbs.scss';

import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
  useTab,
  useMultiStyleConfig,
  Box,
  HStack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import Button from '@dolby-io-uikit/react-ui/src/components/forms/button/button';

import { RootState } from '../../../store/configureAppStore';
import {
  CustomMasteringPresets,
  masteringActions,
  MasteringApiOptions,
  MasteringStep,
  tracksActions,
} from '../../../store/slices';

import MasteringModalDetailsPanel from './details-panel.component';
import MasteringModalUpload from './upload.component';
import MasteringModalAuditionPanel from './audition-panel.component';
import MasteringModalPresetPanel from './preset-panel.component';
import MasteringModalMasteredTrackPanel from './mastered-track-panel.component';
import useMapiClient from '../../hooks/use-mapi-client.ui-hook';
import useTracks from '../../hooks/track-data.ui-hook';
import { appendToFilename } from '../../../utils/file.utils';
import useAccount from '../../hooks/account-data.ui-hook';

const MasteringModalBreadCrumbs = () => {
  const dispatch = useDispatch();
  const mastering = useSelector((state: RootState) => state.mastering);
  const {
    currentStep,
    furthestStep,
    canProceedSteps,
    disableAllStepTabs,
    apiProgress,
    apiIsDone,
  } = mastering;
  const canProceedCurrentStep = canProceedSteps.includes(currentStep);
  const [prevStep, setPrevStep] = useState<MasteringStep>();
  const canGoBack = apiProgress === null || apiProgress >= 100 || apiIsDone;
  const { processMasteringApiAction } = useMapiClient();
  const { rawTrack } = useTracks();
  const { rawDataPrefix } = useAccount();

  const onNext = () => {
    if (!canProceedCurrentStep) {
      return;
    }
    const nextStep = currentStep + 1;
    dispatch(masteringActions.updateCurrentStep(nextStep));

    if (nextStep === MasteringStep.ChoosePresets) {
      const trimmedFileName = appendToFilename(rawTrack?.fileName!, '_trimmed');
      const fileId = `${rawDataPrefix}/${trimmedFileName}`;
      dispatch(tracksActions.remove(fileId));
      dispatch(
        processMasteringApiAction({
          presets: [CustomMasteringPresets.Trimmed],
          variant: MasteringApiOptions.Preview,
        })
      );
      dispatch(masteringActions.updateTrimmedTrackId(fileId));
      return;
    }
  };

  const onBack = () => {
    if (!canGoBack) {
      return;
    }
    dispatch(masteringActions.updateCurrentStep(currentStep - 1));
  };

  const handleTabsChange = (index: number) => {
    setPrevStep(currentStep);
    dispatch(masteringActions.updateCurrentStep(index));
  };

  const isBreadCrumbTab = (currentStep: number) => {
    return currentStep > 0 && currentStep < 4;
  };

  return (
    <Tabs
      isLazy
      isFitted
      index={currentStep}
      onChange={handleTabsChange}
      variant={'unstyled'}
    >
      <TabList
        bgColor={'white'}
        style={{
          visibility: isBreadCrumbTab(currentStep) ? 'visible' : 'hidden',
          display: isBreadCrumbTab(currentStep) ? 'flex' : 'none',
          justifyContent: 'space-between',
          padding: '0px 32px',
          borderBottom: '2px solid #c4c4c4',
        }}
      >
        <Tab
          style={{
            display: 'none',
          }}
        />
        <CustomTab
          isDisabled={
            disableAllStepTabs || furthestStep < MasteringStep.Details
          }
          tabIndex={MasteringStep.Details}
          currentStep={currentStep}
        >
          Details
        </CustomTab>
        <AnimatedProgressLine
          currentStep={currentStep}
          prevStep={prevStep}
          stepBeforeLine={MasteringStep.Details}
        />
        <CustomTab
          isDisabled={
            disableAllStepTabs || currentStep < MasteringStep.ChoosePresets
          }
          tabIndex={MasteringStep.ChoosePresets}
          currentStep={currentStep}
        >
          Choose presets
        </CustomTab>
        <AnimatedProgressLine
          currentStep={currentStep}
          prevStep={prevStep}
          stepBeforeLine={MasteringStep.ChoosePresets}
        />
        <CustomTab
          isDisabled={
            disableAllStepTabs || currentStep !== MasteringStep.Audition
          }
          tabIndex={MasteringStep.Audition}
          currentStep={currentStep}
        >
          Audition
        </CustomTab>
        <Tab
          style={{
            display: 'none',
          }}
        ></Tab>
      </TabList>

      <TabPanels>
        <TabPanel p={0}>
          <MasteringModalUpload />
        </TabPanel>
        <TabPanel p={0}>
          <MasteringModalDetailsPanel />
        </TabPanel>
        <TabPanel p={0}>
          <MasteringModalPresetPanel />
        </TabPanel>
        <TabPanel p={0}>
          <MasteringModalAuditionPanel />
        </TabPanel>
        <TabPanel p={0}>
          <MasteringModalMasteredTrackPanel />
        </TabPanel>
      </TabPanels>

      {isBreadCrumbTab(currentStep) && (
        <Flex
          w={'100%'}
          justifyContent={'end'}
          flexDirection={'row'}
          alignItems={'center'}
          bgColor={'white'}
          pt={'8'}
          pb={'8'}
          pl={'12'}
          pr={'12'}
        >
          <Link
            fontSize={'large'}
            fontWeight={'bold'}
            mr={'6'}
            color={!canGoBack ? 'base.gray.03.value' : 'base.purple.04.value'}
            onClick={onBack}
            className={`back-button ${canGoBack ? '' : 'disabled'}`}
          >
            Back
            <ChevronRightIcon w={'8'} h={'8'} mt={'-2px'} />
          </Link>
          <Popover
            trigger={
              !canProceedCurrentStep &&
              apiIsDone &&
              Boolean(FlowValidationStringsMap[currentStep])
                ? 'hover'
                : undefined
            }
            closeOnBlur={true}
          >
            <PopoverContent padding={4}>
              <PopoverArrow />
              <PopoverBody>{FlowValidationStringsMap[currentStep]}</PopoverBody>
            </PopoverContent>
            <PopoverTrigger>
              <Box>
                <Button onClick={onNext} isDisabled={!canProceedCurrentStep}>
                  Next
                </Button>
              </Box>
            </PopoverTrigger>
          </Popover>
        </Flex>
      )}
    </Tabs>
  );
};

const AnimatedProgressLine = ({
  currentStep,
  prevStep = 1,
  stepBeforeLine,
}: {
  currentStep: MasteringStep;
  prevStep?: MasteringStep;
  stepBeforeLine: MasteringStep;
}) => {
  return (
    <div
      className={`${currentStep > 1 || prevStep > 1 ? 'progress-line' : ''} ${
        currentStep > stepBeforeLine
          ? 'progress-line-expand'
          : 'progress-line-contract'
      }`}
    />
  );
};

const CustomTab = React.forwardRef((props: any, ref: any) => {
  // 1. Reuse the `useTab` hook
  // @ts-ignore: Omiting currentStep from tabProps since it is not recognized as a native DOM attribute
  const { currentStep, ...tabProps } = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];
  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);
  const iconDimension = 22;
  const iconColor = `${
    isSelected
      ? '#8829CC'
      : props.tabIndex < props.currentStep
      ? 'black'
      : 'white'
  }`;

  return (
    <Button
      __css={{
        ...styles['tab'],
      }}
      _selected={{ borderColor: 'none' }}
      {...tabProps}
    >
      <HStack>
        <Box
          borderRadius={'50%'}
          border={`2px solid ${
            props.currentStep >= props.tabIndex ? '#c4c4c4' : 'transparent'
          }`}
          p={'8px'}
        >
          <Box
            borderRadius={'50%'}
            w={`${iconDimension}px`}
            h={`${iconDimension}px`}
            lineHeight={`${iconDimension - 4}px`}
            textAlign="center"
            backgroundColor={iconColor}
            border={`2px solid ${
              isSelected
                ? '#8829CC'
                : props.tabIndex < props.currentStep
                ? 'black'
                : '#c4c4c4'
            }`}
            color={
              isSelected
                ? 'white'
                : props.tabIndex < props.currentStep
                ? 'white'
                : 'black'
            }
            fontSize={'x-small'}
            fontWeight={'bold'}
          >
            {props.tabIndex}
          </Box>
        </Box>
        <Box fontWeight={'bold'} fontSize={'medium'}>
          {tabProps.children}
        </Box>
      </HStack>
    </Button>
  );
});

const FlowValidationStringsMap: Record<number, string> = {
  [MasteringStep.ChoosePresets]:
    'Please select at least one preset above to continue.',
  [MasteringStep.Audition]: 'Please select a preset to master your track with.',
};

export default MasteringModalBreadCrumbs;
