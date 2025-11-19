/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: WAV → MP3 转换工具页面
 */
import React, { useState, useRef, useCallback } from 'react'
import SEO from '../../components/common/SEO'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useUI } from '../../context/UIContext'
import { convertWavToMp3, ConvertOptions } from '../../utils/audio'

interface FileItem {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'converting' | 'done' | 'error'
  url?: string
  errorMessage?: string
}

const WavToMp3Page: React.FC = () => {
  const { addToast } = useUI()
  const [files, setFiles] = useState<FileItem[]>([])
  const [options, setOptions] = useState<ConvertOptions>({
    bitrateKbps: 192,
    sampleRate: 44100,
    channels: 2
  })
  const [isConvertingAll, setIsConvertingAll] = useState(false)

  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return
      const newItems: FileItem[] = []
      Array.from(list).forEach((file) => {
        if (!file.name.toLowerCase().endsWith('.wav')) {
          addToast({ type: 'error', message: '仅支持 WAV 文件' })
          return
        }
        newItems.push({
          id: Date.now() + Math.random().toString(16),
          file,
          name: file.name,
          size: file.size,
          status: 'pending'
        })
      })
      if (newItems.length > 0) {
        setFiles((prev) => [...prev, ...newItems])
      }
    },
    [addToast]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    dropRef.current?.classList.add('drag-over')
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dropRef.current?.classList.remove('drag-over')
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dropRef.current?.classList.remove('drag-over')
    addFiles(e.dataTransfer.files)
  }
  const openFilePicker = () => fileInputRef.current?.click()

  const updateOption = (key: keyof ConvertOptions, value: number | undefined) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  const convertOne = async (item: FileItem) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: 'converting', errorMessage: undefined } : f
        )
      )
      const blob = await convertWavToMp3(item.file, options)
      const url = URL.createObjectURL(blob)
      setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'done', url } : f)))
    } catch (err: any) {
      console.error(err)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', errorMessage: err?.message || '转换失败' }
            : f
        )
      )
      addToast({ type: 'error', message: `文件 ${item.name} 转换失败` })
    }
  }

  const handleConvertAll = async () => {
    if (files.length === 0) {
      addToast({ type: 'info', message: '请先添加 WAV 文件' })
      return
    }
    setIsConvertingAll(true)
    try {
      for (const item of files) {
        if (item.status === 'done') continue
        await convertOne(item)
      }
      addToast({ type: 'success', message: '所有文件转换完成' })
    } finally {
      setIsConvertingAll(false)
    }
  }

  const clearAll = () => setFiles([])
  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))
  const downloadOne = (item: FileItem) => {
    if (!item.url) return
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.name.replace(/\.wav$/i, '.mp3')
    a.click()
  }

  return (
    <>
      <SEO
        title="WAV → MP3 Converter | mp3-to-wav.xyh.wiki"
        description="Convert WAV to MP3 directly in your browser using WebAssembly at mp3-to-wav.xyh.wiki."
        canonical="https://mp3-to-wav.xyh.wiki/tools/wav-to-mp3"
      />
      <div className="container">
        <section className="section">
          <h1 className="section-title">WAV → MP3 Converter</h1>
          <p className="section-subtitle">
            Compress large WAV files into MP3 format locally in your browser.
          </p>

          <Card>
            <div
              className="upload-dropzone"
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <p>点击选择或拖拽 WAV 文件至此</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav"
                style={{ display: 'none' }}
                multiple
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
                gap: 12,
                marginTop: 12
              }}
            >
              <div>
                <div className="field-label">Bitrate (kbps)</div>
                <select
                  className="input-select"
                  value={options.bitrateKbps || ''}
                  onChange={(e) => updateOption('bitrateKbps', Number(e.target.value) || undefined)}
                >
                  <option value="128">128</option>
                  <option value="160">160</option>
                  <option value="192">192</option>
                  <option value="256">256</option>
                  <option value="320">320</option>
                </select>
              </div>
              <div>
                <div className="field-label">Sample rate (Hz)</div>
                <select
                  className="input-select"
                  value={options.sampleRate || ''}
                  onChange={(e) => updateOption('sampleRate', Number(e.target.value) || undefined)}
                >
                  <option value="22050">22050</option>
                  <option value="44100">44100</option>
                  <option value="48000">48000</option>
                </select>
              </div>
              <div>
                <div className="field-label">Channels</div>
                <select
                  className="input-select"
                  value={options.channels || 2}
                  onChange={(e) =>
                    updateOption('channels', Number(e.target.value) as 1 | 2)
                  }
                >
                  <option value="1">Mono</option>
                  <option value="2">Stereo</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" onClick={handleConvertAll} loading={isConvertingAll}>
                开始转换
              </Button>
              <Button variant="secondary" onClick={clearAll} disabled={files.length === 0}>
                清空列表
              </Button>
            </div>
          </Card>

          {files.length > 0 && (
            <Card>
              <table className="file-table">
                <thead>
                  <tr>
                    <th>文件名</th>
                    <th>大小</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{(item.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td>
                        <span
                          className={[
                            'file-status-pill',
                            item.status === 'pending' && 'file-status-pending',
                            item.status === 'converting' && 'file-status-converting',
                            item.status === 'done' && 'file-status-done',
                            item.status === 'error' && 'file-status-error'
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {item.status}
                        </span>
                        {item.errorMessage && (
                          <span style={{ marginLeft: 6, fontSize: 11, color: '#b91c1c' }}>
                            {item.errorMessage}
                          </span>
                        )}
                      </td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="secondary"
                          onClick={() => convertOne(item)}
                          disabled={item.status === 'converting'}
                        >
                          单独转换
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => downloadOne(item)}
                          disabled={!item.url}
                        >
                          下载 MP3
                        </Button>
                        <Button variant="ghost" onClick={() => removeFile(item.id)}>
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default WavToMp3Page
