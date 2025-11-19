
/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description:  /  /  /  /  / 
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'

/**
 * 
 * 
 */
export interface CommonAudioOptions {
  bitrateKbps?: number // 
  sampleRate?: number // 
  channels?: 1 | 2 // 
}

/**
 * @description  File  Uint8Array FFmpeg 
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buf = await file.arrayBuffer()
  return new Uint8Array(buf)
}

/**
 * @description Uint8Array  Blob MIME 
 */
function fileDataToBlob(data: Uint8Array, mime: string): Blob {
  return new Blob([data.buffer], { type: mime })
}

/**
 * @description  FFmpeg  wasm
 */
let ffmpegInstance: FFmpeg | null = null

/**
 * @description  FFmpeg 
 *  wasm 
 */
export async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
  }
  if (!ffmpegInstance.loaded) {
    //  coreURL / wasmURL CDN 
    await ffmpegInstance.load()
  }
  return ffmpegInstance
}

/**
 * 1️⃣  / 
 * @param file   
 * @param gainDb dB
 */
export async function adjustVolume(
  file: File,
  gainDb: number,
  mime: string = 'audio/mpeg'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const input = 'in_volume'
  const output = 'out_volume'

  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  const filter = `volume=${gainDb}dB`
  const args = ['-i', input, '-af', filter, '-y', output]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  await ffmpeg.deleteFile(input)
  await ffmpeg.deleteFile(output)

  return fileDataToBlob(out, mime)
}

/**
 * 2️⃣  + 
 * @description  afftdn  silenceremove 
 */
export async function removeSilence(
  file: File,
  mime: string = 'audio/mpeg'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const input = 'in_silence'
  const output = 'out_silence'

  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  const filter =
    'afftdn,' +
    'silenceremove=start_periods=1:start_silence=0.3:start_threshold=-45dB:window=0.5'

  const args = ['-i', input, '-af', filter, '-y', output]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  await ffmpeg.deleteFile(input)
  await ffmpeg.deleteFile(output)

  return fileDataToBlob(out, mime)
}

/**
 * 3️⃣  + 
 * @param speed   0.5 ~ 2.0
 * @param pitch   0.8 ~ 1.21 
 */
export async function changeSpeedAndPitch(
  file: File,
  speed: number,
  pitch: number,
  mime: string = 'audio/mpeg'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const input = 'in_speed_pitch'
  const output = 'out_speed_pitch'

  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  //  asetrate  aresample 
  const filters = [
    `asetrate=44100*${pitch.toFixed(3)}`,
    'aresample=44100',
    `atempo=${speed.toFixed(3)}`
  ].join(',')

  const args = ['-i', input, '-af', filters, '-y', output]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  await ffmpeg.deleteFile(input)
  await ffmpeg.deleteFile(output)

  return fileDataToBlob(out, mime)
}

/**
 * 4️⃣ MP3/WAV/FLAC/OGG/M4A/AAC
 */
export async function convertFormat(
  file: File,
  targetExt: string
): Promise<{ blob: Blob; fileName: string }> {
  const ffmpeg = await getFFmpeg()
  const originExt = (file.name.split('.').pop() || 'bin').toLowerCase()
  const safeBaseName = file.name.replace(/\.[^.]+$/, '')

  const input = `input.${originExt}`
  const output = `output.${targetExt}`

  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  const args = ['-i', input, '-y', output]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  await ffmpeg.deleteFile(input)
  await ffmpeg.deleteFile(output)

  const mimeMap: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
    aac: 'audio/aac'
  }

  const mime = mimeMap[targetExt.toLowerCase()] || 'audio/octet-stream'

  return {
    blob: fileDataToBlob(out, mime),
    fileName: `${safeBaseName}.${targetExt}`
  }
}

/**
 * 5️⃣ 
 */
