/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */

import React, { useEffect, useRef, useState } from 'react'
import SEO from '../../components/common/SEO'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useUI } from '../../context/UIContext'

interface WaveState {
  fileName: string
  url: string
}

const WaveformVisualizerPage: React.FC = () => {
  const { addToast } = useUI()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioState, setAudioState] = useState<WaveState | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setAudioFile(f)
      const url = URL.createObjectURL(f)
      setAudioState({ fileName: f.name, url })
    }
  }

  useEffect(() => {
    if (!audioFile || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    let cancelled = false

    const drawWaveform = async () => {
      try {
        const arrayBuffer = await audioFile.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        if (cancelled) return

        const rawData = audioBuffer.getChannelData(0)
        const samples = 800
        const blockSize = Math.floor(rawData.length / samples)
        const filteredData: number[] = []
        for (let i = 0; i < samples; i += 1) {
          let sum = 0
          const blockStart = i * blockSize
          for (let j = 0; j < blockSize; j += 1) {
            sum += Math.abs(rawData[blockStart + j])
          }
          filteredData.push(sum / blockSize)
        }

        const width = canvas.width
        const height = canvas.height
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#f4f4f5'
        ctx.fillRect(0, 0, width, height)
        ctx.strokeStyle = '#6366f1'
        ctx.lineWidth = 1

        ctx.beginPath()
        const middle = height / 2
        filteredData.forEach((v, i) => {
          const x = (i / filteredData.length) * width
          const y = middle + (v * height) / 2 * (Math.random() > 0.5 ? 1 : -1)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      } catch (e) {
        console.error(e)
        addToast({ type: 'error', message: 'Waveform rendering failed' })
      }
    }

    drawWaveform()

    return () => {
      cancelled = true
      audioContext.close()
    }
  }, [audioFile, addToast])

  const handleClear = () => {
    if (audioState?.url) {
      URL.revokeObjectURL(audioState.url)
    }
    setAudioFile(null)
    setAudioState(null)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <>
      <SEO
        title="Waveform Visualizer Online"
        description="Visualize audio waveform directly in your browser using Canvas."
        path="/tools/waveform-visualizer"
      />
      <div className="page-container">
        <h1 className="page-title">Waveform Visualizer</h1>
        <p className="page-subtitle">Render the audio waveform directly in your browser to quickly inspect structure and dynamics.</p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Select an audio file to view its waveform</p>
              <input type="file" accept="audio/*" onChange={handleInputChange} />
            </div>

            <div style={{ marginTop: 16 }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                style={{ width: '100%', borderRadius: 12, backgroundColor: '#f4f4f5' }}
              />
            </div>

            <div className="action-row">
              <Button variant="ghost" onClick={handleClear} disabled={!audioState}>
                Clear
              </Button>
            </div>
          </Card>

          {audioState && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Current file</h2>
              <p className="field-help">{audioState.fileName}</p>
              <audio controls src={audioState.url} style={{ width: '100%' }} />
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default WaveformVisualizerPage
