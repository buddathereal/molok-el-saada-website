/** Background video should only play near the viewport while the page is visible. */
export function shouldPlayBackgroundVideo(isNearViewport, isDocumentVisible) {
  return isNearViewport === true && isDocumentVisible === true;
}
