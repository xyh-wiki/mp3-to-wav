/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 使用 ffmpeg.wasm 在浏览器中完成音频转换（MP3 ↔ WAV）
 *
 * 说明：
 * 1. 不再使用 `import { createFFmpeg, fetchFile }` 命名导入，避免 Rollup 构建时报
 *    "createFFmpeg is not exported by ..."；
 * 2. 改为命名空间导入：`import * as FFmpegWasm from '@ffmpeg/ffmpeg'`，
 *    再在运行时从模块对象上兼容性地读取 createFFmpeg / fetchFile，
 *    适配 CJS / ESM 的不同导出方式。
 */

import * as FFmpegWasm from '@ffmpeg/ffmpeg'

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
 * 兼容性处理：
 * - 有的环境是：export { createFFmpeg, fetchFile }
 * - 有的环境是：export default { createFFmpeg, fetchFile }
 * 这里统一从两种路径上尝试拿方法，避免 “hm is not a function” 这类问题。
 */
const ffmpegModule: any = FFmpegWasm as any

const createFFmpegFn =
    ffmpegModule.createFFmpeg ||
    (ffmpegModule.default && ffmpegModule.default.createFFmpeg)

const fetchFileFn =
    ffmpegModule.fetchFile ||
    (ffmpegModule.default && ffmpegModule.default.fetchFile)

if (typeof createFFmpegFn !== 'function' || typeof fetchFileFn !== 'function') {
  // 如果走到这里，说明当前 @ffmpeg/ffmpeg 版本确实不对，后面转换肯定也跑不通。
  // 这里抛出明确错误，方便你在开发环境中看到。
  throw new Error('当前 @ffmpeg/ffmpeg 模块中未找到 createFFmpeg / fetchFile，请检查依赖版本')
}

// 全局复用 ffmpeg 实例，避免多次加载 wasm
let ffmpeg: any = null

/**
 * 懒加载 ffmpeg 实例
 * 只在第一次使用时加载 WebAssembly 资源，后续复用
 */
async function loadFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = createFFmpegFn({
      log: false // 调试时可以改为 true 查看详细日志
    })
  }
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
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
  await loadFFmpeg()

  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  // 将浏览器 File 写入到 ffmpeg 内存文件系统
  ffmpeg.FS('writeFile', inputName, await fetchFileFn(file))

  const args: string[] = ['-i', inputName]

  // 裁剪参数
  if (options.trimStart && options.trimStart > 0) {
    args.push('-ss', String(options.trimStart))
  }
  if (options.trimEnd && options.trimEnd > 0) {
    args.push('-to', String(options.trimEnd))
  }

  // 比特率（对 WAV 影响不大，可不设置）
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
  const out = ffmpeg.FS('readFile', outputName)

  // 清理中间文件
  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  // 返回 WAV Blob
  return new Blob([out.buffer], { type: 'audio/wav' })
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
  await loadFFmpeg()

  const inputName = 'input.wav'
  const outputName = 'output.mp3'

  ffmpeg.FS('writeFile', inputName, await fetchFileFn(file))

  const args: string[] = ['-i', inputName]

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

  args.push(outputName)

  await ffmpeg.run(...args)

  const out = ffmpeg.FS('readFile', outputName)

  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  // 返回 MP3 Blob
  return new Blob([out.buffer], { type: 'audio/mpeg' })
}