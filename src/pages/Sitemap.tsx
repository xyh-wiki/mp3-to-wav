/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: HTML Sitemap 页面
 */
import React from 'react'
import SEO from '../components/common/SEO'

const SitemapPage: React.FC = () => {
  return (
    <>
      <SEO
        title="HTML Sitemap - MP3 / WAV Converter | mp3-to-wav.xyh.wiki"
        description="HTML sitemap listing pages of mp3-to-wav.xyh.wiki."
        canonical="https://mp3-to-wav.xyh.wiki/sitemap"
      />
      <div className="container section">
        <h1 className="section-title">HTML Sitemap</h1>
        <p className="section-subtitle">List of key pages on mp3-to-wav.xyh.wiki.</p>

        <ul className="footer-list" style={{ marginTop: 24 }}>
          <li><a href="/">Home</a></li>
          <li><a href="/tools">Tools overview</a></li>
          <li><a href="/tools/mp3-to-wav">MP3 → WAV Converter</a></li>
          <li><a href="/tools/wav-to-mp3">WAV → MP3 Converter</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/sitemap">HTML Sitemap</a></li>
        </ul>
      </div>
    </>
  )
}

export default SitemapPage
