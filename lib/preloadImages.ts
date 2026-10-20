/** One stalled asset must never hold a page hostage. */
const PRELOAD_TIMEOUT_MS = 90_000;

/**
 * Resolves once every image is downloaded *and decoded*.
 *
 * Waiting on `onload` alone is not enough: the bytes have arrived but the
 * browser may still be building the bitmap, which is how a half-drawn image
 * reaches the screen. `decode()` waits for the frame to be ready to paint.
 *
 * Broken or slow URLs resolve rather than reject, so a single bad asset
 * degrades to a missing image instead of a spinner that never stops.
 */
export function preloadImages(urls: (string | undefined | null)[]): Promise<void> {
  const unique = Array.from(new Set(urls.filter((u): u is string => !!u)));
  if (unique.length === 0) return Promise.resolve();

  return Promise.all(
    unique.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();

          const timeout = setTimeout(() => {
            console.warn(`Image preload timeout: ${url}`);
            resolve();
          }, PRELOAD_TIMEOUT_MS);

          const done = () => {
            clearTimeout(timeout);
            resolve();
          };

          img.onload = () => {
            if (typeof img.decode === "function") {
              // decode() can reject on a decode error; treat that as done
              img.decode().then(done, done);
            } else {
              done();
            }
          };

          img.onerror = () => {
            console.warn(`Image preload failed: ${url}`);
            done();
          };

          img.src = url;
        })
    )
  ).then(() => undefined);
}
