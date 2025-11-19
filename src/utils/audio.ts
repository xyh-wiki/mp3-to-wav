
/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description:  @ffmpeg/ffmpegFFmpeg MP3 ↔ WAV
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'

/**
 * 
 */
export interface ConvertOptions {
  bitrateKbps?: number      //  128 / 192 / 320
  sampleRate?: number       //  44100 / 48000
  channels?: 1 | 2          // 1=2=
  trimStart?: number        //  MP3→WAV 
  trimEnd?: number          //  MP3→WAV 
}

/**
 * File -> Uint8Array FFmpeg 
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buf = await file.arrayBuffer()
  return new Uint8Array(buf)
}

/**
 *  FFmpeg  wasm
 */
let ffmpegInstance: FFmpeg | null = null

/**
 *  FFmpeg 
 */
async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
  }
  if (!ffmpegInstance.loaded) {
    await ffmpegInstance.load()
  }
  return ffmpegInstance
}

/**
 * MP3 → WAV
 * @param file     MP3 
 * @param options 
 */
export const convertMp3ToWav = async (
  file: File,
  options: ConvertOptions = {}
): Promise<Blob> => {
  const ffmpeg = await getFFmpeg()

  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  // 
  const inputData = await fileToUint8Array(file)
  await ffmpeg.writeFile(inputName, inputData)

  const args: string[] = []

  //  -i 
  if (options.trimStart && options.trimStart > 0) {
    args.push('-ss', String(options.trimStart))
  }
  if (options.trimEnd && options.trimEnd > 0) {
    args.push('-to', String(options.trimEnd))
  }

  // 
  args.push('-i', inputName)

  //  WAV 
  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }

  // 
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }

  // 
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  // 
  args.push(outputName)

  // 
  await ffmpeg.exec(args)

  // 
  const outData = await ffmpeg.readFile(outputName)

  // 
  try {
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
  } catch (e) {
    // 
  }

  return new Blob([(outData as Uint8Array).buffer], { type: 'audio/wav' })
}

/**
 * WAV → MP3
 * @param file     WAV 
 * @param options 
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

  const args: string[] = ['-i', inputName]

  //  MP3 
  if (options.bitrateKbps) {
    args.push('-b:a', `${options.bitrateKbps}k`)
  }

  // 
  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate))
  }

  // 
  if (options.channels) {
    args.push('-ac', String(options.channels))
  }

  args.push(outputName)

  // 
  await ffmpeg.exec(args)

  const outData = await ffmpeg.readFile(outputName)

  try {
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
  } catch (e) {
    // 
  }

  return new Blob([(outData as Uint8Array).buffer], { type: 'audio/mpeg' })
}
