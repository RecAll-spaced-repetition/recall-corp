export type FileExts =
  | 'bmp'
  | 'gif'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'svg'
  | 'tif'
  | 'tiff'
  | 'webp'
  | 'avi'
  | 'm4v'
  | 'mkv'
  | 'mov'
  | 'mpg'
  | 'mp4'
  | 'ogv'
  | 'webm'
  | 'wmv'
  | 'aac'
  | 'flac'
  | 'm4a'
  | 'mp3'
  | 'mpeg'
  | 'oga'
  | 'ogg'
  | 'wav';

export type FileTypes = 'image' | 'video' | 'audio';

export const filesTypeExt: Record<FileTypes, FileExts[]> = {
  image: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'tif', 'tiff', 'webp'],
  video: ['avi', 'm4v', 'mkv', 'mov', 'mpg', 'mp4', 'ogv', 'webm', 'wmv'],
  audio: ['aac', 'flac', 'm4a', 'mp3', 'mpeg', 'oga', 'ogg', 'wav'],
};

export const filesExts: FileExts[] = [
  ...filesTypeExt.image,
  ...filesTypeExt.video,
  ...filesTypeExt.audio,
];

export const acceptedFilesExts = filesExts.join(',');

export const isAllowedFile = (file: File) => {
  const typeParts = file.type.split('/');
  if (typeParts.length == 0) return false;
  return filesExts.includes(typeParts[typeParts.length - 1] as FileExts);
};

export const checkedFileProcessing = (
  file: File,
  processor: (f: File) => void
) => {
  if (!isAllowedFile(file)) return false;
  processor(file);
  return true;
};
