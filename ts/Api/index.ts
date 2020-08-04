import {
  SoftwareRenderer,
  GlRenderer,
  IRenderer,
  CustomRenderer
} from '../Renderer';
import {
  NodeMediaPlayer,
  MEDIA_PLAYER_STATE,
  MEDIA_PLAYER_ERROR,
  MEDIA_PLAYER_EVENT,
  MEDIA_PLAYER_PLAY_SPEED,
  MediaStreamInfo
} from './native_type';
import { EventEmitter } from 'events';
import { deprecate, config, Config } from '../Utils';

import { fileURLToPath } from 'url';
import Renderer from 'ts/Renderer/SoftwareRenderer';
const agora = require('../../build/Release/agora_mediaplayer_node_ext');


class AgoraMediaPlayer extends EventEmitter
{
  mediaPlayer: NodeMediaPlayer;
  renderMode: number;
  customerRenderer: any;
  renderer: IRenderer | undefined;
  constructor() {
    super();
    this.mediaPlayer = new agora.NodeMediaPlayer;
    this.renderMode = this._checkWebGL() ? 1 : 2;
  }

    /**
   * check if data is valid
   * @private
   * @ignore
   */
  _checkWebGL(): boolean {
    const canvas = document.createElement('canvas');
    let gl;

    canvas.width = 1;
    canvas.height = 1;

    const options = {
      // Turn off things we don't need
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preferLowPowerToHighPerformance: true

      // Still dithering on whether to use this.
      // Recommend avoiding it, as it's overly conservative
      // failIfMajorPerformanceCaveat: true
    };

    try {
      gl =
        canvas.getContext('webgl', options) ||
        canvas.getContext('experimental-webgl', options);
    } catch (e) {
      return false;
    }
    if (gl) {
      return true;
    } else {
      return false;
    }
  }

   /**
   * @ignore
   */
  initEventHandler(): void {
    const fire = (event: string, ...args: Array<any>) => {
      setImmediate(() => {
        this.emit(event, ...args);
      });
    };

    this.mediaPlayer.onEvent('onApiError', (funcName: string) => {
      console.error(`api ${funcName} failed. this is an error
              thrown by c++ addon layer. it often means sth is
              going wrong with this function call and it refused
              to do what is asked. kindly check your parameter types
              to see if it matches properly.`);
    });

    this.mediaPlayer.onEvent('onPlayerStateChanged', (
      state: MEDIA_PLAYER_STATE,
      ec: MEDIA_PLAYER_ERROR
    ) => {
      fire('onPlayerStateChanged', state, ec);
    });

    this.mediaPlayer.onEvent('onPlayEvent', (
      event: MEDIA_PLAYER_EVENT
    ) => {
      fire('onPlayEvent', event);
    });

    // this.mediaPlayer.onEvent('onMetaData', (
    //   error: number,
    //   message: string
    // ) => {
    //   fire('onMetaData', error, message);
    // });

    this.mediaPlayer.onEvent('onPositionChanged', (
      position: number
    ) => {
      fire('onPositionChanged', position);
    });
  }

  /**
   * register renderer for target info
   * @private
   * @ignore
   * @param {number} infos
   */
  onReceiveVideoFrame(infos: any): void {
    const { header, ydata, udata, vdata } = infos;
    const renderer = this._getRenderer();

    if (!renderer)
    {
      return;
    }

    if (this._checkData(header, ydata, udata, vdata)) {
      renderer.drawFrame({
        header,
        yUint8Array: ydata,
        uUint8Array: udata,
        vUint8Array: vdata
      });
    }
  }

   /**
   * check if data is valid
   * @private
   * @ignore
   * @param {*} header
   * @param {*} ydata
   * @param {*} udata
   * @param {*} vdata
   */
  _checkData(
    header: ArrayBuffer,
    ydata: ArrayBuffer,
    udata: ArrayBuffer,
    vdata: ArrayBuffer
  ) {
    if (header.byteLength != 20) {
      console.error('invalid image header ' + header.byteLength);
      return false;
    }
    if (ydata.byteLength === 20) {
      console.error('invalid image yplane ' + ydata.byteLength);
      return false;
    }
    if (udata.byteLength === 20) {
      console.error('invalid image uplanedata ' + udata.byteLength);
      return false;
    }
    if (
      ydata.byteLength != udata.byteLength * 4 ||
      udata.byteLength != vdata.byteLength
    ) {
      console.error(
        'invalid image header ' +
          ydata.byteLength +
          ' ' +
          udata.byteLength +
          ' ' +
          vdata.byteLength
      );
      return false;
    }
    return true;
  }

  setRenderMode(mode: 0 | 1): void {
    this.renderMode = mode;
  }

