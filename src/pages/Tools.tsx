/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 工具总览页面
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
        title="Audio Tools Overview | mp3-to-wav.xyh.wiki"
        description="Browse all available browser-based audio tools including MP3 to WAV and WAV to MP3 converters."
        canonical="https://mp3-to-wav.xyh.wiki/tools"
      />
      <div className="container">
        <section className="section">
          <div className="section-header">
            <h1 className="section-title">Tools</h1>
            <p className="section-subtitle">Available browser-based audio utilities.</p>
          </div>

          <div className="feature-grid">
            <Card>
              <h3 className="feature-card-title">MP3 → WAV Converter</h3>
              <p className="feature-card-desc">
                Convert MP3 files to WAV directly inside your browser with WebAssembly.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => nav('/tools/mp3-to-wav')}>
                  Open tool
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="feature-card-title">WAV → MP3 Converter</h3>
              <p className="feature-card-desc">
                Compress large WAV files into MP3 format locally to save space and bandwidth.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => nav('/tools/wav-to-mp3')}>
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
