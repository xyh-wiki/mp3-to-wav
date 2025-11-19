/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 首页
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import SEO from '../components/common/SEO'
import { useI18n } from '../context/I18nContext'

const HomePage: React.FC = () => {
  const nav = useNavigate()
  const { t } = useI18n()

  return (
    <>
      <SEO
        title="Online MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="Convert MP3 to WAV and WAV to MP3 directly in your browser at mp3-to-wav.xyh.wiki."
        canonical="https://mp3-to-wav.xyh.wiki/"
      />
      <div className="container">
        <section className="hero">
          <div>
            <div className="hero-badge">
              <span>Local only</span>
              <span>•</span>
              <span>Privacy friendly</span>
            </div>
            <h1 className="hero-title">{t('home.title')}</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>
            <div className="hero-actions">
              <Button variant="primary" onClick={() => nav('/tools/mp3-to-wav')}>
                {t('common.start')}
              </Button>
              <Button variant="secondary" onClick={() => nav('/tools')}>
                {t('common.allTools')}
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-header">
              <span>MP3 → WAV</span>
              <span className="hero-visual-chip">WebAssembly</span>
            </div>
            <div className="hero-visual-row">
              <span>demo.mp3</span>
              <span>128kbps</span>
            </div>
            <div className="hero-visual-progress">
              <div className="hero-visual-progress-inner" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Why mp3-to-wav.xyh.wiki?</h2>
            <p className="section-subtitle">Focused audio tools built for privacy and speed.</p>
          </div>
          <div className="feature-grid">
            <Card>
              <div className="feature-card-title">Local processing</div>
              <p className="feature-card-desc">All conversions run in your browser. No upload, no cloud.</p>
            </Card>
            <Card>
              <div className="feature-card-title">Fast WebAssembly engine</div>
              <p className="feature-card-desc">Powered by ffmpeg.wasm for near-native performance.</p>
            </Card>
            <Card>
              <div className="feature-card-title">Simple UI</div>
              <p className="feature-card-desc">Drag & drop input files, then convert with one click.</p>
            </Card>
            <Card>
              <div className="feature-card-title">No account</div>
              <p className="feature-card-desc">You can use all tools without signing up.</p>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
