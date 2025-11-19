/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Contact 
 */
import React from 'react'
import SEO from '../components/common/SEO'

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="Contact information for the mp3-to-wav.xyh.wiki project."
        canonical="https://mp3-to-wav.xyh.wiki/contact"
      />
      <div className="container section">
        <h1 className="section-title">Contact</h1>
        <p className="section-subtitle">Feedback, bug reports or feature requests.</p>

        <div className="section" style={{ marginTop: 24 }}>
          <p className="feature-card-desc">
            This project does not provide real-time support, but you can send feedback via email:
          </p>
          <p className="feature-card-desc" style={{ marginTop: 8 }}>
            <strong>Email:</strong> contact (at) xyh.wiki
          </p>
        </div>
      </div>
    </>
  )
}

export default ContactPage
