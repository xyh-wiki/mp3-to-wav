/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: About 页面
 */
import React from 'react'
import SEO from '../components/common/SEO'

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="About the mp3-to-wav.xyh.wiki project."
        canonical="https://mp3-to-wav.xyh.wiki/about"
      />
      <div className="container section">
        <h1 className="section-title">About</h1>
        <p className="section-subtitle">
          Learn more about the idea behind mp3-to-wav.xyh.wiki and how this tool is built.
        </p>

        <div className="section" style={{ marginTop: 24 }}>
          <p className="feature-card-desc">
            This project focuses on a small set of high-quality audio tools that run fully in the browser.
            The goal is to give you fast conversion without sacrificing privacy or requiring logins.
          </p>
        </div>
      </div>
    </>
  )
}

export default AboutPage
