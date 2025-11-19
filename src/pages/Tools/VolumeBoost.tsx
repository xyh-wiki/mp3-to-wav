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
import { adjustVolume } from '../../utils/audioAdvanced'

interface FileItem {
  id: string
  file: File
  name: string
  sizeLabel: string
  status: 'pending' | 'converting' | 'done' | 'error'
  url?: string
  errorMessage?: string
}

const VolumeBoostPage: React.FC = () => {
  const { addToast } = useUI()
  const [files, setFiles] = useState<FileItem[]>([])
  const [gainDb, setGainDb] = useState<number>(6)
  const [converting, setConverting] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
  }

  const convertOne = async (item: FileItem) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: 'converting', errorMessage: undefined } : f
        )
      )
      const blob = await adjustVolume(item.file, gainDb, item.file.type || 'audio/mpeg')
      const url = URL.createObjectURL(blob)
      setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'done', url } : f)))
    } catch (e: any) {
      console.error(e)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', errorMessage: e?.message || 'Volume processing failed' }
            : f
        )
      )
      addToast({ type: 'error', message: `File ${item.name} failed to process` })
    }
  }

  const handleConvertAll = async () => {
    if (files.length === 0) return
    setConverting(true)
    for (const item of files) {
      if (item.status === 'pending' || item.status === 'error') {
        // eslint-disable-next-line no-await-in-loop
        await convertOne(item)
      }
    }
    setConverting(false)
    addToast({ type: 'success', message: 'All files have been processed' })
  }

  const downloadOne = (item: FileItem) => {
    if (!item.url) return
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.name.replace(/\.[^.]+$/, '') + `_gain_${gainDb}dB.mp3`
    a.click()
  }

  const clearList = () => {
    files.forEach((f) => f.url && URL.revokeObjectURL(f.url))
    setFiles([])
  }

  return (
    <>
      <SEO
        title="Online Volume Booster - MP3/WAV Gain"
        description="Boost or reduce volume of MP3/WAV files entirely in your browser using WebAssembly FFmpeg."
        path="/tools/volume-boost"
      />
      <div className="page-container">
        <h1 className="page-title">Volume Booster</h1>
        <p className="page-subtitle">Increase or decrease MP3/WAV volume entirely in your browser.</p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Click or drag audio files here (MP3 / WAV)</p>
              <input type="file" accept="audio/*" multiple onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div>
                <div className="field-label">Gain (dB)</div>
                <input
                  type="number"
                  className="input-text"
                  value={gainDb}
                  onChange={(e) => setGainDb(Number(e.target.value) || 0)}
                />
                <p className="field-help">Positive values increase volume, negative values reduce it.</p>
              </div>
            </div>

            <div className="action-row">
              <Button variant="primary" onClick={handleConvertAll} disabled={converting}>
                {converting ? 'Processing...' : 'Start processing all'}
              </Button>
              <Button variant="ghost" onClick={clearList} disabled={files.length === 0}>
                Clear list
              </Button>
            </div>
          </Card>

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
                          variant="secondary"
                          onClick={() => convertOne(item)}
                          disabled={item.status === 'converting'}
                        >
                          Process individually
                        </Button>
                        <Button
                          variant="ghost"
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

export default VolumeBoostPage
