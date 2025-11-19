/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: MP3 → WAV 
 */
import React, { useState, useRef, useCallback } from 'react'
import SEO from '../../components/common/SEO'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useUI } from '../../context/UIContext'
import { convertMp3ToWav, ConvertOptions } from '../../utils/audio'

interface FileItem {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'converting' | 'done' | 'error'
  url?: string
  errorMessage?: string
}

const Mp3ToWavPage: React.FC = () => {
  const { addToast } = useUI()
  const [files, setFiles] = useState<FileItem[]>([])
  const [options, setOptions] = useState<ConvertOptions>({
    bitrateKbps: 192,
    sampleRate: 44100,
    channels: 2,
    trimStart: 0,
    trimEnd: 0
  })
  const [isConvertingAll, setIsConvertingAll] = useState(false)

  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return
      const newItems: FileItem[] = []
      Array.from(list).forEach((file) => {
        if (!file.name.toLowerCase().endsWith('.mp3')) {
          addToast({ type: 'error', message: 'Only MP3 files are supported' })
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
      const blob = await convertMp3ToWav(item.file, options)
      const url = URL.createObjectURL(blob)
      setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'done', url } : f)))
    } catch (err: any) {
      console.error(err)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', errorMessage: err?.message || 'Conversion failed' }
            : f
        )
      )
      addToast({ type: 'error', message: `File ${item.name} failed to convert` })
    }
  }

  const handleConvertAll = async () => {
    if (files.length === 0) {
      addToast({ type: 'info', message: 'Please add at least one MP3 file first' })
      return
    }
    setIsConvertingAll(true)
    try {
      for (const item of files) {
        if (item.status === 'done') continue
        await convertOne(item)
      }
      addToast({ type: 'success', message: 'All files have been converted' })
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
    a.download = item.name.replace(/\.mp3$/i, '.wav')
    a.click()
  }

  return (
    <>
      <SEO
        title="MP3 → WAV Converter | mp3-to-wav.xyh.wiki"
        description="Convert MP3 to WAV fully offline in your browser using WebAssembly."
        canonical="https://mp3-to-wav.xyh.wiki/tools/mp3-to-wav"
      />
      <div className="page-container">
        <section className="section">
          <h1 className="section-title">MP3 → WAV Converter</h1>
          <p className="section-subtitle">All conversions are processed locally in your browser.</p>

          <div className="page-badges">
            <span className="page-badge">No upload</span>
            <span className="page-badge">Runs locally in your browser</span>
            <span className="page-badge">Powered by WebAssembly FFmpeg</span>
          </div>

          <Card>
            <div
              className="upload-dropzone"
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <p>Click or drag MP3 files here</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3"
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
              <div>
                <div className="field-label">Trim start (sec)</div>
                <input
                  className="input-text"
                  type="number"
                  min={0}
                  value={options.trimStart || 0}
                  onChange={(e) => updateOption('trimStart', Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <div className="field-label">Trim end (sec)</div>
                <input
                  className="input-text"
                  type="number"
                  min={0}
                  value={options.trimEnd || 0}
                  onChange={(e) => updateOption('trimEnd', Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" onClick={handleConvertAll} loading={isConvertingAll}>
                Convert all files
              </Button>
              <Button variant="secondary" onClick={clearAll} disabled={files.length === 0}>
                Clear list
              </Button>
            </div>
          </Card>

          {files.length > 0 && (
            <Card>
              <table className="file-table">
                <thead>
                  <tr>
                    <th>File name</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Action</th>
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
                          Convert individually
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => downloadOne(item)}
                          disabled={!item.url}
                        >
                          Download WAV
                        </Button>
                        <Button variant="ghost" onClick={() => removeFile(item.id)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          <Card style={{ marginTop: 24 }}>  <div className="tool-tips">
    <h2 className="tool-tips-title">Usage tips</h2>
    <ul className="tool-tips-list">
      <li>Best suited for short clips, samples and small batches of files.</li>
      <li>Keep the browser tab open while conversion is running.</li>
      <li>If conversion fails, try a lower bitrate or shorter trim range.</li>
    </ul>
  </div>
</Card>
        </section>
      </div>
    </>
  )
}

export default Mp3ToWavPage