export async function mergeAudios(
  files: File[],
  targetExt: string
): Promise<{ blob: Blob; fileName: string }> {
  const ffmpeg = await getFFmpeg()
  const listFile = 'concat_list.txt'
  let listContent = ''

  for (let i = 0; i < files.length; i += 1) {
    const inputName = `in_${i}.${targetExt}`
    await ffmpeg.writeFile(inputName, await fileToUint8Array(files[i]))
    listContent += `file '${inputName}'\n`
  }

  await ffmpeg.writeFile(listFile, new TextEncoder().encode(listContent))

  const output = `merged.${targetExt}`
  const args = ['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', '-y', output]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  // 
  for (let i = 0; i < files.length; i += 1) {
    const inputName = `in_${i}.${targetExt}`
    await ffmpeg.deleteFile(inputName)
  }
  await ffmpeg.deleteFile(listFile)
  await ffmpeg.deleteFile(output)

  const mimeMap: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav'
  }
  const mime = mimeMap[targetExt.toLowerCase()] || 'audio/octet-stream'

  return {
    blob: fileDataToBlob(out, mime),
    fileName: `merged.${targetExt}`
  }
}

/**
 * 6️⃣  duration 
 */
export async function splitAudioByDuration(
  file: File,
  durationSec: number,
  targetExt: string = 'mp3'
): Promise<{ fileName: string; blob: Blob }[]> {
  const ffmpeg = await getFFmpeg()
  const originExt = (file.name.split('.').pop() || targetExt).toLowerCase()
  const input = `split_input.${originExt}`
  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  const pattern = 'part_%03d.' + targetExt
  const args = [
    '-i',
    input,
    '-f',
    'segment',
    '-segment_time',
    String(durationSec),
    '-c',
    'copy',
    '-y',
    pattern
  ]

  await ffmpeg.exec(args)

  const results: { fileName: string; blob: Blob }[] = []
  for (let i = 0; i < 100; i += 1) {
    const name = `part_${String(i).padStart(3, '0')}.${targetExt}`
    try {
      const out = (await ffmpeg.readFile(name)) as Uint8Array
      const mime = targetExt.toLowerCase() === 'mp3' ? 'audio/mpeg' : 'audio/wav'
      results.push({ fileName: name, blob: fileDataToBlob(out, mime) })
      await ffmpeg.deleteFile(name)
    } catch {
      break
    }
  }

  await ffmpeg.deleteFile(input)
  return results
}

/**
 * 7️⃣ 
 * @param frequency  Hz
 * @param seconds    
 */
export async function generateTone(
  frequency: number,
  seconds: number,
  targetExt: string = 'wav'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const output = `tone.${targetExt}`

  const args = [
    '-f',
    'lavfi',
    '-i',
    `sine=frequency=${frequency}:duration=${seconds}`,
    '-y',
    output
  ]

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array
  await ffmpeg.deleteFile(output)

  const mime = targetExt.toLowerCase() === 'wav' ? 'audio/wav' : 'audio/mpeg'
  return fileDataToBlob(out, mime)
}

/**
 * 8️⃣ 
 * @param metadata   { title: 'Song', artist: 'XYH' }
 */
export async function editMetadata(
  file: File,
  metadata: { title?: string; artist?: string; album?: string }
): Promise<{ blob: Blob; fileName: string }> {
  const ffmpeg = await getFFmpeg()
  const ext = (file.name.split('.').pop() || 'mp3').toLowerCase()
  const safeBaseName = file.name.replace(/\.[^.]+$/, '')
  const input = `meta_in.${ext}`
  const output = `meta_out.${ext}`

  await ffmpeg.writeFile(input, await fileToUint8Array(file))

  const args: string[] = ['-i', input]

  if (metadata.title) args.push('-metadata', `title=${metadata.title}`)
  if (metadata.artist) args.push('-metadata', `artist=${metadata.artist}`)
  if (metadata.album) args.push('-metadata', `album=${metadata.album}`)

  args.push('-c', 'copy', '-y', output)

  await ffmpeg.exec(args)
  const out = (await ffmpeg.readFile(output)) as Uint8Array

  await ffmpeg.deleteFile(input)
  await ffmpeg.deleteFile(output)

  const mime = ext === 'mp3' ? 'audio/mpeg' : ext === 'wav' ? 'audio/wav' : 'audio/octet-stream'

  return {
    blob: fileDataToBlob(out, mime),
    fileName: `${safeBaseName}_meta.${ext}`
  }
}
