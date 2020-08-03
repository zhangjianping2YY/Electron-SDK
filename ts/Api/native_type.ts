export interface MediaStreamInfo { /* the index of the stream in the media file */
  streamIndex : number;

  /* stream type */
  streamType : MEDIA_STREAM_TYPE;

  /* stream encoding name */
  codecName : string;

  /* streaming language */
  language : string;

  /* If it is a video stream, video frames rate */
  videoFrameRate : number;

  /* If it is a video stream, video bit rate */
  videoBitRate : number;

  /* If it is a video stream, video width */
  videoWidth : number;

  /* If it is a video stream, video height */
  videoHeight : number;

  /* If it is a video stream, video rotation */
  videoRotation : number;

  /* If it is an audio stream, audio bit rate */
  audioSampleRate : number;

  /* If it is an audio stream, the number of audio channels */
  audioChannels : number;

  /* stream duration in second */
  duration : number;
};

export type MEDIA_PLAYER_STATE =
  | 0 //PLAYER_STATE_IDLE
  | 1 //PLAYER_STATE_OPENING
  | 2 //PLAYER_STATE_OPEN_COMPLETED
  | 3 //PLAYER_STATE_PLAYING
  | 4 //PLAYER_STATE_PAUSED
  | 5 //PLAYER_STATE_PLAYBACK_COMPLETED
  | 6 //PLAYER_STATE_STOPPED
  | 100 //PLAYER_STATE_FAILED

export type MEDIA_PLAYER_EVENT =
  | 0 //PLAYER_EVENT_SEEK_BEGIN
  | 1 //PLAYER_EVENT_SEEK_COMPLETE
  | 2 //PLAYER_EVENT_SEEK_ERROR
  | 3 //PLAYER_EVENT_VIDEO_PUBLISHED
  | 4 //PLAYER_EVENT_AUDIO_PUBLISHED
  | 5 //PLAYER_EVENT_AUDIO_TRACK_CHANGED

export type MEDIA_PLAYER_METADATA_TYPE =
  | 0 //PLAYER_METADATA_TYPE_UNKNOWN
  | 1 //PLAYER_METADATA_TYPE_SEI

export type MEDIA_PLAYER_ERROR =
  | 0 //PLAYER_ERROR_NONE
  | -1 //PLAYER_ERROR_INVALID_ARGUMENTS
  | -2 //PLAYER_ERROR_INTERNAL
  | -3 //PLAYER_ERROR_NO_RESOURCE
  | -4 //PLAYER_ERROR_INVALID_MEDIA_SOURCE
  | -5 //PLAYER_ERROR_UNKNOWN_STREAM_TYPE
  | -6 //PLAYER_ERROR_OBJ_NOT_INITIALIZED
  | -7 //PLAYER_ERROR_CODEC_NOT_SUPPORTED
  | -8 //PLAYER_ERROR_VIDEO_RENDER_FAILED
  | -9 //PLAYER_ERROR_INVALID_STATE
  | -10 //PLAYER_ERROR_URL_NOT_FOUND
  | -11 //PLAYER_ERROR_INVALID_CONNECTION_STATE
  | -12 //PLAY_ERROR_SRC_BUFFER_UNDERFLOW

export declare type MEDIA_PLAYER_PLAY_SPEED = 
  | 100 //origin playback speed
  | 75 //playback speed slow down to 0.75
  | 50 //playback speed slow down to 0.5
  | 125 //playback speed speed up to 1.25
  | 150 //playback speed speed up to 1.5
  | 200 //playback speed speed up to 2.0

export declare type MEDIA_STREAM_TYPE = 
  | 0 //Unknown stream type
  | 1 //Video stream
  | 2 //Audio stream
  | 3 //Subtitle stream

export interface NodeMediaPlayer {
   /**
   * @ignore
   */
  onEvent(event: string, callback: Function): void;
   /**
   * @ignore
   */
  registerVideoFrameObserver(callback: Function): number;
  initialize(): number;
  open(url: string, position: number): number;
  play(): number;
  pause(): number;
  stop(): number;
  seek(position: number): number;
  mute(mute: boolean): number;
  getMute(): boolean;
  adjustPlayoutVolume(volume: number): number;
  getPlayoutVolume(): number;
  getPlayPosition(): number;
  getDuration(): number;
  getState(): MEDIA_PLAYER_STATE;
  getStreamCount(): number;
  getStreamInfo(index: number): MediaStreamInfo;
  connect(token:string, channelId:string, userId:string): number;
  disconnect(): number;
  publishVideo(): number;
  unpublishVideo(): number;
  publishAudio(): number;
  unpublishAudio(): number;
  adjustPublishSignalVolume(volume: number): number;
  setLogFile(filePath: string): number;
  setLogFilter(filter: number): number;
  setPlayerOption(key: string, value: number): number;
  changePlaybackSpeed(speed: MEDIA_PLAYER_PLAY_SPEED): number;
  selectAudioTrack(index: number): number;
  setVideoRotation(rotation: 0 | 90 | 180 | 270): number;
  release(): number;
}