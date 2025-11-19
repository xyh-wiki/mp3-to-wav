/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 应用入口组件，包含路由和全局布局
 */
import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/Home'
import ToolsPage from './pages/Tools'
import Mp3ToWavPage from './pages/Tools/Mp3ToWav'
import WavToMp3Page from './pages/Tools/WavToMp3'
import FAQPage from './pages/FAQ'
import AboutPage from './pages/About'
import ContactPage from './pages/Contact'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import TermsOfServicePage from './pages/TermsOfService'
import SitemapPage from './pages/Sitemap'
import NotFoundPage from './pages/NotFound'
import ToastContainer from './components/common/ToastContainer'
import LanguageSwitcher from './components/common/LanguageSwitcher'
import { I18nProvider } from './context/I18nContext'
import { UIProvider } from './context/UIContext'

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-logo">mp3-to-wav.xyh.wiki</div>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <NavLink
            to="/"
            className={({ isActive }) => ['nav-link', isActive && 'active'].filter(Boolean).join(' ')}
          >
            Home
          </NavLink>
          <NavLink
            to="/tools"
            className={({ isActive }) => ['nav-link', isActive && 'active'].filter(Boolean).join(' ')}
          >
            Tools
          </NavLink>
          <NavLink
            to="/tools/mp3-to-wav"
            className={({ isActive }) => ['nav-link', isActive && 'active'].filter(Boolean).join(' ')}
          >
            MP3 → WAV
          </NavLink>
          <NavLink
            to="/tools/wav-to-mp3"
            className={({ isActive }) => ['nav-link', isActive && 'active'].filter(Boolean).join(' ')}
          >
            WAV → MP3
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-title">MP3 / WAV Converter</div>
          <p style={{ fontSize: 13, opacity: 0.85 }}>
            Browser-based audio tools at mp3-to-wav.xyh.wiki. All conversions run locally in your browser.
          </p>
        </div>
        <div>
          <div className="footer-title">Links</div>
          <ul className="footer-list">
            <li><a href="/tools">Tools</a></li>
            <li><a href="/tools/mp3-to-wav">MP3 → WAV</a></li>
            <li><a href="/tools/wav-to-mp3">WAV → MP3</a></li>
            <li><a href="/sitemap">HTML Sitemap</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-title">SEO Keywords</div>
          <ul className="footer-list">
            <li>online mp3 to wav converter</li>
            <li>wav to mp3 online</li>
            <li>browser audio converter</li>
            <li>no upload audio tools</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

const App: React.FC = () => {
  return (
    <I18nProvider>
      <UIProvider>
        <BrowserRouter>
          <div className="app-root">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/tools/mp3-to-wav" element={<Mp3ToWavPage />} />
                <Route path="/tools/wav-to-mp3" element={<WavToMp3Page />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </UIProvider>
    </I18nProvider>
  )
}

export default App
