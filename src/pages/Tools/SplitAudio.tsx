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
import { splitAudioByDuration } from '../../utils/audioAdvanced'

interface ResultItem {
  fileName: string
  url: string
}

const SplitAudioPage: React.FC = () => {
  const { addToast } = useUI()
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number>(30)
  const [targetExt, setTargetExt] = useState<string>('mp3')
  const [splitting, setSplitting] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setResults([])
    }
  }

  const handleSplit = async () => {
    if (!file) {
      addToast({ type: 'error', message: 'Please select an audio file first' })
      return
    }
    if (!duration || duration <= 0) {
      addToast({ type: 'error', message: 'Segment duration must be greater than 0 seconds' })
      return
    }
    setSplitting(true)
    results.forEach((r) => URL.revokeObjectURL(r.url))
    setResults([])
    try {
      const parts = await splitAudioByDuration(file, duration, targetExt)
      const mapped = parts.map((p) => ({
        fileName: p.fileName,
        url: URL.createObjectURL(p.blob)
      }))
      setResults(mapped)
      addToast({ type: 'success', message: `Splitting completed, ${mapped.length} segments generated` })
    } catch (e: any) {
      console.error(e)
      addToast({ type: 'error', message: e?.message || 'Audio splitting failed' })
    } finally {
      setSplitting(false)
    }
  }

  const handleDownloadAll = () => {
    results.forEach((item) => {
      const a = document.createElement('a')
      a.href = item.url
      a.download = item.fileName
      a.click()
    })
  }

  return (
    <>
      <SEO
        title="Split Audio by Duration"
        description="Split audio into fixed-length segments directly in your browser."
        path="/tools/split-audio"
      />
      <div className="page-container">
        <h1 className="page-title">Split Audio by Time</h1>
        <p className="page-subtitle">Split audio into fixed-length segments, ideal for courses, ads or short-form videos.</p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Choose one audio file to split</p>
              <input type="file" accept="audio/*" onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div>
                <div className="field-label">Segment length (seconds)</div>
                <input
                  type="number"
                  className="input-text"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                />
              </div>
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
              <Button variant="primary" onClick={handleSplit} disabled={splitting || !file}>
                {splitting ? 'Splitting...' : 'Start splitting'}
              </Button>
            </div>
          </Card>

          {results.length > 0 && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Split results</h2>
              <p className="field-help">You can preview each file or download all results at once.</p>
              <ul className="result-list">
                {results.map((item) => (
                  <li key={item.fileName} className="result-item">
                    <div className="result-item-main">
                      <span>{item.fileName}</span>
                      <audio controls src={item.url} style={{ maxWidth: 320 }} />
                    </div>
                  </li>
                ))}
              </ul>
              <Button variant="primary" onClick={handleDownloadAll}>
                Download
              </Button>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default SplitAudioPage
