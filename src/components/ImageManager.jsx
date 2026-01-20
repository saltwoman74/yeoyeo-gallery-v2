import React, { useState } from 'react';
import { Upload, Trash2, Edit3, Plus, Search, Filter, Video, Image as ImageIcon, Save, X } from 'lucide-react';
import { COMPLEX_TYPES, PHOTO_CATEGORIES, VIDEO_CATEGORIES } from '../constants';

const ImageManager = () => {
    const [data, setData] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadData, setUploadData] = useState({
        complex: '1단지',
        type: '25타입',
        category: PHOTO_CATEGORIES[0].id,
        mediaType: 'image',
        url: '',
        title: ''
    });

    React.useEffect(() => {
        const savedData = localStorage.getItem('uniticity_media_data');
        if (savedData) setData(JSON.parse(savedData));
    }, []);

    const saveData = (newData) => {
        setData(newData);
        localStorage.setItem('uniticity_media_data', JSON.stringify(newData));
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadData.url) return alert('URL을 입력해주세요.');

        const newItem = {
            ...uploadData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };

        const newData = [...data, newItem];
        saveData(newData);
        setIsUploadModalOpen(false);
        setUploadData({ ...uploadData, url: '', title: '' });
        alert('데이터가 성공적으로 등록되었습니다.');
    };

    const handleDelete = (id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            const newData = data.filter(item => item.id !== id);
            saveData(newData);
        }
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uniticity_data_backup.json';
        a.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    saveData(importedData);
                    alert('데이터를 성공적으로 불러왔습니다.');
                }
            } catch (err) {
                alert('유효한 JSON 파일이 아닙니다.');
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">이미지 및 영상 관리</h2>
                    <p className="text-sm text-gray-500">단지별 매물 사진과 유튜브 링크를 관리하세요.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> 데이터 추가
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Images</p>
                        <p className="text-2xl font-bold text-blue-900">{data.filter(i => i.mediaType === 'image').length}</p>
                    </div>
                    <ImageIcon className="w-8 h-8 text-blue-300" />
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Total Videos</p>
                        <p className="text-2xl font-bold text-purple-900">{data.filter(i => i.mediaType === 'video').length}</p>
                    </div>
                    <Video className="w-8 h-8 text-purple-300" />
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors" onClick={handleExport}>
                    <div>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Backup</p>
                        <p className="text-sm font-bold text-green-900">JSON Export</p>
                    </div>
                    <Save className="w-8 h-8 text-green-300" />
                </div>
                <label className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors">
                    <input type="file" className="hidden" onChange={handleImport} accept=".json" />
                    <div>
                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Restore</p>
                        <p className="text-sm font-bold text-amber-900">Upload JSON</p>
                    </div>
                    <Upload className="w-8 h-8 text-amber-300" />
                </label>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-4 overflow-x-auto no-scrollbar">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="검색어 입력..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b">
                            <tr>
                                <th className="px-6 py-4">미디어</th>
                                <th className="px-6 py-4">분류</th>
                                <th className="px-6 py-4">제목 (URL)</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length > 0 ? data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {item.mediaType === 'image' ? (
                                            <img src={item.url} className="w-12 h-12 rounded object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-red-100 flex items-center justify-center border border-red-200">
                                                <Play className="w-6 h-6 text-red-600" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{item.complex}</span>
                                            <span className="text-xs text-gray-500">{item.type} / {PHOTO_CATEGORIES.find(c => c.id === item.category)?.kr || item.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate font-medium text-gray-700">{item.title || '제목 없음'}</div>
                                        <div className="max-w-xs truncate text-[10px] text-gray-400">{item.url}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-400">데이터가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">데이터 추가</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">미디어 타입</label>
                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setUploadData({ ...uploadData, mediaType: 'image' })}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${uploadData.mediaType === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                                        >
                                            이미지 (Image)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadData({ ...uploadData, mediaType: 'video' })}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${uploadData.mediaType === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                                        >
                                            유튜브 (Video)
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">단지 선택</label>
                                    <select
                                        value={uploadData.complex}
                                        onChange={(e) => setUploadData({ ...uploadData, complex: e.target.value, type: COMPLEX_TYPES[e.target.value][0] })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {Object.keys(COMPLEX_TYPES).map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">타입 선택</label>
                                    <select
                                        value={uploadData.type}
                                        onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {COMPLEX_TYPES[uploadData.complex].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">카테고리</label>
                                    <select
                                        value={uploadData.category}
                                        onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {(uploadData.mediaType === 'image' ? PHOTO_CATEGORIES : VIDEO_CATEGORIES).map(c => (
                                            <option key={c.id} value={c.id}>{c.kr}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                                    {uploadData.mediaType === 'image' ? '이미지 URL (직접 입력 또는 파일 선택)' : '유튜브 링크 (URL)'}
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={uploadData.url}
                                    onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm">취소</button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30">등록하기</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ImageManager;
