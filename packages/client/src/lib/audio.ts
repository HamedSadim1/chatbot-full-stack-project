import popSound from "@/assets/sounds/pop.mp3";
import notificationSound from "@/assets/sounds/notification.mp3";
import { AUDIO } from "./constants";

const createAudio = (src: string, volume: number) => {
  const audio = new Audio(src);
  audio.volume = volume;
  return audio;
};

export const popAudio = createAudio(popSound, AUDIO.popVolume);
export const notificationAudio = createAudio(
  notificationSound,
  AUDIO.notificationVolume
);

export const playAudioSafe = (audio: HTMLAudioElement) => {
  void audio.play().catch(() => null);
};
