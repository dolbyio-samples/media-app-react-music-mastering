import { HStack, Box, Flex, Image } from '@chakra-ui/react';

type TrackDataDisplayProps = {
  imgSrc: string;
  artist: string;
  title: string;
};

const TrackDataDisplay = ({ imgSrc, artist, title }: TrackDataDisplayProps) => {
  return (
    <HStack w={'full'}>
      <Box>
        <Image
          src={imgSrc}
          margin="auto"
          mr={'2'}
          width={'16'}
          height={'16'}
        ></Image>
      </Box>
      <Box>
        <Flex
          alignItems={'flex-start'}
          flexDirection={'column'}
          justifyContent={'center'}
        >
          <Box fontSize={'m'} color={'GrayText'}>
            {artist}
          </Box>
          <Box fontWeight={'bold'} fontSize={'2xl'}>
            {title}
          </Box>
        </Flex>
      </Box>
    </HStack>
  );
};

export default TrackDataDisplay;
