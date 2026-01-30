import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Check, Folder, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '../../services/s3Service';
import { COMPLEX_TYPES } from '../../constants';

const ImageUploader = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const [selectedComplex, setSelectedComplex] = useState('1');
    const [selectedType, setSelectedType] = useState(COMPLEX_TYPES['1'][0]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
        setUploadStatus(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const removeFile = (name) => {
        setFiles(files.filter(file => file.name !== name));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setUploadStatus(null);

        let successCount = 0;
        let failCount = 0;

        try {
            for (const file of files) {
                const path = `complex_${selectedComplex}/${selectedType}`;
                try {
                    // 항상 압축 수행
                    const compressedFile = await imageCompression(file, {
                        maxSizeMB: 0.6,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                        quality: 0.75,
                        fileType: 'image/webp'
                    });

                    await uploadImage(compressedFile, path);
                    successCount++;
                } catch (err) {
                    console.error(err);
                    failCount++;
                }
            }

            if (failCount > 0) {
                setUploadStatus({
                    type: 'error',
                    message: `Upload finished with errors. Success: ${successCount}, Failed: ${failCount}. (일부 업로드가 실패했습니다. 성공: ${successCount}, 실패: ${failCount})`
                });
            } else {
                setUploadStatus({
                    type: 'success',
                    message: `Successfully uploaded ${successCount} images! (업로드 성공: ${successCount}장)`
                });
                setFiles([]);
            }
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: 'System Error during upload. (시스템 오류 발생)'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-navy-950/50 border border-white/5 rounded-xl items-end">
                <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Target Complex (단지 선택)</label>
                    <select
                        value={selectedComplex}
                        onChange={(e) => {
                            setSelectedComplex(e.target.value);
                            setSelectedType(COMPLEX_TYPES[e.target.value][0]);
                        }}
                        className="w-full bg-navy-800 border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500"
                    >
                        <option value="1">1단지 (Complex 1)</option>
                        <option value="2">2단지 (Complex 2)</option>
                        <option value="3">3단지 (Complex 3)</option>
                        <option value="4">4단지 (Complex 4)</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Target Type (평형 선택)</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-navy-800 border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500"
                    >
                        {COMPLEX_TYPES[selectedComplex]?.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-white/30 bg-navy-950/30'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-navy-800 rounded-full shadow-lg">
                        <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-gold-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-gray-300 font-medium">
                        {isDragActive ? 'Drop images here' : 'Drag & drop photos, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG (Max 5MB) / 사진 드래그 앤 드롭</p>
                </div>
            </div>

            {/* Status Message */}
            {uploadStatus && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${uploadStatus.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                    {uploadStatus.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{uploadStatus.message}</span>
                </div>
            )}

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gold-500 font-bold">{files.length} files selected (선택됨)</span>
                        <button onClick={() => setFiles([])} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider">Clear All (전체 삭제)</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {files.map(file => (
                            <div key={file.name} className="relative group aspect-square rounded-lg overflow-hidden bg-navy-800 border border-white/5">
                                <img
                                    src={file.preview}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                    alt="preview"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white truncate px-2">
                                    {file.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${uploading ? 'bg-navy-800 text-gray-400' : 'bg-gold-500 text-navy-950 hover:bg-gold-400 hover:shadow-gold-500/20'
                            }`}
                    >
                        {uploading ? (
                            <>Uploading... (업로드 중...)</>
                        ) : (
                            <><Check className="w-5 h-5" /> Upload to {selectedComplex}단지 / {selectedType}</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
