import { useDeviceStream, type DeviceChoiceOptions } from './use-stream';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useHasCameraPermission } from './use-permissions';
import { useGetDeviceList } from './use-devices';

const defaultDeviceChoiceOptions: DeviceChoiceOptions = {
  matchers: [/ultra/i, /back/i],
  facingMode: 'environment',
};

export type UseWebcamOptions = {
  deviceChoiceOptions?: DeviceChoiceOptions;
  onDevices?: (deviceList: MediaDeviceInfo[]) => void;
};

export const useWebcam = (options: UseWebcamOptions = {}) => {
  const { deviceChoiceOptions, onDevices } = options;

  const { hasPermission } = useHasCameraPermission();

  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamVideo, setWebcamVideo] = useState<HTMLVideoElement>();

  useEffect(() => {
    if (!(hasPermission && webcamVideoRef.current)) {
      return;
    }

    setWebcamVideo(webcamVideoRef.current);
  }, [hasPermission, webcamVideoRef]);

  const { deviceList } = useGetDeviceList(hasPermission, onDevices);

  const combinedDeviceChoiceOptions = useMemo(() => {
    return Object.assign(
      { width: webcamVideo?.width ?? 640, height: webcamVideo?.height ?? 480 },
      deviceChoiceOptions ?? defaultDeviceChoiceOptions,
    );
  }, [deviceChoiceOptions, webcamVideo]);

  const { stream, trackSettings } = useDeviceStream(hasPermission, deviceList, combinedDeviceChoiceOptions);

  useStreamToVideoElement(webcamVideo, stream);

  return {
    deviceList,
    hasPermission,
    stream,
    trackSettings,
    webcamVideo,
    webcamVideoRef,
  };
};

const useStreamToVideoElement = (
  videoElement: HTMLVideoElement | undefined,
  stream: MediaStream | undefined,
) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoElement) {
      localVideoRef.current = videoElement;
    }
  }, [videoElement]);

  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);
};
