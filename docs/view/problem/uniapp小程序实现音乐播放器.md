# uniapp 小程序音乐播放器

先写好html模块的静态样式

``` html
<template>
  <view class="wrapper">
    <view class="audio-content">
      <view class="audio-control">
        <view class="audio-control-disk">
          <image
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-23/d1251e95528a476f89b1e24cd64d076d.png"
            mode="scaleToFill"></image>
        </view>
        <view class="audio-control-image">
          <image
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-16/f1021faf16fa4c969ad88db3c114576a.jpg"
            mode="scaleToFill"></image>
        </view>
      </view>
      <view class="audio-progress-bar">
        <u-line-progress :percentage="percentage" :showText="false" activeColor="#ffffff"
          inactiveColor="rgba(255,255,255,0.25)"></u-line-progress>
        <view class="progress-time">
          {{ parse(currentTime) }}/{{ parse(duration) }}
        </view>
      </view>
      <view class="pay-control">
        <view class="pay-control-left">
          <image
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-23/7019e4ef4ba244ffada9c5d38b2e3b45.png"
            mode="scaleToFill"
            @click="onSeek(1)"
          />
        </view>
        <view class="pay-control-middle">
          <image
            v-show="paused"
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-23/cd5b7c1b1c6247a389bcdd0cab9cec49.png"
            mode="scaleToFill"
            @click="onPause"
          />
          <image
            v-show="!paused"
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-23/19f4c4c65ecd43b8a5f403f348e15ae7.png"
            mode="scaleToFill"
            @click="onPause"
          />
        </view>
        <view class="pay-control-right">
          <image
            src="https://yizhen-mamapai-test.oss-cn-zhangjiakou.aliyuncs.com/certification/2023-08-23/c3191ca8e12f4ea6ba3d5fbfad066734.png"
            mode="scaleToFill"
            @click="onSeek(2)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

```

通过 <span class="c-red">uni.createInnerAudioContext()</span> 获取 audio 的实例 监听 audio 的变化后 <span class="c-red">onTimeUpdate（进度更新）、onSeeking（快进或快退）、onCanplay（初始化完成）</span> 获取音频长度

```js
<script>
  export default {
    data() {
      return {
        audioSrc: require('../../static/LoveOnTheBrain.mp3'),
        duration: 0,
        currentTime: 0,
        audio: null,
        percentage: 0,
        paused: true
      };
    },
    mounted() {
      // 初始化audio
      this.initAudio()
    },
    methods: {
      // 初始化audio
      initAudio() {
        this.audio = uni.createInnerAudioContext()
        this.audio.src = this.audioSrc
        // 监听audio进度更新
        this.audio.onTimeUpdate(() => {
          const currentTime = Math.floor(this.audio.currentTime)
          this.setTimePercent(currentTime)
          this.currentTime = this.audio.currentTime
        })
        // 监听audio快进或快退
        this.audio.onSeeking(() => {
          const currentTime = Math.floor(this.audio.currentTime)
          this.setTimePercent(currentTime)
          this.currentTime = this.audio.currentTime
        })
        // 监听audio初始化完成后, 获取音频长度
        this.audio.onCanplay(() => {
          const interval = setInterval(() => {
            if (this.audio.duration !== 0) {
              clearInterval(interval)
              this.duration = Math.floor(this.audio.duration)
            }
          }, 100)
        })
        this.audio.onPlay(() => {
          this.paused = false
        })
        this.audio.onPause(() => {
          this.paused = true
        })
      },
      // 销毁audio实例
      destroyAudio() {
        this.duration = 0
        this.currentTime = 0
        this.percentage = 0
        this.audio.onPlay()
        this.audio.onPause()
        this.audio.offTimeUpdate()
        this.audio.offCanplay()
        this.audio.offSeeking()
        this.audio.destroy()
      },
      /**
       * description 切换音乐的时候调用
       * @param {String} src 图片地址
       */
      checkAudio(src) {
        this.audioSrc = src
        this.destroyAudio()
        this.initAudio()
      },
      // 暂停/播放
      onPause() {
        this.audio.paused ? this.audio.play() : this.audio.pause()
      },
      /**
       * @description 快进/快退
       * @param {Enum} type
       *  1: 快退
       *  2: 快进
       */
      onSeek(type) {
        if (this.currentTime <= 0) {
          this.currentTime === 0
          this.audio.seek(0)
          return
        } else if (this.currentTime >= this.duration) {
          this.currentTime = this.duration
          this.audio.seek(this.currentTime)
          return
        }
        
        type === 1 && this.audio.seek(this.currentTime - 2)
        type === 2 && this.audio.seek(this.currentTime + 2)
      },
      /**
       * description 设置时间格式
       * @param {number} number
       */
      parse(number) {
        const m = parseInt(number / 60)
        const s = parseInt(number % 60)
        const _m = m > 10 ? m : '0' + m
        const _s = s > 10 ? s : '0' + s
        return _m + ':' + _s
      },
      /**
       * @description 计算进度条显示比例
       * @param {number} currentTime
       */
      setTimePercent(currentTime) {
        this.percentage = parseFloat((currentTime / this.duration * 100).toFixed(2))
      }
    }
  }
</script>
```

``` css
<style lang="scss" scoped>
  .wrapper {
    width: 100%;
    position: relative;
  }

  .audio-content {
    width: 100%;
    height: 712rpx;
    background: linear-gradient(325deg, #3CB9D5 0%, #19C5BE 100%);
    position: relative;
    box-sizing: border-box;

    .audio-control {
      position: absolute;
      top: 124rpx;
      left: 265rpx;
      right: 265rpx;
      margin: 0 auto;
      z-index: 1;
      margin-bottom: 91rpx;

      .audio-control-disk {
        width: 206rpx;
        height: 206rpx;
        position: absolute;
        top: 7rpx;
        left: 72rpx;
        z-index: 2;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .audio-control-image {
        width: 220rpx;
        height: 220rpx;
        border-radius: 15rpx;
        background-color: #008494;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        overflow: hidden;
        z-index: 3;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .audio-progress-bar {
      width: 100%;
      padding: 0 28rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 249rpx;

      .progress-time {
        font-size: 20rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        margin-left: 18rpx;
      }
    }
  }

  .pay-control {
    width: 300rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 30rpx;
    left: 50%;
    transform: translate(-50%, -50%);

    .pay-control-left {
      width: 30rpx;
      height: 37rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .pay-control-middle {
      width: 100rpx;
      height: 100rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .pay-control-right {
      width: 30rpx;
      height: 37rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

```