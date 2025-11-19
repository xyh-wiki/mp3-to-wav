/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */

import React, { useState } from 'react'
import SEO from '../../components/common/SEO'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useUI } from '../../context/UIContext'
import { editMetadata } from '../../utils/audioAdvanced'

const MetadataEditorPage: React.FC = () => {
  const { addToast } = useUI()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [processing, setProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultName, setResultName] = useState<string>('output.mp3')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setResultUrl(null)
      setResultName(f.name.replace(/\.[^.]+$/, '') + '_meta.' + (f.name.split('.').pop() || 'mp3'))
    }
  }

  const handleApply = async () => {
    if (!file) {
      addToast({ type: 'error', message: 'Please select an audio file first' })
      return
    }
    setProcessing(true)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
    try {
      const { blob, fileName } = await editMetadata(file, { title, artist, album })
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setResultName(fileName)
      addToast({ type: 'success', message: 'Metadata written successfully' })
    } catch (e: any) {
      console.error(e)
      addToast({ type: 'error', message: e?.message || 'Failed to write metadata' })
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = resultName
    a.click()
  }

  return (
    <>
      <SEO
        title="Edit Audio Metadata Online"
        description="Edit title, artist and album metadata fields directly in your browser without re-encoding."
        path="/tools/metadata-editor"
      />
      <div className="page-container">
        <h1 className="page-title">Metadata Editor</h1>
        <p className="page-subtitle">
          Edit common audio metadata fields like title, artist and album without re-encoding audio.
        </p>

        <section style={{ marginTop: 24 }}>
          <Card>
            <div className="upload-area">
              <p className="upload-hint">Choose an MP3 / WAV or other audio file</p>
              <input type="file" accept="audio/*" onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div>
                <div className="field-label">Title Title</div>
                <input
                  type="text"
                  className="input-text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Song"
                />
              </div>
              <div>
                <div className="field-label">Artist Artist</div>
                <input
                  type="text"
                  className="input-text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. XYH"
                />
              </div>
              <div>
                <div className="field-label">Album Album</div>
                <input
                  type="text"
                  className="input-text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="e.g. My Album"
                />
              </div>
            </div>

            <div className="action-row">
              <Button variant="primary" onClick={handleApply} disabled={processing}>
                {processing ? 'Applying...' : 'Write metadata'}
              </Button>
            </div>
          </Card>

          {resultUrl && (
            <Card style={{ marginTop: 24 }}>
              <h2 className="section-subtitle">Download file with new metadata</h2>
              <Button variant="primary" onClick={handleDownload}>
                Download
              </Button>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}

export default MetadataEditorPage
