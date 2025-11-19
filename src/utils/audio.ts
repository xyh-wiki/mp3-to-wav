/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 使用新版 @ffmpeg/ffmpeg（FFmpeg 类）在浏览器中完成音频转换（MP3 ↔ WAV）
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'

/**
 * 转换参数配置
 */
export interface ConvertOptions {
  bitrateKbps?: number      // 比特率，例如 128 / 192 / 320
  sampleRate?: number       // 采样率，例如 44100 / 48000
  channels?: 1 | 2          // 声道数：1=单声道，2=立体声
  trimStart?: number        // 裁剪开始时间（秒，可选，仅 MP3→WAV 使用）
  trimEnd?: number          // 裁剪结束时间（秒，可选，仅 MP3→WAV 使用）
}

/**
 * 将浏览器 File 转为 Uint8Array，方便写入 ffmpeg 虚拟文件系统
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buf = await file.arrayBuffer()
  return new Uint8Array(buf)
}

// 全局复用一个 FFmpeg 实例，避免多次初始化 wasm 和 worker
let ffmpegInstance: FFmpeg | null = null

/**
 * 懒加载并初始化 FFmpeg 实例
 */
async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
  }
  if (!ffmpegInstance.loaded) {
    // 这里不指定 corePath，使用 @ffmpeg/ffmpeg 内置的 CORE_URL（走 unpkg CDN）
    await ffmpegInstance.load()
  }
  return ffmpegInstance
}

/**
 * MP3 → WAV
 * @param file    输入 MP3 文件
 * @param options 转换配置
 */
export const convertMp3ToWav = async (
    file: File,
    options: ConvertOptions = {}
): Promise<Blob> => {
  const ffmpeg = await getFFmpeg()

  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  // 写入输入文件
  const inputData = await fileToUint8Array(file)
  await ffmpeg.writeFile(inputName, inputData)

  const args: string[] = []

  // ⚠ 注意新版 API：这里 args 就是完整命令行参数数组
  // 裁剪参数（简单处理：放在 -i 前后都可以，这里按 “先 -ss/-to 再 -i” 的习惯来）
  if (options.trimStart && options.trimStart > 0) {
    args.push('-ss', String(options.trimStart))
  }
  if (options.trimEnd && options.trimEnd > 0) {
    args.push('-to', String(options.trimEnd))
  }

  // 输入输出
  args.push('-i', inputName)

  // 比特率
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

  // 输出文件名
  args.push(outputName)

  // 执行转换命令
  await ffmpeg.exec(args)

  // 读取输出文件
  const outData = await ffmpeg.readFile(outputName)

  // 清理虚拟文件，避免长时间占内存
  try {
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
  } catch (e) {
    // 删除失败不影响主流程，这里忽略就行
    // console.warn('清理 ffmpeg 虚拟文件失败：', e)
  }

  // 返回 WAV Blob
  return new Blob([outData.buffer], { type: 'audio/wav' })
}

/**
 * WAV → MP3
 * @param file    输入 WAV 文件
 * @param options 转换配置
 */
export const convertWavToMp3 = async (
    file: File,
    options: ConvertOptions = {}
): Promise<Blob> => {
  const ffmpeg = await getFFmpeg()

  const inputName = 'input.wav'
  const outputName = 'output.mp3'

  const inputData = await fileToUint8Array(file)
  await ffmpeg.writeFile(inputName, inputData)

  const args: string[] = []

  // 输入
  args.push('-i', inputName)

  // 比特率（对 MP3 大小和音质影响较大）
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

  // 输出
  args.push(outputName)

  await ffmpeg.exec(args)

  const outData = await ffmpeg.readFile(outputName)

  try {
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
  } catch (e) {
    // 同样忽略清理异常
  }

  return new Blob([outData.buffer], { type: 'audio/mpeg' })
}