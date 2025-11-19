/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Simple language switcher component (EN / ZH), UI only uses English labels
 */
import React from 'react'
import { useI18n, Language } from '../../context/I18nContext'

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Language
    setLang(value)
  }

  return (
    <div className="lang-switcher">
      <label className="lang-label" htmlFor="lang-select">
        Language:
      </label>
      <select
        id="lang-select"
        className="lang-select"
        value={lang}
        onChange={handleChange}
      >
        <option value="en">EN</option>
        <option value="zh">ZH</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
