/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 语言切换组件
 */
import React from 'react'
import { useI18n, Language } from '../../context/I18nContext'

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n()
  return (
    <select
      className="lang-switcher"
      value={lang}
      onChange={(e) => setLang(e.target.value as Language)}
    >
      <option value="en">EN</option>
      <option value="zh">中文</option>
    </select>
  )
}

export default LanguageSwitcher