  /**
   * check if data is valid
   * @param {*} view
   */
  setView(viewContentMode: 0 | 1, view?: Element): number {
    this.initRender(this.renderMode);
    if (view)
    {
      if (this.renderer)
      {
        this.renderer.bind(view);
        this.renderer.setContentMode(viewContentMode);
      }
    }
    else
    {
      if (this.renderer)
      {
        this.renderer.unbind();
        this.renderer = undefined;
      }
    }
    return 0;
  }

  /**
   * check if data is valid
   * @private
   * @ignore
   * @param {*} renderMode
   * @param {*} view
   */
  initRender(renderMode: | number) {
    //let renderer: IRenderer;
    if (renderMode === 1) {
      this.renderer = new GlRenderer();
    } else if (renderMode === 2) {
      this.renderer = new SoftwareRenderer();
    } else if (renderMode === 3) {
      this.renderer = new this.customerRenderer();
    } else {
      console.warn('Unknown render mode, fallback to 1');
      this.renderer = new GlRenderer();
    }
  }

  /**
   * @ignore
   */
  _getRenderer(): any {
    return this.renderer;
  }

  /**
   * Use this method to set custom Renderer when set renderMode in the 
   * {@link setRenderMode} method to 3.
   * CustomRender should be a class.
   * @param {IRenderer} customRenderer Customizes the video renderer.
   */
  setCustomRenderer(customRenderer: IRenderer) {
    this.customerRenderer = customRenderer;
  }

  /**
   * @ignore
   */
  registerVideoFrameObserver(callback: Function): number {
    return this.mediaPlayer.registerVideoFrameObserver(callback);
  }

  initialize(): number {
    const self = this;
    let a = this.mediaPlayer.initialize();
    this.initEventHandler();
    this.mediaPlayer.registerVideoFrameObserver(function(infos: any) {
      self.onReceiveVideoFrame(infos);
    });
    return a;
  }

  open(url: string, position: number): number {
    return this.mediaPlayer.open(url, position);
  }

  play(): number {
    return this.mediaPlayer.play();
  }

  pause(): number {
    return this.mediaPlayer.pause();
  }

  stop(): number {
    return this.mediaPlayer.stop();
  }

  seek(position: number): number {
    return this.mediaPlayer.seek(position);
  }

  mute(mute: boolean): number {
    return this.mediaPlayer.mute(mute);
  }

  getMute(): boolean {
    return this.mediaPlayer.getMute();
  }

  adjustPlayoutVolume(volume: number): number {
    return this.mediaPlayer.adjustPlayoutVolume(volume);
  }

  getPlayoutVolume(): number {
    return this.mediaPlayer.getPlayoutVolume();
  }

  getPlayPosition(): number {
    return this.mediaPlayer.getPlayPosition();
  }

  getDuration(): number {
    return this.mediaPlayer.getDuration();
  }

  getState(): MEDIA_PLAYER_STATE {
    return this.mediaPlayer.getState();
  }

  getStreamCount(): number {
    return this.mediaPlayer.getStreamCount();
  }

  getStreamInfo(index: number) : MediaStreamInfo {
    return this.mediaPlayer.getStreamInfo(index);
  }

  connect(token:string, channelId:string, userId:string): number {
    return this.mediaPlayer.connect(token, channelId, userId);
  }

  disconnect(): number {
    return this.mediaPlayer.disconnect();
  }

  publishVideo(): number {
    return this.mediaPlayer.publishVideo();
  }

  unpublishVideo(): number {
    return this.mediaPlayer.unpublishVideo();
  }

  publishAudio(): number {
    return this.mediaPlayer.publishAudio();
  }

  unpublishAudio(): number {
    return this.mediaPlayer.unpublishAudio();
  }

  adjustPublishSignalVolume(volume: number): number {
    return this.mediaPlayer.adjustPublishSignalVolume(volume);
  }

  setLogFile(filePath: string): number {
    return this.mediaPlayer.setLogFile(filePath);
  }

  setLogFilter(filter: number): number {
    return this.mediaPlayer.setLogFilter(filter);
  }

  setPlayerOption(key: string, value: number): number {
    return this.mediaPlayer.setPlayerOption(key, value);
  }

  changePlaybackSpeed(speed: MEDIA_PLAYER_PLAY_SPEED): number {
    return this.mediaPlayer.changePlaybackSpeed(speed);
  }

  selectAudioTrack(index: number): number {
    return this.mediaPlayer.selectAudioTrack(index);
  }

  setVideoRotation(rotation: 0 | 90 | 180 | 270) {
    return this.mediaPlayer.setVideoRotation(rotation);
  }

  release(): number {
    this.setView(0, undefined);
    let ret = this.mediaPlayer.release();
    return ret;
  }
}

export default AgoraMediaPlayer;
