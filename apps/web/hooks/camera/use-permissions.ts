import { useEffect, useState } from 'react';
import { getUserMedia, removeStreamTracks } from './use-stream';

export const useHasCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    resolveCameraPermission().then((permission) => {
      if (!active) {
        return;
      }

      setHasPermission(permission);
    });

    return () => {
      active = false;
    };
  }, [setHasPermission]);

  return { hasPermission };
};

async function canGetUserMedia(): Promise<boolean> {
  try {
    const stream = await getUserMedia({ video: true, audio: false });

    removeStreamTracks(stream);

    return true;
  } catch (e) {
    console.error('Error getting user media:', e);
    return false;
  }
}

async function getHasDeviceLabels(): Promise<boolean> {
  const mediaDeviceInfos = await navigator.mediaDevices?.enumerateDevices?.();

  return !!mediaDeviceInfos?.find((mediaDeviceInfo: MediaDeviceInfo) => {
    return mediaDeviceInfo.deviceId?.length > 0 && mediaDeviceInfo.kind === 'videoinput';
  });
}

const resolveCameraPermission = async (): Promise<boolean> => {
  const hasDeviceLabels = await getHasDeviceLabels();

  return hasDeviceLabels ? Promise.resolve(true) : canGetUserMedia();
};
