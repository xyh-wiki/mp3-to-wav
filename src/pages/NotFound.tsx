/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 404 页面
 */
import React from 'react'
import SEO from '../components/common/SEO'

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | mp3-to-wav.xyh.wiki"
        description="The page you are looking for does not exist."
        canonical="https://mp3-to-wav.xyh.wiki/404"
      />
      <div className="container section">
        <h1 className="section-title">Page not found</h1>
        <p className="section-subtitle">
          The page you are looking for does not exist or has been moved.
        </p>
        <p className="feature-card-desc" style={{ marginTop: 16 }}>
          You can go back to the home page or open one of the audio tools directly.
        </p>
        <ul className="footer-list" style={{ marginTop: 16 }}>
          <li><a href="/">Back to home</a></li>
          <li><a href="/tools/mp3-to-wav">Open MP3 → WAV Converter</a></li>
          <li><a href="/tools/wav-to-mp3">Open WAV → MP3 Converter</a></li>
        </ul>
      </div>
    </>
  )
}

export default NotFoundPage
