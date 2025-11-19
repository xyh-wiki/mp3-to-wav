/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import SEO from '../components/common/SEO'
import { useI18n } from '../context/I18nContext'

const ToolsPage: React.FC = () => {
  const nav = useNavigate()
  const { t } = useI18n()

  return (
    <>
      <SEO
        title={t('tools.meta.title')}
        description={t('tools.meta.description')}
        path="/tools"
      />
      <div className="page-container">
        <h1 className="page-title">Online Audio Tools</h1>
        <p className="page-subtitle">
          A collection of browser-based audio tools built on WebAssembly FFmpeg. No upload, all in your browser.
        </p>

        <section style={{ marginTop: 24 }}>
          <h2 className="section-title">Core Converters</h2>
          <div className="tool-grid">
            <Card>
              <h3 className="card-title">MP3 → WAV Converter</h3>
              <p className="card-desc">
                Convert MP3 files to uncompressed WAV audio entirely in your browser, with optional trimming and sample rate control.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => nav('/tools/mp3-to-wav')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">WAV → MP3 Converter</h3>
              <p className="card-desc">
                Compress WAV audio into high quality MP3 files. Control bitrate, channels and sample rate.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => nav('/tools/wav-to-mp3')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Multi-format Audio Converter</h3>
              <p className="card-desc">
                Convert audio between MP3, WAV, FLAC, OGG, M4A and AAC with a single click.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/format-converter')}>
                  Open tool
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 className="section-title">Enhancement & Cleanup</h2>
          <div className="tool-grid">
            <Card>
              <h3 className="card-title">Volume Booster</h3>
              <p className="card-desc">
                Increase or decrease the volume of your audio files in decibels. Great for quiet recordings or over-loud tracks.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/volume-boost')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Silence Remover</h3>
              <p className="card-desc">
                Detect and remove leading silence and light background noise using FFT-based filters.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/silence-removal')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Speed &amp; Pitch</h3>
              <p className="card-desc">
                Change playback speed and pitch separately. Create slow-down practice tracks or high-energy versions.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/speed-pitch')}>
                  Open tool
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 className="section-title">Structure &amp; Editing</h2>
          <div className="tool-grid">
            <Card>
              <h3 className="card-title">Merge Audio Files</h3>
              <p className="card-desc">
                Concatenate multiple audio files into a single track. Ideal for joining episodes or segments.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/merge-audio')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Split Audio by Time</h3>
              <p className="card-desc">
                Split audio into fixed-length segments, such as 30-second clips or 5-minute chapters.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/split-audio')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Metadata Editor</h3>
              <p className="card-desc">
                Edit common audio metadata fields like title, artist and album without re-encoding.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/metadata-editor')}>
                  Open tool
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 className="section-title">Analysis &amp; Generator</h2>
          <div className="tool-grid">
            <Card>
              <h3 className="card-title">Waveform Visualizer</h3>
              <p className="card-desc">
                Render a simple waveform for your audio file directly in the browser using Canvas.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/waveform-visualizer')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="card-title">Tone Generator</h3>
              <p className="card-desc">
                Generate pure sine tones at specific frequencies and durations for testing and calibration.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => nav('/tools/tone-generator')}>
                  Open tool
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}

export default ToolsPage
