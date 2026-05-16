<template>
  <div class="music-player" :class="{ 'collapsed': isCollapsed }">
    <!-- 收起时显示的按钮 -->
    <button class="expand-btn" v-show="isCollapsed" @click="isCollapsed = false" title="展开播放器">
      🎵
    </button>

    <!-- 播放器内容 -->
    <div class="player-content" v-show="!isCollapsed">
      <!-- 歌曲名称和收起按钮 -->
      <div class="header">
        <div class="song-title">{{ currentSong.name }}</div>
        <button class="collapse-btn" @click="isCollapsed = true" title="收起">×</button>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button class="control-btn" @click="previousSong" title="上一首">◀</button>
        <button class="control-btn play-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="control-btn" @click="nextSong" title="下一首">▶</button>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <button class="volume-icon" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
          {{ isMuted ? '🔇' : (volumeValue > 50 ? '🔊' : (volumeValue > 0 ? '🔉' : '🔇')) }}
        </button>
        <input 
          type="range" 
          class="volume-slider" 
          min="0" 
          max="100" 
          v-model.number="volumeValue"
          @input="updateVolume"
          :title="`音量: ${volumeValue}%`"
        />
        <span class="volume-text">{{ volumeValue }}%</span>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio 
      ref="audioPlayer"
      @ended="nextSong"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 歌曲列表
const songs = [
  { name: 'Last Christmas', src: '/music/Last Christmas.mp3' },
  { name: 'Lonely Christmas', src: '/music/Lonely Christmas.mp3' },
  { name: '圣诞快乐劳伦斯先生', src: '/music/圣诞快乐劳伦斯先生.mp3' },
  { name: '圣诞星', src: '/music/圣诞星.mp3' },
  { name: '圣诞结', src: '/music/圣诞结.mp3' }
]

// 状态
const audioPlayer = ref(null)
const currentSongIndex = ref(0)
const isPlaying = ref(false)
const isCollapsed = ref(false)
const volumeValue = ref(70)
const isMuted = ref(false)

// 计算属性
const currentSong = computed(() => songs[currentSongIndex.value])

// 方法
const togglePlay = () => {
  if (isPlaying.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const previousSong = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + songs.length) % songs.length
  loadSong()
}

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.length
  loadSong()
}

const loadSong = () => {
  const wasPlaying = isPlaying.value
  audioPlayer.value.src = currentSong.value.src
  audioPlayer.value.load()
  if (wasPlaying) {
    audioPlayer.value.play()
  }
}

const updateVolume = () => {
  audioPlayer.value.volume = volumeValue.value / 100
  if (volumeValue.value > 0) {
    isMuted.value = false
    audioPlayer.value.muted = false
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  audioPlayer.value.muted = isMuted.value
}

// 生命周期
onMounted(() => {
  loadSong()
  audioPlayer.value.volume = volumeValue.value / 100
})

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  top: 30%;
  right: 0;
  background: linear-gradient(135deg, rgba(10, 12, 18, 0.92), rgba(20, 25, 35, 0.88));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 8px 0 0 8px;
  border: 1px solid rgba(100, 130, 170, 0.25);
  border-right: none;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  z-index: 998;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateY(-100%);
}

.music-player.collapsed {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}

.expand-btn {
  width: 32px;
  height: 40px;
  background: linear-gradient(135deg, rgba(20, 28, 42, 0.9), rgba(15, 20, 30, 0.95));
  border: 1px solid rgba(100, 130, 170, 0.25);
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: rgba(150, 180, 220, 0.8);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.3);
}

.expand-btn:hover {
  background: linear-gradient(135deg, rgba(30, 42, 60, 0.95), rgba(25, 35, 50, 0.98));
  color: rgba(180, 210, 250, 1);
  width: 36px;
}

.player-content {
  padding: 8px 12px;
  min-width: 230px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
}

.song-title {
  color: rgba(200, 215, 235, 1);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.collapse-btn {
  width: 20px;
  height: 20px;
  background: rgba(40, 55, 80, 0.6);
  border: 1px solid rgba(100, 130, 170, 0.3);
  border-radius: 4px;
  color: rgba(200, 215, 230, 0.9);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(60, 80, 110, 0.8);
  color: rgba(255, 255, 255, 1);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.control-btn {
  width: 28px;
  height: 28px;
  background: rgba(30, 42, 60, 0.7);
  border: 1px solid rgba(100, 130, 170, 0.3);
  border-radius: 4px;
  color: rgba(150, 180, 220, 0.9);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  outline: none;
}

.control-btn:hover {
  background: rgba(50, 70, 100, 0.85);
  border-color: rgba(120, 150, 190, 0.5);
  color: rgba(180, 210, 250, 1);
  transform: scale(1.05);
}

.control-btn:active {
  transform: scale(0.95);
}

.play-btn {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(60, 90, 140, 0.8), rgba(80, 110, 160, 0.7));
  border-color: rgba(120, 150, 190, 0.4);
  font-size: 14px;
}

.play-btn:hover {
  background: linear-gradient(135deg, rgba(80, 110, 160, 0.9), rgba(100, 130, 180, 0.8));
  box-shadow: 0 4px 12px rgba(80, 120, 180, 0.3);
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(70, 90, 120, 0.2);
}

.volume-icon {
  width: 24px;
  height: 24px;
  background: rgba(30, 42, 60, 0.6);
  border: 1px solid rgba(100, 130, 170, 0.25);
  border-radius: 4px;
  color: rgba(150, 180, 220, 0.9);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.volume-icon:hover {
  background: rgba(50, 70, 100, 0.8);
  color: rgba(180, 210, 250, 1);
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(30, 42, 60, 0.6);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  border: 1px solid rgba(70, 90, 120, 0.3);
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: rgba(120, 160, 210, 0.9);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(80, 120, 180, 0.4);
}

.volume-slider::-webkit-slider-thumb:hover {
  background: rgba(150, 190, 240, 1);
  transform: scale(1.2);
  box-shadow: 0 3px 10px rgba(100, 140, 200, 0.5);
}

.volume-slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  background: rgba(120, 160, 210, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(80, 120, 180, 0.4);
}

.volume-slider::-moz-range-thumb:hover {
  background: rgba(150, 190, 240, 1);
  transform: scale(1.2);
  box-shadow: 0 3px 10px rgba(100, 140, 200, 0.5);
}

.volume-text {
  color: rgba(150, 170, 195, 0.8);
  font-size: 10px;
  font-weight: 500;
  font-family: 'Fira Code', monospace;
  min-width: 32px;
  text-align: right;
  flex-shrink: 0;
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .music-player {
    top: 20%;
  }
  
  .player-content {
    padding: 6px 10px;
    min-width: 210px;
  }
  
  .song-title {
    font-size: 10px;
  }
  
  .control-btn {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }
  
  .play-btn {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  .volume-icon {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }

  .volume-text {
    font-size: 9px;
    min-width: 28px;
  }
}
</style>
