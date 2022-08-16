export function appendToFilename(filename: string, string: string) {
  var dotIndex = filename.lastIndexOf('.');
  if (dotIndex == -1) return filename + string;
  else
    return (
      filename.substring(0, dotIndex) + string + filename.substring(dotIndex)
    );
}

export function getAudioName(filename: string) {
  var slashIndex = filename.lastIndexOf('/') + 1;
  var dashIndex = filename.lastIndexOf('-');
  if (slashIndex == -1) return filename;
  else return filename.substring(slashIndex, dashIndex);
}
