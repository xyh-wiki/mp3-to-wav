/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 使用 ffmpeg.wasm 在浏览器中完成音频转换（MP3 ↔ WAV）
 *
 * 说明：
 * 1. 不再在模块顶层使用 `import { createFFmpeg, fetchFile }`，避免构建期的「not exported」错误；
 * 2. 改为在运行时通过 `await import('@ffmpeg/ffmpeg')` 动态加载模块，
 *    再从模块对象中安全地拿到 createFFmpeg / fetchFile，兼容 CJS / ESM 各种打包模式；
 * 3. 所有 ffmpeg 的初始化逻辑统一放在 ensureFFmpegLoaded() 中，转换前调用一次即可。
 */

export interface ConvertOptions {
  bitrateKbps?: number      // 比特率，例如 128 / 192 / 320
  sampleRate?: number       // 采样率，例如 44100 / 48000
  channels?: 1 | 2          // 声道数：1=单声道，2=立体声
  trimStart?: number        // 裁剪开始时间（秒，可选，仅 MP3→WAV 使用）
  trimEnd?: number          // 裁剪结束时间（秒，可选，仅 MP3→WAV 使用）
}

// 全局单例 ffmpeg 实例 & fetchFile 函数
let ffmpeg: any = null
let fetchFileFn: ((input: any) => Promise<Uint8Array> | Uint8Array) | null = null
let ffmpegLoadingPromise: Promise<void> | null = null

/**
 * 动态加载 @ffmpeg/ffmpeg 模块，并初始化 ffmpeg 实例
 * 只会真正执行一次，后续重复调用会直接复用 Promise / 实例
 */
async function ensureFFmpegLoaded(): Promise<void> {
  // 如果已有正在进行的加载，直接等待它完成
  if (ffmpegLoadingPromise) {
    return ffmpegLoadingPromise
  }

  ffmpegLoadingPromise = (async () => {
    // 动态 import 模块，避免构建期检查「未导出」
    const mod: any = await import('@ffmpeg/ffmpeg')

    // 模块可能是：
    // 1）纯 ESM：{ createFFmpeg, fetchFile }
    // 2）default 包了一层：{ default: { createFFmpeg, fetchFile } }
    const createFFmpeg =
        mod.createFFmpeg ||
        (mod.default && mod.default.createFFmpeg)

    const fetchFile =
        mod.fetchFile ||
        (mod.default && mod.default.fetchFile)

    if (typeof createFFmpeg !== 'function' || typeof fetchFile !== 'function') {
      // 这里抛出的错误会出现在控制台里，方便调试
      throw new Error('ffmpeg.wasm 模块加载失败：未找到 createFFmpeg / fetchFile 导出')
    }

    ffmpeg = createFFmpeg({ log: false })
    fetchFileFn = fetchFile

    // 真正加载 WebAssembly 资源
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }
  })()

  return ffmpegLoadingPromise
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
  // 确保 ffmpeg 已经初始化
  await ensureFFmpegLoaded()

  if (!ffmpeg || !fetchFileFn) {
    throw new Error('ffmpeg 未正确初始化')
  }

  const inputName = 'input.mp3'
  const outputName = 'output.wav'

  // 将浏览器的 File 写入到 ffmpeg 的内存文件系统
  const data = await fetchFileFn(file)
  ffmpeg.FS('writeFile', inputName, data)

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

  // 从内存中读取输出文件
  const out = ffmpeg.FS('readFile', outputName)

  // 清理中间文件
  ffmpeg.FS('unlink', inputName)
  ffmpeg.FS('unlink', outputName)

  // 返回浏览器可用的 Blob（WAV）
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
  await ensureFFmpegLoaded()

  if (!ffmpeg || !fetchFileFn) {
    throw new Error('ffmpeg 未正确初始化')
  }

  const inputName = 'input.wav'
  const outputName = 'output.mp3'

  const data = await fetchFileFn(file)
  ffmpeg.FS('writeFile', inputName, data)

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