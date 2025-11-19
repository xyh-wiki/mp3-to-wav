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
import { generateTone } from '../../utils/audioAdvanced'

const ToneGeneratorPage: React.FC = () => {
  const { addToast } = useUI()
  const [frequency, setFrequency] = useState<number>(440)
  const [duration, setDuration] = useState<number>(3)
  const [format, setFormat] = useState<string>('wav')
  const [generating, setGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (frequency <= 0) {
      addToast({ type: 'error', message: 'Frequency must be greater than 0 Hz' })
      return
    }
    if (duration <= 0) {
      addToast({ type: 'error', message: 'Duration must be greater than 0 seconds' })
      return
    }
    setGenerating(true)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
    try {
      const blob = await generateTone(frequency, duration, format)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      addToast({ type: 'success', message: 'Tone generated successfully' })
    } catch (e: any) {
      console.error(e)
      addToast({ type: 'error', message: e?.message || 'Tone generation failed' })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `tone_${frequency}Hz_${duration}s.${format}`
    a.click()
  }

  return (
    <>
      <SEO
        title="Tone Generator Online"
        description="Generate pure sine tones for testing and calibration in your browser."
        path="/tools/tone-generator"
      />
      <div className="page-container">
        <h1 className="page-title">Tone Generator</h1>
        <p className="page-subtitle">Generate pure sine wave tones with custom frequency and duration for device calibration and audio testing.</p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="form-row">
              <div>
                <div className="field-label">Frequency (Hz)</div>
                <input
                  type="number"
                  className="input-text"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value) || 0)}
                />
                <p className="field-help">Common choices: 440 Hz (A4 tuning), 1000 Hz (test tone).</p>
              </div>
              <div>
                <div className="field-label">Duration (seconds)</div>
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
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="wav">WAV</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>
            </div>

            <div className="action-row">
              <Button variant="primary" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : 'Generate tone'}
              </Button>
            </div>
          </Card>

          {resultUrl && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Preview & download</h2>
              <audio controls src={resultUrl} style={{ width: '100%', marginBottom: 12 }} />
              <Button variant="primary" onClick={handleDownload}>
                Download
              </Button>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default ToneGeneratorPage
