import { useState } from 'react';
import { Upload, Image, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [preview, setPreview] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setUploadedUrl('');
    try {
      const { data: { uploadUrl, fileUrl } } = await api.post('/upload/presigned', {
        fileName: file.name,
        fileType: file.type,
      });

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setUploadedUrl(fileUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-content">
      <h1 className="admin-heading">Upload Images</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>
        Upload product images to S3. Copy the URL and paste it in the product form.
      </p>

      <div className="card" style={{ padding: 32, maxWidth: 600 }}>
        <label className="upload-zone">
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          {preview ? (
            <img src={preview} alt="Preview" style={{ maxWidth:'100%', maxHeight: 300, objectFit:'contain', borderRadius:'var(--radius-md)' }} />
          ) : (
            <div className="upload-zone__placeholder">
              <Image size={48} className="text-dim" />
              <p className="text-muted">Click or drag to upload an image</p>
              <p className="text-dim" style={{ fontSize:'0.8125rem' }}>PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
          {uploading && (
            <div className="upload-zone__loading">
              <div className="spinner" />
              <p>Uploading...</p>
            </div>
          )}
        </label>

        {uploadedUrl && (
          <div className="upload-result">
            <CheckCircle size={20} className="text-gold" />
            <div style={{ flex: 1 }}>
              <p className="form-label">Uploaded URL</p>
              <input className="form-input" readOnly value={uploadedUrl} onClick={e => { e.target.select(); navigator.clipboard.writeText(uploadedUrl); toast.success('Copied!'); }} />
            </div>
          </div>
        )}

        {!uploading && (
          <label className="btn btn-primary btn-full" style={{ cursor:'pointer', marginTop: 16 }}>
            <Upload size={16} /> {preview ? 'Upload Another' : 'Choose Image'}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
          </label>
        )}
      </div>
    </div>
  );
}
