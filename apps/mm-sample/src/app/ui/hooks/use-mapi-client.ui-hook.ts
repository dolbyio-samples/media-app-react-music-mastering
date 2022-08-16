import {
  callMusicMasteringApi,
  MasteringPresets,
  MasteringApiOptions,
  MasteringApiThunkParams,
  CustomMasteringPresets,
} from '../../store/slices';

import { getEnumKey } from '../../utils/enum.utils';
import { appendToFilename } from '../../utils/file.utils';
import useAccount from './account-data.ui-hook';
import useTracks from './track-data.ui-hook';

const useMapiClient = () => {
  const { rawTrack } = useTracks();
  const { rawDataPrefix, previewDataPrefix, masterDataPrefix } = useAccount();

  const getPresetKey = (preset: string) => {
    const presetType = Object.values(MasteringPresets).includes(
      preset as MasteringPresets
    )
      ? MasteringPresets
      : CustomMasteringPresets;
    const filename = `${
      presetType === MasteringPresets ? previewDataPrefix : rawDataPrefix
    }/${rawTrack?.fileName}`;
    const presetAppend = `_${getEnumKey(presetType, preset).toLowerCase()}`;
    // example '/preview/filename_{preset}.ext';
    const presetKey = appendToFilename(filename, presetAppend);
    return presetKey;
  };

  const getPreviewTrackIds = (
    presets: (MasteringPresets | CustomMasteringPresets)[]
  ) => {
    return presets.map((preset) => getPresetKey(preset));
  };

  const getMasterTrackId = () => {
    return `${masterDataPrefix}/${rawTrack?.fileName}`;
  };

  const processMasteringApiAction = ({
    presets,
    variant,
  }: Pick<MasteringApiThunkParams, 'presets' | 'variant'>) => {
    if (!rawTrack) {
      return;
    }
    return callMusicMasteringApi({
      variant,
      outputKeys:
        variant === MasteringApiOptions.Preview
          ? getPreviewTrackIds(presets)
          : [getMasterTrackId()],
      presets: presets,
      inputKey: `${rawDataPrefix}/${rawTrack?.fileName}`,
    });
  };
  return { processMasteringApiAction, getPreviewTrackIds, getMasterTrackId };
};

export default useMapiClient;
