/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: FAQ 页面
 */
import React from 'react'
import SEO from '../components/common/SEO'

const FAQPage: React.FC = () => {
  return (
    <>
      <SEO
        title="FAQ - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="Frequently asked questions about the browser-based MP3/WAV converter."
        canonical="https://mp3-to-wav.xyh.wiki/faq"
      />
      <div className="container section">
        <h1 className="section-title">FAQ</h1>
        <p className="section-subtitle">Common questions about this audio converter.</p>

        <div className="section" style={{ marginTop: 24 }}>
          <h2 className="feature-card-title">Will my files be uploaded?</h2>
          <p className="feature-card-desc">
            No. All conversions happen locally in your browser using WebAssembly. Your audio files never leave your device.
          </p>
        </div>

        <div className="section">
          <h2 className="feature-card-title">Is this free?</h2>
          <p className="feature-card-desc">
            Yes, the tools are free to use. In the future we may display privacy-friendly ads to keep the project running.
          </p>
        </div>
      </div>
    </>
  )
}

export default FAQPage
