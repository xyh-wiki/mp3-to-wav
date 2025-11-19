/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Terms of Service 
 */
import React from 'react'
import SEO from '../components/common/SEO'

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms of Service - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="Terms of use for mp3-to-wav.xyh.wiki."
        canonical="https://mp3-to-wav.xyh.wiki/terms-of-service"
      />
      <div className="container section">
        <h1 className="section-title">Terms of Service</h1>
        <p className="section-subtitle">Please read these terms before using mp3-to-wav.xyh.wiki.</p>

        <div className="section" style={{ marginTop: 24 }}>
          <h2 className="feature-card-title">No warranty</h2>
          <p className="feature-card-desc">
            This site is provided "as is" without any warranty. You are responsible for verifying the converted files before using them in production.
          </p>
        </div>

        <div className="section">
          <h2 className="feature-card-title">Acceptable use</h2>
          <p className="feature-card-desc">
            You agree not to use this tool for illegal purposes or to process copyrighted content without permission.
          </p>
        </div>
      </div>
    </>
  )
}

export default TermsOfServicePage
