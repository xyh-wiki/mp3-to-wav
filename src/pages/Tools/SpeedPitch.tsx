/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description:  / 
 */

import React, { useState } from 'react'
import SEO from '../../components/common/SEO'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useUI } from '../../context/UIContext'
import { changeSpeedAndPitch } from '../../utils/audioAdvanced'

/**
 * 
 */
interface FileItem {
  id: string
  file: File
  name: string
  sizeLabel: string
  status: 'pending' | 'converting' | 'done' | 'error'
  url?: string
  errorMessage?: string
}

/**
 * 
 * 
 */
const SpeedPitchPage: React.FC = () => {
  const { addToast } = useUI()

  // 
  const [files, setFiles] = useState<FileItem[]>([])
  // 0.5 ~ 2.0
  const [speed, setSpeed] = useState<number>(1.0)
  // 0.8 ~ 1.2
  const [pitch, setPitch] = useState<number>(1.0)
  // 
  const [converting, setConverting] = useState(false)

  /**
   *  FileList Status
   * @param fileList input / drop 
   */
  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return
    }
    const next: FileItem[] = []
    Array.from(fileList).forEach((f) => {
      const sizeLabel = `${(f.size / 1024 / 1024).toFixed(2)} MB`
      next.push({
        id: `${Date.now()}-${f.name}-${Math.random()}`,
        file: f,
        name: f.name,
        sizeLabel,
        status: 'pending'
      })
    })
    setFiles((prev) => [...prev, ...next])
  }

  /**
   * input 
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
  }

  /**
   * 
   */
  const convertOne = async (item: FileItem) => {
    try {
      // 
      setFiles((prev) =>
          prev.map((f) =>
              f.id === item.id ? { ...f, status: 'converting', errorMessage: undefined } : f
          )
      )

      // 
      const mimeType = item.file.type || 'audio/mpeg'
      const blob = await changeSpeedAndPitch(item.file, speed, pitch, mimeType)

      const url = URL.createObjectURL(blob)

      setFiles((prev) =>
          prev.map((f) =>
              f.id === item.id
                  ? {
                    ...f,
                    status: 'done',
                    url
                  }
                  : f
          )
      )
    } catch (e: any) {
      console.error(e)
      setFiles((prev) =>
          prev.map((f) =>
              f.id === item.id
                  ? {
                    ...f,
                    status: 'error',
                    errorMessage: e?.message || 'Speed/pitch processing failed'
                  }
                  : f
          )
      )
      addToast({ type: 'error', message: `File ${item.name} failed to process` })
    }
  }

  /**
   * 
   */
  const handleConvertAll = async () => {
    if (files.length === 0) {
      return
    }
    setConverting(true)
    //  await 
    for (const item of files) {
      if (item.status === 'pending' || item.status === 'error') {
        // eslint-disable-next-line no-await-in-loop
        await convertOne(item)
      }
    }
    setConverting(false)
    addToast({ type: 'success', message: 'All files speed & pitch processing completed' })
  }

  /**
   * Download
   */
  const downloadOne = (item: FileItem) => {
    if (!item.url) {
      return
    }
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.name.replace(/\.[^.]+$/, '') + `_speed_${speed}_pitch_${pitch}.mp3`
    a.click()
  }

  /**
   * Clear list URL 
   */
  const clearList = () => {
    files.forEach((f) => {
      if (f.url) {
        URL.revokeObjectURL(f.url)
      }
    })
    setFiles([])
  }

  return (
      <>
        <SEO
            title="Change Audio Speed & Pitch Online | mp3-to-wav.xyh.wiki"
            description="Change playback speed and pitch of audio files (MP3 / WAV) directly in your browser. No upload, powered by WebAssembly FFmpeg."
            path="/tools/speed-pitch"
        />
        <div className="page-container">
          <h1 className="page-title">Speed &amp; Pitch</h1>
          <p className="page-subtitle">
            
          </p>

          <section style={{ marginTop: 24 }}>
            <Card>
              {/*  */}
              <div className="upload-area">
                <p className="upload-hint">Click or drag audio files here (MP3 / WAV)</p>
                <input type="file" accept="audio/*" multiple onChange={handleInputChange} />
              </div>

              {/*  */}
              <div className="form-row">
                <div>
                  <div className="field-label">Speed ratio (0.5 ~ 2.0)</div>
                  <input
                      type="number"
                      step={0.1}
                      className="input-text"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value) || 1)}
                  />
                  <p className="field-help">Less than 1 slows down, greater than 1 speeds up, e.g. 0.75 / 1.25.</p>
                </div>
                <div>
                  <div className="field-label">Pitch ratio (0.8 ~ 1.2)</div>
                  <input
                      type="number"
                      step={0.05}
                      className="input-text"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value) || 1)}
                  />
                  <p className="field-help">1 keeps pitch unchanged; &gt;1 raises pitch, &lt;1 lowers pitch, e.g. 0.95 / 1.05.</p>
                </div>
              </div>

              {/* Action */}
              <div className="action-row">
                <Button variant="primary" onClick={handleConvertAll} disabled={converting}>
                  {converting ? 'Processing...' : 'Start processing all'}
                </Button>
                <Button variant="ghost" onClick={clearList} disabled={files.length === 0}>
                  Clear list
                </Button>
              </div>
            </Card>

            {/*  */}
            {files.length > 0 && (
                <Card style={{ marginTop: 24 }}>
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
                          <td>{item.sizeLabel}</td>
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
                                <span className="file-status-error-text">{item.errorMessage}</span>
                            )}
                          </td>
                          <td className="file-actions">
                            <Button
                                variant='secondary'
                                onClick={() => convertOne(item)}
                                disabled={item.status === 'converting'}
                            >
                              Process individually
                            </Button>
                            <Button
                                variant='ghost'
                                onClick={() => downloadOne(item)}
                                disabled={item.status !== 'done'}
                            >
                              Download
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

export default SpeedPitchPage