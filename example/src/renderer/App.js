import React, { Component } from 'react';
import AgoraMediaPlayer from '../../../';
import { List } from 'immutable';
import path from 'path';
import os from 'os'

import {voiceChangerList, voiceReverbPreset, videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID, RTMP_URL, voiceReverbList, FU_AUTH } from '../utils/settings'
import {readImage} from '../utils/base64'
import WindowPicker from './components/WindowPicker/index.js'
import DisplayPicker from './components/DisplayPicker/index.js'
import { VoiceChangerPreset } from '../../../JS/Api/native_type';

const isMac = process.platform === 'darwin'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.mediaPlayer = this.getMediaPlayer()
    this.state = {
      mediaPlayerView: ''
    }
  }


  getMediaPlayer() {
    if(!this.mediaPlayer) {
      this.mediaPlayer = new AgoraMediaPlayer()
      // this.rtcEngine.setAddonLogFile("electron_test_log.txt");
      // this.mediaPlayer = this.rtcEngine.createMediaPlayer();
      let ret1 = this.mediaPlayer.initialize();
      console.log(`initialize  ${ret1}`)
      this.mediaPlayer.on('onPlayerStateChanged', (state, ec)=>{
        console.log(`onPlayerStateChanged  state: ${state}  ec:${ec}`);
        if (state == 2) {
          this.setState({
            mediaPlayerView: "mediaPlayerView",
        })
        let a19 = this.mediaPlayer.setLogFile("log.txt")
        console.log(`mediaPlayer.setLogFile ${a19}`);
        
        let mediaInfo = this.mediaPlayer.getStreamInfo(0);
        if (mediaInfo.streamType == 1) {
          let rotation = mediaInfo.videoRotation;
          this.mediaPlayer.setVideoRotation(rotation)
        } else {
          let mediaInfo1 = this.mediaPlayer.getStreamInfo(1);
          if (mediaInfo1.streamType == 1) {
            let rotation = mediaInfo1.videoRotation;
            this.mediaPlayer.setVideoRotation(rotation)
          }
        }

        let a = this.mediaPlayer.play();
        console.log(`mediaPlayer.play ${a}`);

          // let a21 = this.mediaPlayer.setPlayerOption("", 1)
          // console.log(`mediaPlayer.setPlayerOption ${a21}`);

          // let a1 = this.mediaPlayer.pause()
          // console.log(`mediaPlayer.pause ${a1}`);

          // let a3 = this.mediaPlayer.seek(5)
          // console.log(`mediaPlayer.seek ${a3}`);
          // let a4 = this.mediaPlayer.mute(true)
          // console.log(`mediaPlayer.mute ${a4}`);
          // let a5 = this.mediaPlayer.getMute()
          // console.log(`mediaPlayer.getMute ${a5}`);
          let a6 = this.mediaPlayer.adjustPlayoutVolume(100)
          console.log(`mediaPlayer.adjustPlayoutVolume ${a6}`);
          // let a7 = this.mediaPlayer.getPlayoutVolume()
          // console.log(`mediaPlayer.getPlayoutVolume ${a7}`);
          // let a8 = this.mediaPlayer.getPlayPosition()
          // console.log(`mediaPlayer.getPlayPosition ${a8}`);
          let a9 = this.mediaPlayer.getDuration()
          console.log(`mediaPlayer.getDuration ${a9}`);
          let a10 = this.mediaPlayer.getState()
          console.log(`mediaPlayer.getState ${a10}`);
          // let a11 = this.mediaPlayer.getStreamCount()
          // console.log(`mediaPlayer.getStreamCount ${a11}`);
          // let a12 = this.mediaPlayer.connect("", "123", "")
          // console.log(`mediaPlayer.connect ${a12}`);
          // let a13 = this.mediaPlayer.disconnect()
          // console.log(`mediaPlayer.disconnect ${a13}`);
          // let a14 = this.mediaPlayer.publishVideo()
          // console.log(`mediaPlayer.publishVideo ${a14}`);
          // let a15 = this.mediaPlayer.unpublishVideo()
          // console.log(`mediaPlayer.unpublishVideo ${a15}`);
          // let a16 = this.mediaPlayer.publishAudio()
          // console.log(`mediaPlayer.publishAudio ${a16}`);
          // let a17 = this.mediaPlayer.unpublishAudio()
          // console.log(`mediaPlayer.unpublishAudio ${a17}`);
          // let a18 = this.mediaPlayer.adjustPublishSignalVolume(90)
          // console.log(`mediaPlayer.adjustPublishSignalVolume ${a18}`);
          // let a20 = this.mediaPlayer.setLogFilter(1)
          // console.log(`mediaPlayer.setLogFilter ${a20}`);
          // let a22 = this.mediaPlayer.changePlaybackSpeed(200)
          // console.log(`mediaPlayer.changePlaybackSpeed ${a22}`);
          // let a23 = this.mediaPlayer.selectAudioTrack(1)
          // console.log(`mediaPlayer.selectAudioTrack ${a23}`);
          // let a2 = this.mediaPlayer.stop()
          // console.log(`mediaPlayer.stop ${a2}`);

        }
      })

      this.mediaPlayer.on('onPlayEvent', (event)=>{
        console.log(`onPlayEvent  event: ${event}`);
      })

      this.mediaPlayer.on('onPositionChanged', (position)=>{
        console.log(`onPositionChanged  position: ${position}`);
          this.setState({
            mediaPlayerView: "mediaPlayerView"
          })
      })

      this.mediaPlayer.open("https://big-class-test.oss-cn-hangzhou.aliyuncs.com/61102.1592987815092.mp4", 0);
      window.mediaPlayer = this.mediaPlayer;
    }

    return this.mediaPlayer
  }

  componentDidMount() {
  }


  handleRelease = () => {
  }

  render() {
    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>
        <div className="column is-three-quarters window-container">

          {this.state.mediaPlayerView ? (<MediaPlayerWindow mediaPlayer={this.mediaPlayer}>

          </MediaPlayerWindow>) : ''}
        </div>
      </div>
    )
  }
}

class MediaPlayerWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    let dom = document.querySelector("#mediaPlayerView")
    console.log(`MediaPlayerWindow  dom: ${dom}`)
    this.props.mediaPlayer.setView(1, dom);
  }

  render() {
    return (
      <div className="window-item">
        <div className="video-item" id="mediaPlayerView">
        <p className="mirrorRotateHorizontal"></p>
        </div>
      </div>
    )
  }
}

class Window extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    let dom = document.querySelector(`#video-${this.props.channel || ""}-${this.props.uid}`)
    if (this.props.role === 'local') {
      dom && this.props.rtcEngine.setupLocalVideo(dom)
    } else if (this.props.role === 'localVideoSource') {
      dom && this.props.rtcEngine.setupLocalVideoSource(dom)
      this.props.rtcEngine.setupViewContentMode('videosource', 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    } else if (this.props.role === 'remote') {
      dom && this.props.rtcEngine.setupRemoteVideo(this.props.uid, dom, this.props.channel)
      this.props.rtcEngine.setupViewContentMode(this.props.uid, 1);
    } else if (this.props.role === 'remoteVideoSource') {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom, this.props.channel)
      this.props.rtcEngine.setupViewContentMode('videosource', 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    }
  }

  render() {
    return (
      <div className="window-item">
        <div className="video-item" id={`video-${this.props.channel || ""}-${this.props.uid}`}></div>
      </div>
    )
  }
}