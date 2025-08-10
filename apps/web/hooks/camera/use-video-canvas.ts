import { useCallback, useEffect, useMemo, useState } from 'react';

type DrawImageBounds = [number, number, number, number, number, number, number, number];

export type UseVideoCanvasOptions = {
  canvas?: HTMLCanvasElement | null;
  hasPermission?: boolean;
  shouldDraw?: boolean;
  shouldPlay?: boolean;
  timeoutDelay?: number;
  trackSettings?: MediaTrackSettings;
  webcamVideo?: HTMLVideoElement;
  zoom?: number;
  onDraw?: (video?: HTMLVideoElement) => void;
  onPlay?: () => void;
};

const playWithRetry = async (videoElement: HTMLVideoElement): Promise<unknown> => {
  try {
    videoElement.pause();

    return await videoElement.play();
  } catch (error) {
    console.log(error);

    return new Promise((resolve) => {
      setTimeout(() => resolve(playWithRetry(videoElement)), 100);
    });
  }
};

export const useVideoCanvas = (options: UseVideoCanvasOptions) => {
  const {
    canvas,
    hasPermission,
    shouldDraw = true,
    shouldPlay = true,
    timeoutDelay = 17,
    trackSettings,
    webcamVideo,
    zoom = 1,
    onDraw,
    onPlay,
  } = options;

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [intervalIds, setIntervalIds] = useState<number[]>([]);

  const addIntervalId = useCallback((intervalId: number) => {
    setIntervalIds((prev) => [...prev, intervalId]);
  }, []);

  useEffect(() => {
    setContext(null);
  }, [
    zoom,
    webcamVideo?.width,
    webcamVideo?.height,
    canvas?.width,
    canvas?.height,
  ]);

  useEffect(() => {
    if (!context && canvas) {
      setHasListener(false);
      const canvasContext = canvas?.getContext('2d', { willReadFrequently: true });
      if (!canvasContext) {
        return;
      }

      setContext(canvasContext);

      return;
    }
  }, [canvas, context]);

  const bounds: DrawImageBounds | undefined = useMemo(() => {
    if (!(webcamVideo && trackSettings && canvas)) {
      return;
    }

    const effectiveZoom = Math.pow(zoom, 2);
    const trackWidth = trackSettings.width ?? webcamVideo.width;
    const trackHeight = trackSettings.height ?? webcamVideo.height;

    const centerX = trackWidth / 2;
    const centerY = trackHeight / 2;
    const originX = centerX - centerX / effectiveZoom;
    const originY = centerY - centerY / effectiveZoom;
    const sourceWidth = trackWidth / effectiveZoom;
    const sourceHeight = trackHeight / effectiveZoom;

    return [
      originX,
      originY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    ];
  }, [webcamVideo, trackSettings, canvas, zoom]);

  const streamToCanvas = useMemo(() => {
    const streamToCanvas = () => {
      if (!bounds) {
        return;
      }
      if (!(context && webcamVideo)) {
        return;
      }

      context.drawImage(webcamVideo, ...bounds);

      if (shouldDraw) {
        onDraw?.(webcamVideo);
      }
    };

    return streamToCanvas;
  }, [bounds, context, onDraw, shouldDraw, webcamVideo]);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    if (hasPermission && context && webcamVideo && !hasListener) {
      webcamVideo.addEventListener('play', () => {
        intervalIds.forEach(window.clearInterval);
        streamToCanvas();
        addIntervalId(window.setInterval(streamToCanvas, timeoutDelay));
      }, { once: true });

      if (shouldPlay) {
        playWithRetry(webcamVideo).then(onPlay);
      }

      setHasListener(true);
    }
  }, [addIntervalId, bounds, context, hasListener, hasPermission, intervalIds, onPlay, shouldPlay, streamToCanvas, timeoutDelay, webcamVideo]);
};
