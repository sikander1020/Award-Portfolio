export function shouldWarmSceneVideos({
  isBooting,
  isMobile,
  reduceMotion,
}: {
  isBooting: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}) {
  return !isBooting && !isMobile && !reduceMotion;
}

export function getActiveVideoPreload(isMobile: boolean): "auto" | "metadata" {
  return isMobile ? "metadata" : "auto";
}

export function shouldPauseMobileSceneVideo({
  isMobile,
  isDocumentHidden,
}: {
  isMobile: boolean;
  isDocumentHidden: boolean;
}) {
  return isMobile && isDocumentHidden;
}
