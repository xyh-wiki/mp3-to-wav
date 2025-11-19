/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Privacy Policy 
 */
import React from 'react'
import SEO from '../components/common/SEO'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="Privacy policy for mp3-to-wav.xyh.wiki explaining how your data is handled."
        canonical="https://mp3-to-wav.xyh.wiki/privacy-policy"
      />
      <div className="container section">
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-subtitle">How we handle your data on mp3-to-wav.xyh.wiki.</p>

        <div className="section" style={{ marginTop: 24 }}>
          <h2 className="feature-card-title">Local processing</h2>
          <p className="feature-card-desc">
            All audio conversions are processed locally in your browser using WebAssembly. Your files are not uploaded to our servers.
          </p>
        </div>

        <div className="section">
          <h2 className="feature-card-title">Analytics & cookies</h2>
          <p className="feature-card-desc">
            In the future we may integrate privacy-friendly analytics or advertising. If that happens, this page will be updated with specific details.
          </p>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicyPage
