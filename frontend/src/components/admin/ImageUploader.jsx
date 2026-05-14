import React, { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './ImageUploader.css';

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

const ImageUploader = ({ value = [], onChange }) => {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({}); // key → 0-100
    const inputRef = useRef(null);

    // value = [{ url, key }] — passed in and out via onChange

    const validateFiles = (files) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const valid = [];
        for (const file of files) {
            if (!allowed.includes(file.type)) {
                toast.error(`${file.name}: Only JPEG, PNG, WebP allowed`);
                continue;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                toast.error(`${file.name}: Too large (max ${MAX_SIZE_MB} MB)`);
                continue;
            }
            if (value.length + valid.length >= MAX_FILES) {
                toast.warning(`Maximum ${MAX_FILES} images allowed`);
                break;
            }
            valid.push(file);
        }
        return valid;
    };

    const uploadFiles = async (files) => {
        const validFiles = validateFiles(files);
        if (validFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        validFiles.forEach((f) => formData.append('images', f));

        try {
            const response = await api.post('/upload/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    // Spread progress across all files being uploaded
                    const progress = {};
                    validFiles.forEach((f) => { progress[f.name] = pct; });
                    setUploadProgress(progress);
                },
            });

            const uploaded = response.data.images; // [{ url, key }]
            onChange([...value, ...uploaded]);
            toast.success(`${uploaded.length} image(s) uploaded!`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress({});
        }
    };

    const removeImage = async (index) => {
        const img = value[index];
        // Optimistically remove from UI
        const updated = value.filter((_, i) => i !== index);
        onChange(updated);

        // Delete from S3 if we have the key
        if (img.key) {
            try {
                await api.delete('/upload/images', { data: { key: img.key } });
            } catch {
                // Silent — image is already removed from UI
            }
        }
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFileChange = (e) => {
        const files = Array.from(e.target.files);
        uploadFiles(files);
        e.target.value = ''; // reset so same file can be re-selected
    };

    const isUploading = uploading;
    const canAddMore = value.length < MAX_FILES && !isUploading;

    return (
        <div className="image-uploader">
            {/* Drop zone */}
            {canAddMore && (
                <div
                    className={`image-uploader__dropzone ${dragging ? 'image-uploader__dropzone--active' : ''} ${isUploading ? 'image-uploader__dropzone--loading' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => !isUploading && inputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload product images"
                    onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={onFileChange}
                        style={{ display: 'none' }}
                        id="image-file-input"
                    />
                    {isUploading ? (
                        <div className="image-uploader__upload-state">
                            <FaSpinner className="spin upload-spinner" />
                            <span>Uploading to S3…</span>
                            <div className="upload-progress-bar">
                                <div
                                    className="upload-progress-fill"
                                    style={{
                                        width: `${Object.values(uploadProgress)[0] || 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="image-uploader__idle-state">
                            <FaCloudUploadAlt className="upload-icon" />
                            <p className="upload-title">
                                {dragging ? 'Drop to upload' : 'Drag & drop images here'}
                            </p>
                            <p className="upload-subtitle">
                                or <span className="upload-browse">browse files</span>
                            </p>
                            <p className="upload-hint">
                                JPEG, PNG, WebP · Max {MAX_SIZE_MB} MB each · Up to {MAX_FILES - value.length} more
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Image preview grid */}
            {value.length > 0 && (
                <div className="image-uploader__preview-grid">
                    {value.map((img, index) => (
                        <div key={img.key || img.url || index} className="image-uploader__preview-item">
                            <img
                                src={img.url || img}
                                alt={`Photo ${index + 1}`}
                                className="image-uploader__preview-img"
                            />
                            <div className="image-uploader__preview-overlay">
                                {index === 0 && (
                                    <span className="image-uploader__primary-badge">Main</span>
                                )}
                                <button
                                    type="button"
                                    className="image-uploader__remove-btn"
                                    onClick={() => removeImage(index)}
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <FaCheckCircle className="image-uploader__check" />
                        </div>
                    ))}
                </div>
            )}

            {value.length >= MAX_FILES && (
                <p className="image-uploader__limit-note">
                    Maximum {MAX_FILES} images reached. Remove one to upload another.
                </p>
            )}
        </div>
    );
};

export default ImageUploader;
