/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */

import React, { useState } from 'react'
import SEO from '../../components/common/SEO'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useUI } from '../../context/UIContext'
import { convertFormat } from '../../utils/audioAdvanced'

interface FileItem {
  id: string
  file: File
  name: string
  sizeLabel: string
  status: 'pending' | 'converting' | 'done' | 'error'
  url?: string
  outputName?: string
  errorMessage?: string
}

const FormatConverterPage: React.FC = () => {
  const { addToast } = useUI()
  const [files, setFiles] = useState<FileItem[]>([])
  const [targetExt, setTargetExt] = useState<string>('mp3')
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
      const { blob, fileName } = await convertFormat(item.file, targetExt)
      const url = URL.createObjectURL(blob)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: 'done', url, outputName: fileName } : f
        )
      )
    } catch (e: any) {
      console.error(e)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', errorMessage: e?.message || 'Format conversion failed' }
            : f
        )
      )
      addToast({ type: 'error', message: `File ${item.name} failed to convert` })
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
    addToast({ type: 'success', message: 'All files have been converted' })
  }

  const downloadOne = (item: FileItem) => {
    if (!item.url) return
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.outputName || item.name.replace(/\.[^.]+$/, '') + `.${targetExt}`
    a.click()
  }

  const clearList = () => {
    files.forEach((f) => f.url && URL.revokeObjectURL(f.url))
    setFiles([])
  }

  return (
    <>
      <SEO
        title="Multi-format Audio Converter"
        description="Convert audio between MP3, WAV, FLAC, OGG, M4A and AAC in your browser."
        path="/tools/format-converter"
      />
      <div className="page-container">
        <h1 className="page-title">Multi-format Audio Converter</h1>
        <p className="page-subtitle">
          Online audio format converter supporting MP3 / WAV / FLAC / OGG / M4A / AAC, processed entirely in your browser.
        </p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Click or drag audio files here</p>
              <input type="file" accept="audio/*" multiple onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div>
                <div className="field-label">Target format</div>
                <select
                  className="input-select"
                  value={targetExt}
                  onChange={(e) => setTargetExt(e.target.value)}
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="flac">FLAC</option>
                  <option value="ogg">OGG</option>
                  <option value="m4a">M4A</option>
                  <option value="aac">AAC</option>
                </select>
              </div>
            </div>

            <div className="action-row">
              <Button variant="primary" onClick={handleConvertAll} disabled={converting}>
                {converting ? 'Converting...' : 'Start converting all'}
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
                          Convert individually
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

export default FormatConverterPage
