import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';

import { TracksEntity } from 'apps/mm-sample/src/app/store/slices';
import { FormProps } from '../forms/form.constants';

import TrackMetadataGeneralForm from '../forms/track-metadata-general-form.component';
import TrackMetadataOwnershipForm from '../forms/track-metadata-ownership-form.component';
import TrackMetadataRecordingForm from '../forms/track-metadata-recording-form.component';

const DolbyAccordionIcon = () => (
  <AccordionIcon
    marginRight={'2'}
    width={'8'}
    height={'8'}
    style={{ color: '#AA33FF' }}
  />
);

const DolbyAccordionButton = ({ children }: any) => {
  return (
    <AccordionButton
      _expanded={{ borderBottom: 'solid 2px #AA33FF' }}
      style={{
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <DolbyAccordionIcon />
      <Box fontSize={'large'} fontWeight={'semibold'} flex="1" textAlign="left">
        {children}
      </Box>
    </AccordionButton>
  );
};

const MetadataAccordionItem = ({ header = '', children }: any) => {
  return (
    <AccordionItem style={{ border: 'none' }}>
      <DolbyAccordionButton>{header}</DolbyAccordionButton>
      <AccordionPanel pb={4} _expanded={{ borderBottom: 'none' }}>
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

const TrackMetadata = ({
  track,
  ...props
}: FormProps & { track: TracksEntity }) => {
  return (
    <Accordion
      w={'full'}
      allowMultiple
      style={{ border: 'transparent' }}
      bgColor={'white'}
      pt={'8'}
      pr={'12'}
      pl={'12'}
      pb={'8'}
    >
      <AccordionItem>
        <AccordionButton p={0}>
          <Box
            fontSize={'medium'}
            fontWeight={'semibold'}
            textAlign="left"
            marginRight={'2'}
          >
            Advanced settings
          </Box>
          <DolbyAccordionIcon />
        </AccordionButton>
        <AccordionPanel p={0} mt={6}>
          <Box
            fontSize={'xl'}
            flex="1"
            fontWeight={'semibold'}
            textAlign="left"
            marginBottom={'6'}
          >
            Metadata
          </Box>
          <Accordion allowMultiple>
            <MetadataAccordionItem header={'General information'}>
              <TrackMetadataGeneralForm track={track} {...props} />
            </MetadataAccordionItem>
            <MetadataAccordionItem header={'Ownership'}>
              <TrackMetadataOwnershipForm track={track} {...props} />
            </MetadataAccordionItem>
            <MetadataAccordionItem header={'Recording and production'}>
              <TrackMetadataRecordingForm track={track} {...props} />
            </MetadataAccordionItem>
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TrackMetadata;
