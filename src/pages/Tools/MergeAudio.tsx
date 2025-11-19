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
import { mergeAudios } from '../../utils/audioAdvanced'

interface FileItem {
  id: string
  file: File
  name: string
  sizeLabel: string
}

const MergeAudioPage: React.FC = () => {
  const { addToast } = useUI()
  const [files, setFiles] = useState<FileItem[]>([])
  const [targetExt, setTargetExt] = useState<string>('mp3')
  const [merging, setMerging] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultName, setResultName] = useState<string>('merged.mp3')

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const next: FileItem[] = []
    Array.from(fileList).forEach((f) => {
      const sizeLabel = `${(f.size / 1024 / 1024).toFixed(2)} MB`
      next.push({
        id: `${Date.now()}-${f.name}-${Math.random()}`,
        file: f,
        name: f.name,
        sizeLabel
      })
    })
    setFiles((prev) => [...prev, ...next])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      addToast({ type: 'error', message: 'Please select at least two audio files to merge' })
      return
    }
    setMerging(true)
    setResultUrl(null)
    try {
      const fileList = files.map((f) => f.file)
      const { blob, fileName } = await mergeAudios(fileList, targetExt)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setResultName(fileName)
      addToast({ type: 'success', message: 'Audio merge completed' })
    } catch (e: any) {
      console.error(e)
      addToast({ type: 'error', message: e?.message || 'Audio merge failed' })
    } finally {
      setMerging(false)
    }
  }

  const clearList = () => {
    setFiles([])
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = resultName
    a.click()
  }

  return (
    <>
      <SEO
        title="Merge Audio Files Online"
        description="Merge multiple audio files into one track directly in your browser."
        path="/tools/merge-audio"
      />
      <div className="page-container">
        <h1 className="page-title">Merge Audio Files</h1>
        <p className="page-subtitle">Merge multiple audio files into one track in order, suitable for highlights or course content.</p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Click or drag multiple audio files here to merge (preferably in the same format).</p>
              <input type="file" accept="audio/*" multiple onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div>
                <div className="field-label">Output format</div>
                <select
                  className="input-select"
                  value={targetExt}
                  onChange={(e) => setTargetExt(e.target.value)}
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                </select>
              </div>
            </div>

            <div className="action-row">
              <Button variant="primary" onClick={handleMerge} disabled={merging || files.length < 2}>
                {merging ? 'Merging...' : 'Start merging'}
              </Button>
              <Button variant="ghost" onClick={clearList} disabled={files.length === 0 && !resultUrl}>
                Clear
              </Button>
            </div>
          </Card>

          {files.length > 0 && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Files to merge</h2>
              <table className="file-table">
                <thead>
                  <tr>
                    <th>File name</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.sizeLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {resultUrl && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Merge result</h2>
              <p className="field-help">Once merged, you can preview or download the result.</p>
              <audio controls src={resultUrl} style={{ width: '100%', marginBottom: 12 }} />
              <Button variant="primary" onClick={handleDownload}>
                Download merged audio
              </Button>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default MergeAudioPage
