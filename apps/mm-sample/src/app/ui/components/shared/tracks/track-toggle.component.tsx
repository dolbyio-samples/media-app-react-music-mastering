import 'apps/mm-sample/src/app/ui/styles/animations.scss';

import { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { debounce, throttle } from 'throttle-debounce';

import { Howl } from 'howler';
import WaveSurfer from 'wavesurfer.js';

import {
  Box,
  Flex,
  HStack,
  VStack,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  usePrevious,
} from '@chakra-ui/react';

import {
  Icon,
  WaveformEvents,
  WaveformProps,
  WaveformControls,
} from '@dolbyio/media-uikit-react';

import {
  MasteringApiOptions,
  MasteringPresets,
  MasteringPresetsMap,
  selectTrackById,
  selectTracksByIds,
  TracksEntity,
} from 'apps/mm-sample/src/app/store/slices';
import { RootState } from 'apps/mm-sample/src/app/store/configureAppStore';

import { getEnumKey } from 'apps/mm-sample/src/app/utils/enum.utils';

import useAccount from '../../../hooks/account-data.ui-hook';
import useMapiClient from '../../../hooks/use-mapi-client.ui-hook';
import useTracks from '../../../hooks/track-data.ui-hook';

import TrackWaveform from './track-waveform.component';
import IconMultiSelectButton, {
  IconMultiSelectProps,
} from '../forms/multi-select/icon-multi-select-button.component';
import TrackDataDisplay from './track-data-display.component';
import MasteringProgress from '../data-display/mastering-progress.component';
import Tag from '../forms/input/tag.component';

type TrackToggleProps = {
  rawTrackId: string;
  previewTrackIds: string[];
  presets: MasteringPresets[];
  previewActive?: boolean;
  alignTabs?: 'center' | 'start' | 'end';
  onSelectPreset?: (selection: MasteringPresets | null) => void;
  variant?: MasteringApiOptions;
} & Partial<WaveformProps>;

const TrackToggle = ({
  rawTrackId,
  previewTrackIds,
  presets,
  previewActive = true,
  alignTabs = 'center',
  onSelectPreset = () => {},
  variant = MasteringApiOptions.Preview,
  children,
  ...props
}: TrackToggleProps) => {
  if (!rawTrackId || !previewTrackIds || !previewTrackIds.length) {
    return null;
  }
  const dispatch = useDispatch();
  // Controllers
  const [isPlaying, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [sliderProgress, setSliderProgress] = useState<number>();
  const [loopActive, setLoopActive] = useState<boolean>(
    props.loopActive === undefined ? true : props.loopActive
  );
  // Data
  const [tabIndex, setTabIndex] = useState(0);
  const prevTabIndex = usePrevious(tabIndex);
  const { rawTrack: ogTrack } = useTracks();
  const rawTrack = useSelector(selectTrackById(rawTrackId));
  const previewTracks = useSelector(selectTracksByIds(previewTrackIds));
  const { apiProgress, apiIsDone } = useSelector(
    (state: RootState) => state.mastering
  );
  const { rawDataPrefix, previewDataPrefix, masterDataPrefix } = useAccount();
  // Actions
  const { processMasteringApiAction } = useMapiClient();
  // Audio utils
  const [audioProgress, setAudioProgress] = useState<number>();
  const waveformRefs = useRef<
    { $waveform: WaveSurfer; registered?: boolean }[]
  >([]);
  const [howls, setHowls] = useState<Howl[]>([
    new Howl({
      src: [rawTrack?.localBlobUrl!],
      format: rawTrack?.fileName?.split('.').pop(),
      loop: loopActive,
    }),
  ]);
  const [howlDone, setHowlDone] = useState(false);
  const [duration, setDuration] = useState(0);

  /** useEffect's */
  // Send preset selection to parent
  useEffect(() => {
    const aggregateSelections = [null, ...presets];
    onSelectPreset(aggregateSelections[tabIndex]);
  }, [tabIndex]);

  // Call the preview/mastering API
  useEffect(() => {
    if (!rawDataPrefix || !previewDataPrefix || !masterDataPrefix) {
      return;
    }
    dispatch(processMasteringApiAction({ presets, variant }));
  }, []);

  // loopTrack callback function
  // fired when loopActive is updated or a tab is changed
  // Checks loopActive from the state each time the track reaches its end
  // if true, then continues playing the track and updating waveform
  // if false, then stops playing track and updates buttons
  useEffect(() => {
    const loopTrack = () => {
      if (loopActive) {
        syncProgressState(0);
        syncAllWaveformPositions(0);
        setPlaying(true);
        waveformRefs?.current[tabIndex].$waveform?.setMute(true);
        waveformRefs?.current[tabIndex].$waveform?.play();
      } else {
        setPlaying(false);
        handleStop();
      }
    };
    (howls[tabIndex] as any)['_onend'] = [];
    howls[tabIndex].on('end', loopTrack);
  }, [loopActive, tabIndex]);

  // Load the rest of the howls
  useEffect(() => {
    if (!apiIsDone || howlDone) {
      return;
    }
    if (!previewTracks || previewTracks.length < previewTrackIds.length) {
      return;
    }
    const waitForLoad = async () => {
      // Don't process until we have tracks ready
      if (!previewTracks.length) {
        return;
      }
      const previewHowls = previewTracks.map((track, index) => {
        return new Howl({
          src: [track?.localBlobUrl!],
          format: track?.fileName?.split('.').pop(),
          loop: loopActive,
        });
      });
      return Promise.all(
        previewHowls.map((entity) => {
          return new Promise<Howl>((resolve) => {
            entity.once('load', () => {
              setHowls([...howls, ...previewHowls]);
              resolve(entity as any);
            });
          });
        })
      );
    };
    waitForLoad().then((allHowls) => {
      setHowlDone(true);
    });
  }, [apiIsDone, previewTracks]);

  useEffect(() => {
    howls[0].on('load', () => {
      const firstHowl = howls[0];
      setDuration(firstHowl.duration());
    });
    return () => {
      // Clean up howls
      Howler.stop();
    };
  }, []);

  // There's a wavesurfer issue where waveforms aren't drawn if they are initially hidden.
  // We need to draw it on tab change.
  useEffect(() => {
    const currWaveform = waveformRefs.current[tabIndex];
    if (!currWaveform) {
      return;
    }
    currWaveform.$waveform['drawBuffer']();
    currWaveform.$waveform?.setMute(true);
  }, [tabIndex]);

  // Register all waveforms
  useEffect(() => {
    const registeredAllWaveforms =
      waveformRefs.current &&
      waveformRefs.current.length === previewTrackIds.length + 1 &&
      waveformRefs.current.every((ref) => ref?.registered);
    if (registeredAllWaveforms) {
      return;
    }
    waveformRefs.current.forEach((ref, index) => {
      if (!ref) {
        return;
      }
      ref.$waveform.on('waveform-ready', () => {
        ref.registered = true;
      });
    });
  });

  // Add waveform event handlers to sync visual and audio components
  useEffect(() => {
    const prevWaveform: WaveSurfer =
      waveformRefs.current[prevTabIndex || 0]?.$waveform;
    // Clear out previous handlers
    if (prevWaveform) {
      prevWaveform.handlers['audioprocess'] = [];
      prevWaveform.handlers['seek'] = [];
    }
    const waveformRef = waveformRefs.current[tabIndex];
    if (!waveformRef) {
      return;
    }
    // Keeps sliderProgress and audioProgress synced to the waveform while playing.
    handleWaveformAudioProcess(waveformRef);
    // Keeps sliderProgress and audioProgress synced to the waveform on seeks. Also syncs adjacent waveforms.
    handleWaveformSeek(waveformRef);
  }, [tabIndex]);

  // Cross fade previous howl and current howl.
  // Ensure waveform plays if previous was playing.
  useEffect(() => {
    const prevWaveform: WaveSurfer =
      waveformRefs.current[prevTabIndex || 0]?.$waveform;
    const currWaveform: WaveSurfer = waveformRefs.current[tabIndex]?.$waveform;
    const prevHowl = howls[prevTabIndex];
    const currHowl = howls[tabIndex];
    if (!currWaveform || !prevWaveform || !currHowl || !prevHowl) {
      return;
    }
    crossFadeHowls(currHowl, prevHowl);
    currWaveform.setMute(true);
    if (prevWaveform.isPlaying()) {
      currWaveform.play(prevWaveform.getCurrentTime());
    } else {
      const seekPosition = prevWaveform.getCurrentTime() / duration;
      const normalizedSeek = seekPosition < 1 ? seekPosition : 1;
      currWaveform.seekTo(normalizedSeek);
    }
  }, [tabIndex]);

  /** Utilities */
  const crossFadeHowls = (fadeIn: Howl, fadeOut: Howl) => {
    fadeIn.seek(fadeOut.seek());
    if (fadeOut.playing()) {
      fadeIn.mute(false).fade(0, volume, 800);
      fadeOut.fade(volume, 0, 800);
      if (!fadeIn.playing()) {
        fadeIn.play();
      }
    }
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handlePlay = () => {
    if (!isPlaying && audioProgress == 1) {
      syncProgressState(0);
    }
    howls.forEach((entity, index) => {
      if (tabIndex !== index) {
        entity.mute(true).play();
      } else {
        entity.mute(false).volume(volume);
        entity.play();
        entity.fade(0, volume, 500);
      }
      waveformRefs.current[index].$waveform.setMute(true);
      waveformRefs.current[index].$waveform.play();
    });
  };

  const handlePause = () => {
    howls.forEach((entity, index) => {
      entity.fade(volume, 0, 500).pause();
      waveformRefs.current[index].$waveform.pause();
    });
  };

  const handleStop = () => {
    waveformRefs.current.forEach((waveformRef, index) => {
      waveformRef.$waveform.setMute(true);
      waveformRef.$waveform.stop();
      setAudioProgress(0);
      howls[index].stop();
    });
  };

  const handleLoop = (isLooping: boolean) => {
    setLoopActive(isLooping);
  };

  const handleVolumeChange = (e: any) => {
    if (!e?.target) {
      return;
    }
    const volume: string = e?.target?.value || '0.5';
    howls.forEach((howl, index) => {
      if (tabIndex !== index) {
        howl.mute(true);
      }
      howl.volume(parseFloat(volume));
    });
    setVolume(parseFloat(volume));
  };

  const handleControlClicks = (isDoing: boolean, playEvent: WaveformEvents) => {
    switch (playEvent) {
      case WaveformEvents.Play:
        handlePlay();
        setPlaying(true);
        break;
      case WaveformEvents.Pause:
        handlePause();
        setPlaying(false);
        break;
      case WaveformEvents.Stop:
        setPlaying(false);
        handleStop();
        break;
      case WaveformEvents.Loop:
        handleLoop(isDoing);
        break;
    }
  };

  const handleSliderChange = (currentTime: number) => {
    let normalizedCurrentTime = currentTime;
    if (normalizedCurrentTime > duration) {
      if (loopActive && isPlaying) {
        normalizedCurrentTime = 0;
      } else if (loopActive && !isPlaying) {
        normalizedCurrentTime = duration;
      }
    }
    const seekPosition = normalizedCurrentTime / duration;
    syncAllWaveformPositions(seekPosition);
    syncProgressState(seekPosition);
  };

  const syncProgressState = (seekPosition: number) => {
    setAudioProgress(seekPosition);
    setSliderProgress(seekPosition);
  };

  const syncAllWaveformPositions = (
    seekPosition: number,
    { excludeCurrent = false }: { excludeCurrent?: boolean } = {}
  ) => {
    const normalizedSeek = seekPosition < 1 ? seekPosition : 1;
    waveformRefs.current
      .filter((_, index) => !excludeCurrent || index !== tabIndex)
      .forEach((waveformRef) => {
        waveformRef?.$waveform.seekTo(normalizedSeek);
      });
  };

  const calcProgressFromWaveform = (waveformRef: { $waveform: WaveSurfer }) => {
    const currTime = waveformRef.$waveform?.getCurrentTime();
    const audioDur = waveformRef.$waveform?.getDuration();
    const waveProg = currTime / audioDur;
    return waveProg < 1 ? waveProg : 1;
  };

  const handleWaveformAudioProcess = (waveformRef: {
    $waveform: WaveSurfer;
  }) => {
    // Update visual
    const throttleSliderUpdate = throttle(100, () => {
      syncProgressState(calcProgressFromWaveform(waveformRef));
    });
    waveformRef.$waveform.handlers['audioprocess'] = [];
    waveformRef.$waveform.on('audioprocess', throttleSliderUpdate);
  };

  const handleWaveformSeek = (waveformRef: { $waveform: WaveSurfer }) => {
    const debounceSeek = debounce(200, (seekPosition) => {
      // Update visual
      syncProgressState(seekPosition);
      // Exclude the seeking on the current waveform to avoid infinite seek loop
      syncAllWaveformPositions(seekPosition, {
        excludeCurrent: true,
      });

      // Don't debounce at the start where seekPosition === 0 and for falsy values
      if (seekPosition) {
        // Update audio
        seekAllHowls(seekPosition);
      }
    });
    waveformRef.$waveform.handlers['seek'] = [];
    waveformRef.$waveform.on('seek', debounceSeek);
  };

  const seekAllHowls = (seekPosition: number) => {
    const waveformRef = waveformRefs.current[tabIndex];
    if (!howls || !waveformRef) {
      return;
    }
    howls.forEach((howl, index) => {
      howl.seek(seekPosition * waveformRef.$waveform.getDuration());
      if (index !== tabIndex) {
        howl.mute(true);
      }
    });
  };

  const tabProps = (index: number) => {
    return {
      focus: tabIndex === index,
      isLast: index === previewTrackIds.length,
    };
  };

  const renderTabPanel = ({
    track,
    index,
    img,
    title,
    description,
    waveProgressColor,
    tags,
  }: {
    track: TracksEntity;
    index: number;
    img: string | React.FunctionComponent;
    title: string;
    description: string;
    waveProgressColor?: string;
    tags?: string[];
  }) => {
    return (
      <TabPanel key={index}>
        <VStack w={'full'} spacing={'2'}>
          {variant === 'preview' && (
            <Box w={'full'}>
              <HStack w={'full'} height={'96px'} alignItems={'start'}>
                {index === 0 ? (
                  <TrackDataDisplay
                    artist={rawTrack?.metadata?.artist || ''}
                    title={rawTrack?.metadata?.title! || ogTrack?.fileName!}
                    imgSrc={
                      (img as string) || '/assets/svg/default-album-art.svg'
                    }
                  />
                ) : (
                  <HStack
                    w={'full'}
                    height={'100%'}
                    justifyContent={'space-between'}
                  >
                    <VStack alignItems={'flex-start'} w={'50%'} height={'100%'}>
                      <HStack>
                        <Box w={'12'} height={'42px'} marginRight="4">
                          {typeof img === 'string' ? (
                            <Image src={img} />
                          ) : (
                            <Icon
                              style={{ color: waveProgressColor }}
                              icon={img}
                            />
                          )}
                        </Box>
                        <Box>
                          <Flex alignItems={'left'} flexDirection={'column'}>
                            <Box
                              textAlign={'left'}
                              fontSize={'xl'}
                              fontWeight={'bold'}
                            >
                              {title}
                            </Box>
                          </Flex>
                        </Box>
                      </HStack>
                      <Box h={'48px'} textAlign={'left'}>
                        {description}
                      </Box>
                    </VStack>
                    {tags && (
                      <VStack alignItems={'flex-end'}>
                        <Box fontWeight={'semibold'}>Suggested genres</Box>
                        <HStack>
                          {tags.map((genre) => (
                            <Box>
                              <Tag isReadOnly>{genre}</Tag>
                            </Box>
                          ))}
                        </HStack>
                      </VStack>
                    )}
                  </HStack>
                )}
              </HStack>
            </Box>
          )}
          <Box
            w={'full'}
            className={`${
              index === tabIndex ? 'fadein-fromtop-animation' : ''
            }`}
          >
            <TrackWaveform
              ref={(el: any) => (waveformRefs.current[index] = el)}
              track={track!}
              hasLoopControl={false}
              {...props}
              preventDefaultControls={true}
              loopActive={true}
              previewActive={previewActive}
              waveProgressColor={waveProgressColor}
              {...(rawTrack?.waveform?.preview?.start &&
                rawTrack?.waveform?.preview?.end && {
                  preview: {
                    start: rawTrack?.waveform?.preview?.start,
                    end: rawTrack?.waveform?.preview?.end,
                  },
                })}
              isPreviewDraggable={false}
              isPreviewResizable={false}
              interact={props.interact}
            />
          </Box>
        </VStack>
      </TabPanel>
    );
  };

  const inProgress = !apiIsDone && !howlDone;
  let loadingMessage =
    variant === 'preview'
      ? 'Loading your preset selections'
      : 'Loading your mastered track';

  return (
    <Box
      {...props}
      w={'full'}
      p={'6'}
      borderRadius={'6px'}
      backgroundColor={'white'}
    >
      <VStack w={'full'} alignItems={'flex-start'} spacing={'8'}>
        {variant === MasteringApiOptions.Master && (
          <Box
            fontSize={'2xl'}
            paddingLeft={'16px'}
            pt={'2'}
            fontWeight={'semibold'}
          >
            Mastered track
          </Box>
        )}
        <Tabs
          w={'full'}
          index={tabIndex}
          onChange={handleTabsChange}
          variant={'unstyled'}
          align={alignTabs}
        >
          <HStack
            w={'full'}
            paddingLeft={'16px'}
            paddingRight={'16px'}
            alignItems={'flex-start'}
            mb={'6'}
          >
            {variant === MasteringApiOptions.Master && rawTrack && (
              <TrackDataDisplay
                artist={rawTrack.metadata?.artist || ''}
                title={rawTrack.metadata?.title! || ogTrack?.fileName!}
                imgSrc={
                  rawTrack.metadata?.albumArtSrc ||
                  '/assets/svg/default-album-art.svg'
                }
              />
            )}
            <VStack
              w={
                variant === MasteringApiOptions.Master ? 'min-content' : 'full'
              }
              alignItems={variant === MasteringApiOptions.Master ? 'end' : ''}
            >
              <TabList
                w={'full'}
                justifyContent={
                  variant === MasteringApiOptions.Master ? 'end' : 'center'
                }
              >
                <TrackToggleTab
                  {...tabProps(0)}
                  value={'og'}
                  text={'Original'}
                  focusStyle={{
                    backgroundColor: '#FFFFFF',
                    color: '#2C2C31',
                  }}
                  index={0}
                />
                {presets.map((preset, index) => {
                  const presetKey = getEnumKey(MasteringPresets, preset);
                  return (
                    <TrackToggleTab
                      {...tabProps(index + 1)}
                      icon={MasteringPresetsMap[preset].icon}
                      value={preset}
                      text={presetKey}
                      focusStyle={{
                        background: `url(${`/assets/svg/${getEnumKey(
                          MasteringPresets,
                          presets[index]
                        ).toLowerCase()}-focus-background.svg`}) no-repeat`,
                        backgroundSize: '100%',
                        color: '#FFFFFF',
                      }}
                      index={index + 1}
                      disabled={inProgress || !howlDone}
                    />
                  );
                })}
              </TabList>
              {variant === MasteringApiOptions.Master && (
                <Box>
                  <Image src={'/assets/svg/powered-by-dolby.svg'} />
                </Box>
              )}
            </VStack>
          </HStack>
          <Box
            className={`${inProgress ? '' : 'collapse-frombottom-animation'}`}
          >
            <MasteringProgress
              progress={apiProgress === null ? 0 : apiProgress}
              text={loadingMessage}
            />
          </Box>
          <TabPanels>
            {rawTrack &&
              renderTabPanel({
                index: 0,
                track: rawTrack!,
                img:
                  rawTrack?.metadata?.albumArtSrc ||
                  '/assets/svg/default-album-art.svg',
                title: 'Original',
                description:
                  rawTrack?.metadata?.title || ogTrack?.fileName || '',
              })}
            {previewTracks &&
              previewTracks.length &&
              previewTracks.map((track, index) => {
                const {
                  description,
                  waveProgressColor,
                  icon,
                  suggestedGenres,
                } = MasteringPresetsMap[presets[index]] || {};
                return renderTabPanel({
                  index: index + 1,
                  track: track!,
                  img: icon,
                  title: getEnumKey(MasteringPresets, presets[index]),
                  description: description || track?.fileName || '',
                  waveProgressColor,
                  tags: suggestedGenres,
                });
              })}
            {rawTrack && howls[0].state() === 'loaded' && (
              <Box px={'4'}>
                <WaveformControls
                  isPlaying={isPlaying}
                  loopActive={loopActive}
                  hasLoopControl={true}
                  onPlayChange={handleControlClicks}
                  onVolumeChange={handleVolumeChange}
                  seekPosition={
                    ((sliderProgress && sliderProgress) || 0) * duration
                  }
                  audioDuration={duration}
                  onSeek={handleSliderChange}
                />
              </Box>
            )}
          </TabPanels>
        </Tabs>
        {children}
      </VStack>
    </Box>
  );
};

const TrackToggleTab = (
  props: IconMultiSelectProps & {
    isLast: boolean;
    focus: boolean;
    index: number;
    text: string;
    focusStyle: React.CSSProperties;
    disabled?: boolean;
  }
) => {
  const {
    index,
    text,
    value,
    icon,
    focusStyle,
    disabled = false,
    focus,
    isLast,
  } = props;
  return (
    <Tab marginRight={isLast ? 0 : 2} p={0} key={index} isDisabled={disabled}>
      <IconMultiSelectButton
        id={text}
        style={{
          width: 132,
          height: 42,
          focus: focusStyle,
          icon: {
            width: 22,
            height: 22,
          },
          text: {
            fontSize: 14,
            fontWeight: 600,
          },
        }}
        icon={icon}
        text={text}
        value={value}
        focus={focus}
        isDisabled={disabled}
      />
    </Tab>
  );
};

export default TrackToggle;
