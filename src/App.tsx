/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Application root component with router, header navigation and global layout (EN only UI with i18n support)
 */
import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/Home'
import ToolsPage from './pages/Tools'
import Mp3ToWavPage from './pages/Tools/Mp3ToWav'
import WavToMp3Page from './pages/Tools/WavToMp3'
import VolumeBoostPage from './pages/Tools/VolumeBoost'
import SilenceRemovalPage from './pages/Tools/SilenceRemoval'
import SpeedPitchPage from './pages/Tools/SpeedPitch'
import FormatConverterPage from './pages/Tools/FormatConverter'
import MergeAudioPage from './pages/Tools/MergeAudio'
import SplitAudioPage from './pages/Tools/SplitAudio'
import ToneGeneratorPage from './pages/Tools/ToneGenerator'
import MetadataEditorPage from './pages/Tools/MetadataEditor'
import WaveformVisualizerPage from './pages/Tools/WaveformVisualizer'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import AboutPage from './pages/About'
import FAQPage from './pages/FAQ'
import NotFoundPage from './pages/NotFound'
import ContactPage from './pages/Contact'
import SitemapPage from './pages/Sitemap'
import ToastContainer from './components/common/ToastContainer'
import { UIProvider } from './context/UIContext'
import { I18nProvider, useI18n } from './context/I18nContext'
import './styles/global.css'

/**
 * Header navigation bar with language switcher
 */
const AppHeader: React.FC = () => {
  const { t, lang, setLang } = useI18n()

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink to="/" className="brand">
          {t('nav.brand')}
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/tools"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {t('nav.tools')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {t('nav.about')}
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {t('nav.faq')}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {t('nav.contact')}
          </NavLink>
        </nav>

        <div className="nav-right">
          <div className="lang-switch">
            <button
              type="button"
              className={lang === 'en' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setLang('en')}
            >
              {t('nav.language.en')}
            </button>
            <button
              type="button"
              className={lang === 'zh' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setLang('zh')}
            >
              {t('nav.language.zh')}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Main layout containing header, routes and footer placeholder
 */
const AppLayout: React.FC = () => {
  return (
    <div className="app-root">
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/mp3-to-wav" element={<Mp3ToWavPage />} />
          <Route path="/tools/wav-to-mp3" element={<WavToMp3Page />} />
          <Route path="/tools/volume-boost" element={<VolumeBoostPage />} />
          <Route path="/tools/silence-removal" element={<SilenceRemovalPage />} />
          <Route path="/tools/speed-pitch" element={<SpeedPitchPage />} />
          <Route path="/tools/format-converter" element={<FormatConverterPage />} />
          <Route path="/tools/merge-audio" element={<MergeAudioPage />} />
          <Route path="/tools/split-audio" element={<SplitAudioPage />} />
          <Route path="/tools/tone-generator" element={<ToneGeneratorPage />} />
          <Route path="/tools/metadata-editor" element={<MetadataEditorPage />} />
          <Route path="/tools/waveform-visualizer" element={<WaveformVisualizerPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* footer can be extended later if needed */}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <I18nProvider>
      <UIProvider>
        <BrowserRouter>
          <ToastContainer />
          <AppLayout />
        </BrowserRouter>
      </UIProvider>
    </I18nProvider>
  )
}

export default App
