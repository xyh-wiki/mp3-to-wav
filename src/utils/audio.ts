/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 使用 ffmpeg.wasm 在浏览器中完成音频转换（MP3 ↔ WAV）
 */

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export interface ConvertOptions {
  bitrateKbps?: number
  sampleRate?: number
  channels?: 1 | 2
  trimStart?: number
  trimEnd?: number
}

let ffmpeg: any = null

async function loadFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = createFFmpeg({ log: false })
  }
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
}

/**
 * MP3 → WAV
 */
export const convertMp3ToWav = async (file: File, options: ConvertOptions = {}): Promise<Blob> => {
  await loadFFmpeg()
  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  ffmpeg.FS('writeFile', inputName, await fetchFile(file))
  const args: string[] = ['-i', inputName]

  if (options.trimStart && options.trimStart > 0) {
    args.push('-ss', String(options.trimStart))
  }
  if (options.trimEnd && options.trimEnd > 0) {
    args.push('-to', String(options.trimEnd))
  }
  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  args.push(outputName)
  await ffmpeg.run(...args)

  const data = ffmpeg.FS('readFile', outputName)
  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  return new Blob([data.buffer], { type: 'audio/wav' })
}

/**
 * WAV → MP3
 */
export const convertWavToMp3 = async (file: File, options: ConvertOptions = {}): Promise<Blob> => {
  await loadFFmpeg()
  const inputName = 'input.wav'
  const outputName = 'output.mp3'

  ffmpeg.FS('writeFile', inputName, await fetchFile(file))
  const args: string[] = ['-i', inputName]

  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  args.push(outputName)
  await ffmpeg.run(...args)

  const data = ffmpeg.FS('readFile', outputName)
  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  return new Blob([data.buffer], { type: 'audio/mpeg' })
}
