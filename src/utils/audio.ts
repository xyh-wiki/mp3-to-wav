/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 使用 ffmpeg.wasm 在浏览器中完成音频转换（MP3 ↔ WAV）
 */

import * as FFmpeg from '@ffmpeg/ffmpeg'  // ✅ 用命名空间导入，避免 "not exported" 问题

// 从命名空间对象中解构需要的方法
const { createFFmpeg, fetchFile } = FFmpeg

/**
 * 转换参数配置
 */
export interface ConvertOptions {
  bitrateKbps?: number      // 比特率，例如 128 / 192 / 320
  sampleRate?: number       // 采样率，例如 44100 / 48000
  channels?: 1 | 2          // 声道数：1=单声道，2=立体声
  trimStart?: number        // 裁剪开始时间（秒，可选）
  trimEnd?: number          // 裁剪结束时间（秒，可选）
}

let ffmpeg: any = null

/**
 * 懒加载 ffmpeg 实例
 * 只在第一次使用时加载 WebAssembly 资源，后续复用
 */
async function loadFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = createFFmpeg({
      log: false, // 调试时可以改为 true 查看详细日志
    })
  }
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
}

/**
 * MP3 → WAV
 * @param file   输入 MP3 文件
 * @param options 转换配置
 */
export const convertMp3ToWav = async (
    file: File,
    options: ConvertOptions = {}
): Promise<Blob> => {
  await loadFFmpeg()

  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  // 将浏览器文件写入 ffmpeg 内存文件系统
  ffmpeg.FS('writeFile', inputName, await fetchFile(file))

  const args: string[] = ['-i', inputName]

  // 裁剪参数
  if (options.trimStart && options.trimStart > 0) {
    args.push('-ss', String(options.trimStart))
  }
  if (options.trimEnd && options.trimEnd > 0) {
    args.push('-to', String(options.trimEnd))
  }

  // 比特率（对 WAV 影响不大，可选）
  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }

  // 采样率
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }

  // 声道
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  args.push(outputName)

  // 执行转换
  await ffmpeg.run(...args)

  // 从内存读取输出文件
  const data = ffmpeg.FS('readFile', outputName)

  // 清理中间文件，避免内存泄漏
  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  // 返回 Blob（WAV）
  return new Blob([data.buffer], { type: 'audio/wav' })
}

/**
 * WAV → MP3
 * @param file   输入 WAV 文件
 * @param options 转换配置
 */
export const convertWavToMp3 = async (
    file: File,
    options: ConvertOptions = {}
): Promise<Blob> => {
  await loadFFmpeg()

  const inputName = 'input.wav'
  const outputName = 'output.mp3'

  ffmpeg.FS('writeFile', inputName, await fetchFile(file))

  const args: string[] = ['-i', inputName]

  // 比特率（对 MP3 体积和音质影响较大）
  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }

  // 采样率
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }

  // 声道
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  args.push(outputName)

  await ffmpeg.run(...args)

  const data = ffmpeg.FS('readFile', outputName)

  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  // 返回 Blob（MP3）
  return new Blob([data.buffer], { type: 'audio/mpeg' })
}