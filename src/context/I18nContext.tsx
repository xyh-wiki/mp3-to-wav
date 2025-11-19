/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */
import React, { createContext, useContext, useState, useMemo } from 'react'
import en from '../i18n/en'
import zh from '../i18n/zh'

export type Language = 'en' | 'zh'

interface I18nValue {
  lang: Language
  t: (key: string) => string
  setLang: (l: Language) => void
}

const I18nContext = createContext<I18nValue | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null
    return saved === 'zh' ? 'zh' : 'en'
  })

  const setLang = (l: Language) => {
    setLangState(l)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', l)
    }
  }

  const t = (key: string) => {
    const dict = lang === 'zh' ? zh : en
    return (dict as any)[key] || key
  }

  const value = useMemo(
    () => ({
      lang,
      t,
      setLang
    }),
    [lang]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
