import React, { useRef } from 'react'
import { Upload } from 'lucide-react'

const FileUploader = ({ onFileSelect, accept, children }) => {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onFileSelect(e.target.result, file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="file-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={handleClick}
        className="file-upload-button"
      >
        {children || <Upload size={16} />}
      </button>
    </div>
  )
}

export default FileUploader 