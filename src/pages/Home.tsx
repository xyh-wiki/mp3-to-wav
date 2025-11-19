/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Landing page with centered hero, gradient background and audio tools overview
 */
import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import Card from '../components/common/Card'

const HomePage: React.FC = () => {
  // Long-tail keywords for SEO section
  const longTailKeywords: string[] = [
    'how to convert MP3 to WAV in browser',
    'how to convert WAV to MP3 online',
    'free mp3 to wav converter no upload',
    'browser audio converter using ffmpeg wasm',
    'how to boost audio volume online',
    'how to normalize mp3 volume',
    'remove silence from podcast audio',
    'online audio speed and pitch changer',
    'merge multiple mp3 files into one',
    'split long wav file into clips',
    'edit mp3 metadata tags online',
    'generate sine wave tone online',
    'waveform visualizer for wav and mp3',
    'flac to mp3 converter no account',
    'ogg to mp3 converter in browser'
  ]

  return (
    <>
      <SEO
        title="MP3 to WAV & WAV to MP3 Online Converter - mp3-to-wav.xyh.wiki"
        description="Fast, private, browser-based audio tools. Convert MP3 to WAV and WAV to MP3 using WebAssembly FFmpeg, plus volume boost, silence removal, merge, split and more."
        canonical="https://mp3-to-wav.xyh.wiki/"
      />

      <div className="home-page">
        {/* Hero banner with soft gradient background */}
        <section className="hero-banner">
          <div className="hero-banner-inner">
            <p className="hero-eyebrow">mp3-to-wav.xyh.wiki · Browser audio toolkit</p>
            <h1 className="hero-heading">
              MP3 ⇆ WAV Converter
              <br />
              &amp; Browser Audio Toolkit
            </h1>
            <p className="hero-subtitle">
              Convert MP3 to WAV and WAV to MP3 directly in your browser using WebAssembly FFmpeg.
              No upload, no registration, no watermark. A focused set of audio utilities for small
              daily tasks, demos and quick edits.
            </p>

            <div className="hero-actions">
              <Link to="/tools/mp3-to-wav" className="btn hero-btn-primary">
                Convert MP3 to WAV
              </Link>
              <Link to="/tools/wav-to-mp3" className="btn hero-btn-secondary">
                Convert WAV to MP3
              </Link>
            </div>

            <p className="hero-badges">
              <span>No upload</span>
              <span>Runs locally in your browser</span>
              <span>Powered by WebAssembly FFmpeg</span>
            </p>
          </div>
        </section>

        {/* Popular tools section */}
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Popular audio tools</h2>
            <p className="home-section-subtitle">
              A small collection of focused tools designed to solve common audio tasks, inspired by
              popular online utilities.
            </p>
          </div>

          <div className="home-tools-grid">
            <Card>
              <div className="home-tool-card">
                <h3 className="home-tool-title">MP3 → WAV</h3>
                <p className="home-tool-desc">
                  Convert MP3 files to uncompressed WAV for editing, mixing or mastering.
                </p>
                <ul className="home-tool-list">
                  <li>Batch convert multiple MP3 files.</li>
                  <li>Keep everything local in your browser.</li>
                  <li>Great for DAW imports or audio editing.</li>
                </ul>
                <Link to="/tools/mp3-to-wav" className="home-tool-link">
                  Open MP3 to WAV tool
                </Link>
              </div>
            </Card>

            <Card>
              <div className="home-tool-card">
                <h3 className="home-tool-title">WAV → MP3</h3>
                <p className="home-tool-desc">
                  Compress WAV files into MP3 to reduce file size while keeping reasonable quality.
                </p>
                <ul className="home-tool-list">
                  <li>Choose bitrate and basic quality options.</li>
                  <li>Ideal for sending samples or publishing.</li>
                  <li>No account, no upload, no watermark.</li>
                </ul>
                <Link to="/tools/wav-to-mp3" className="home-tool-link">
                  Open WAV to MP3 tool
                </Link>
              </div>
            </Card>

            <Card>
              <div className="home-tool-card">
                <h3 className="home-tool-title">Volume booster</h3>
                <p className="home-tool-desc">
                  Increase or decrease the volume of your audio file, useful for quiet recordings.
                </p>
                <ul className="home-tool-list">
                  <li>Boost gain or normalize loudness.</li>
                  <li>All processing is local.</li>
                  <li>Works with MP3 and WAV files.</li>
                </ul>
                <Link to="/tools/volume-boost" className="home-tool-link">
                  Open volume booster
                </Link>
              </div>
            </Card>

            <Card>
              <div className="home-tool-card">
                <h3 className="home-tool-title">Silence remover</h3>
                <p className="home-tool-desc">
                  Detect and remove silent segments from your audio to tighten podcasts or voice
                  clips.
                </p>
                <ul className="home-tool-list">
                  <li>Configurable silence threshold.</li>
                  <li>Good for podcasts, lectures and voice notes.</li>
                  <li>Keep processing fully in browser.</li>
                </ul>
                <Link to="/tools/silence-removal" className="home-tool-link">
                  Open silence remover
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Why this site section */}
        <section className="home-section home-why">
          <div className="home-why-grid">
            <div>
              <h2 className="home-section-title">Why mp3-to-wav.xyh.wiki?</h2>
              <p className="home-section-subtitle">
                A small, private, browser-only toolkit built for quick everyday audio chores.
              </p>
            </div>
            <ul className="home-why-list">
              <li>Runs completely in your browser (WebAssembly FFmpeg).</li>
              <li>No server-side file storage or tracking.</li>
              <li>Simple, clean UI focused purely on audio utilities.</li>
              <li>
                Multiple tools in one place: convert, merge, split, boost, trim, visualize and more.
              </li>
            </ul>
          </div>
        </section>

        {/* SEO long-tail keyword section */}
        <section className="home-section seo-keywords">
          <div className="home-section-header">
            <h2 className="home-section-title">Audio conversion search keywords</h2>
            <p className="home-section-subtitle">
              Selected long-tail phrases related to MP3, WAV and browser-based audio tools. This
              section is mainly for SEO and does not affect your workflow.
            </p>
          </div>
          <div className="seo-keywords-list">
            {longTailKeywords.map((text) => (
              <span key={text} className="seo-keyword-pill">
                {text}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
