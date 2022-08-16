import { InputProps } from '@chakra-ui/input';

import { FieldValues, SubmitHandler, UseFormRegister } from 'react-hook-form';

export enum FormRegisterKeys {
  AudioUpload = 'AudioUpload',
  AccountMapiSecret = 'AccountMapiSecret',
  TrackInputTitle = 'TrackInputTitle',
  TrackInputArtist = 'TrackInputArtist',
  TrackInputGenre = 'TrackInputGenre',
  TrackInputTags = 'TrackInputTags',
  TrackInputAlbum = 'TrackInputAlbum',
  TrackInputLanguage = 'TrackInputLanguage',
  TrackInputDiscNumber = 'TrackInputDiscNumber',
  TrackInputReleaseTitle = 'TrackInputReleaseTitle',
  TrackInputCreationDate = 'TrackInputCreationDate',
  TrackInputCompilation = 'TrackInputCompilation',
  TrackInputExplicitContent = 'TrackInputExplicitContent',
  TrackInputImage = 'TrackInputImage',
  TrackInputIRSC = 'TrackInputIRSC',
  TrackInputLyricist = 'TrackInputLyricist',
  TrackInputComposer = 'TrackInputComposer',
  TrackInputISWC = 'TrackInputISWC',
  TrackInputCopyright = 'TrackInputCopyright',
  TrackInputPublisher = 'TrackInputPublisher',
  TrackInputBand = 'TrackInputBand',
  TrackInputConductor = 'TrackInputConductor',
  TrackInputUPC = 'TrackInputUPC',
  TrackInputEngineer = 'TrackInputEngineer',
  TrackInputProductionStudio = 'TrackInputProductionStudio',
  TrackInputRecordingDate = 'TrackInputRecordingDate',
  TrackInputInitialKey = 'TrackInputInitialKey',
  TrackInputMedium = 'TrackInputMedium',
  TrackInputProducedBy = 'TrackInputProducedBy',
  TrackInputSoftware = 'TrackInputSoftware',
  TrackInputTechnician = 'TrackInputTechnician',
  TrackInputBPM = 'TrackInputBPM',
  TrackInputEncodedBy = 'TrackInputEncodedBy',
}

export type FormProps = {
  onSubmit?: SubmitHandler<FieldValues>;
  isReadOnly?: boolean;
};

export type InputControlProps = {
  register: UseFormRegister<FieldValues>;
  name: FormRegisterKeys;
  isRequired?: boolean;
  defaultValue?: any;
  variant?: string;
  leftElementValue?: any;
  errors?: any;
  hasTags?: boolean;
  onTagsChange?: (tags: string[]) => void;
  onBlurInput?: (name: FormRegisterKeys, value: string) => void;
} & InputProps;

export const TrackFormToEntityKey: { [key in FormRegisterKeys]?: string } = {
  [FormRegisterKeys.TrackInputTitle]: 'title',
  [FormRegisterKeys.TrackInputArtist]: 'artist',
  [FormRegisterKeys.TrackInputGenre]: 'genre',
  [FormRegisterKeys.TrackInputAlbum]: 'album',
  [FormRegisterKeys.TrackInputLanguage]: 'language',
  [FormRegisterKeys.TrackInputDiscNumber]: 'discNumber',
  [FormRegisterKeys.TrackInputReleaseTitle]: 'releaseTitle',
  [FormRegisterKeys.TrackInputCreationDate]: 'creationDate',
  [FormRegisterKeys.TrackInputCompilation]: 'compilation',
  [FormRegisterKeys.TrackInputExplicitContent]: 'explicitContent',
  [FormRegisterKeys.TrackInputImage]: 'image',
  [FormRegisterKeys.TrackInputIRSC]: 'irsc',
  [FormRegisterKeys.TrackInputLyricist]: 'lyricist',
  [FormRegisterKeys.TrackInputComposer]: 'composer',
  [FormRegisterKeys.TrackInputISWC]: 'iswc',
  [FormRegisterKeys.TrackInputCopyright]: 'copyright',
  [FormRegisterKeys.TrackInputPublisher]: 'publisher',
  [FormRegisterKeys.TrackInputBand]: 'band',
  [FormRegisterKeys.TrackInputConductor]: 'conductor',
  [FormRegisterKeys.TrackInputUPC]: 'upc',
  [FormRegisterKeys.TrackInputEngineer]: 'engineer',
  [FormRegisterKeys.TrackInputProductionStudio]: 'productionStudio',
  [FormRegisterKeys.TrackInputRecordingDate]: 'recordingDate',
  [FormRegisterKeys.TrackInputInitialKey]: 'initialKey',
  [FormRegisterKeys.TrackInputMedium]: 'medium',
  [FormRegisterKeys.TrackInputProducedBy]: 'producedBy',
  [FormRegisterKeys.TrackInputSoftware]: 'software',
  [FormRegisterKeys.TrackInputTechnician]: 'technician',
  [FormRegisterKeys.TrackInputBPM]: 'bpm',
  [FormRegisterKeys.TrackInputEncodedBy]: 'encodedBy',
};
