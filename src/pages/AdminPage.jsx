import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Image, LogOut, ShieldCheck, Trash2, RefreshCcw, Save, Search, Lock, Youtube, PlayCircle } from 'lucide-react';
import ImageUploader from '../components/admin/ImageUploader';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { listImages, deleteImage, listVideos, addVideo, deleteVideo } from '../services/s3Service';
import { COMPLEX_TYPES } from '../constants';

const AdminPage = () => {
    const { isAdminAuthenticated, adminLogin, logout, changeAdminPassword } = useAuthStore();
    const [passwordInput, setPasswordInput] = useState('');
    const [activeTab, setActiveTab] = useState('uploads'); // uploads | gallery | videos | settings
    const navigate = useNavigate();

    // Gallery Management State
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);

    // Video Management State
    const [videos, setVideos] = useState([]);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Settings State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (activeTab === 'gallery') loadImages();
        if (activeTab === 'videos') loadVideos();
    }, [activeTab]);

    const loadImages = async () => {
        setLoadingImages(true);
        try {
            // Load images from all complexes and types
            const allImages = [];
            const complexes = ['1', '2', '3', '4'];
            const types = {
                '1': ['25', '30', '35A', '35B', '41', '47', '56A', '56B'],
                '2': ['25', '30', '35A', '35B', '41'],
                '3': ['25', '30', '35A', '35B', '41'],
                '4': ['25', '30', '35A', '35B', '41', '48', '56A', '56B']
            };

            for (const complex of complexes) {
                for (const type of types[complex]) {
                    try {
                        const path = `complex_${complex}/${type}`;
                        const data = await listImages(path);
                        allImages.push(...data.map(img => ({
                            ...img,
                            complex,
                            type,
                            displayName: `${complex}단지 ${type}평`
                        })));
                    } catch (error) {
                        // Skip empty folders or errors
                        console.log(`Skipping ${complex}/${type}:`, error.message);
                    }
                }
            }

            setImages(allImages);
        } catch (error) {
            console.error('Failed to load images:', error);
            setImages([]);
        }
        setLoadingImages(false);
    };

    const loadVideos = async () => {
        const data = await listVideos();
        // Show all videos from Supabase without filtering
        setVideos(data);
    };

    const handleDelete = async (key) => {
        if (window.confirm('Are you sure you want to delete this image? (삭제하시겠습니까?)')) {
            try {
                await deleteImage(key);
                setImages(images.filter(img => img.key !== key));
                alert('Image deleted successfully! (이미지가 삭제되었습니다!)');
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleDeleteVideo = async (id) => {
        if (window.confirm('Delete this video? (영상을 삭제하시겠습니까?)')) {
            await deleteVideo(id);
            setVideos(videos.filter(v => v.id !== id));
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();

        // Validate YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

        // Check if it's an image URL
        if (imageRegex.test(videoUrl)) {
            alert('이미지 URL은 추가할 수 없습니다. 유튜브 영상 URL만 입력해주세요.\n\nImage URLs cannot be added. Please enter YouTube video URLs only.');
            return;
        }

        // Check if it's a valid YouTube URL
        if (!youtubeRegex.test(videoUrl)) {
            alert('올바른 유튜브 URL을 입력해주세요.\n예: https://www.youtube.com/watch?v=...\n\nPlease enter a valid YouTube URL.\nExample: https://www.youtube.com/watch?v=...');
            return;
        }

        if (!videoTitle.trim() || !videoUrl.trim()) {
            alert('제목과 URL을 모두 입력해주세요.\n\nPlease enter both title and URL.');
            return;
        }

        await addVideo(videoTitle, videoUrl);
        alert('Video Added!');
        setVideoTitle('');
        setVideoUrl('');
        loadVideos();
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!adminLogin(passwordInput)) {
            alert('Access Denied (접속 거부)');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match (비밀번호가 일치하지 않습니다)');
            return;
        }
        changeAdminPassword(newPassword);
        alert('Password Changed Successfully (비밀번호가 변경되었습니다)');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy-800 via-navy-950 to-navy-950 opacity-80" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-navy-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-2xl max-w-sm w-full shadow-2xl"
                >
                    <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                        <Lock className="w-6 h-6 text-gold-500" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gold-500 text-sm mb-8 tracking-widest uppercase">관리자 접속</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="password"
                            placeholder="Enter Admin PIN"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-navy-950/80 border border-white/10 rounded-xl p-4 text-center text-white focus:border-gold-500 outline-none transition-colors placeholder:text-gray-600"
                        />
                        <button className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-gold-500/20">
                            Login <span className="text-xs ml-1 opacity-70">로그인</span>
                        </button>
                    </form>
                    <button onClick={() => navigate('/')} className="mt-8 text-xs text-gray-500 hover:text-white transition-colors">Return to Gallery (돌아가기)</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 text-white">
            {/* Admin Header */}
            <header className="bg-navy-900/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 text-[10px] font-bold px-2 py-1 rounded shadow-lg shadow-gold-500/20">ADMIN</span>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Manager Dashboard <span className="text-xs text-gold-500 border border-gold-500 px-1 rounded ml-2">v2.0 (Security Active)</span></h1>
                        <p className="text-[10px] text-gray-400">관리자 대시보드</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10">
                    <LogOut className="w-4 h-4" /> <span className="text-xs">Logout 로그아웃</span>
                </button>
            </header>

            <div className="max-w-6xl mx-auto p-6 md:p-10">
                {/* Tabs */}
                <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
                    {[
                        { id: 'uploads', icon: Image, label: 'Upload Images', sub: '사진 업로드' },
                        { id: 'gallery', icon: Search, label: 'Manage Gallery', sub: '갤러리 관리' },
                        { id: 'videos', icon: Youtube, label: 'Manage Videos', sub: '유튜브 영상 관리' },
                        { id: 'settings', icon: Settings, label: 'System Settings', sub: '시스템 설정' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-start gap-1 px-6 py-4 rounded-xl border transition-all min-w-[180px] ${activeTab === tab.id
                                ? 'bg-navy-800 border-gold-500/50 shadow-lg shadow-black/20'
                                : 'bg-transparent border-transparent hover:bg-white/5 text-gray-500'
                                }`}
                        >
                            <div className={`flex items-center gap-2 ${activeTab === tab.id ? 'text-gold-500' : ''}`}>
                                <tab.icon className="w-4 h-4" />
                                <span className="font-bold text-sm">{tab.label}</span>
                            </div>
                            <span className="text-[10px] opacity-60 ml-6">{tab.sub}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'uploads' && (
                        <div className="bg-navy-900/50 border border-white/5 rounded-2xl p-8">
                            <h2 className="text-2xl font-serif font-bold mb-2 text-white">Upload New Photos</h2>
                            <p className="text-gray-400 text-sm mb-8">새로운 사진 업로드</p>
                            <ImageUploader />
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div className="space-y-8">
                            <div className="bg-navy-900/50 border border-white/5 rounded-2xl p-8 text-center">
                                <h2 className="text-2xl font-serif font-bold mb-4 text-white flex items-center justify-center gap-2">
                                    <Youtube className="text-red-500" /> Video Management
                                </h2>
                                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl inline-block max-w-2xl">
                                    <p className="text-blue-200 font-bold mb-2">ℹ️ Manage via Code (코드 관리 모드)</p>
                                    <p className="text-sm text-gray-300">
                                        Video list is now managed directly in the source code to ensure stability without database dependencies.
                                        <br />
                                        Please contact the administrator/developer to add or remove videos.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-4 font-mono bg-black/30 p-2 rounded">
                                        Source: src/data/videos.js
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {videos.map(video => (
                                    <div key={video.id} className="bg-navy-800 border border-white/5 p-4 rounded-xl flex items-center justify-between opacity-80">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-red-500">
                                                <PlayCircle />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{video.title}</h4>
                                                <a href={video.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">{video.url}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-1">Gallery Overview</h2>
                                    <p className="text-gray-400 text-sm">전체 사진 관리 ({images.length})</p>
                                </div>
                                <button onClick={loadImages} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gold-500">
                                    <RefreshCcw className={`w-4 h-4 ${loadingImages ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {loadingImages ? (
                                    <div className="col-span-full text-center py-20 text-gold-500">
                                        <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-2" />
                                        <p>Loading images...</p>
                                    </div>
                                ) : images.length === 0 ? (
                                    <div className="col-span-full text-center py-20 text-gray-500">
                                        <p>No images uploaded yet</p>
                                        <p className="text-sm mt-2">업로드된 이미지가 없습니다</p>
                                    </div>
                                ) : (
                                    images.map(img => (
                                        <div key={img.id} className="group relative aspect-square bg-navy-800 rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/50 transition-all">
                                            <img src={img.url} alt={img.displayName || 'Gallery'} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-xs text-white font-bold">{img.displayName}</p>
                                                    <p className="text-[10px] text-gray-400 truncate">{img.key}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(img.key)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {images.length === 0 && !loadingImages && (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                                    <p className="text-gray-500">No images found (이미지가 없습니다)</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl">
                            <div className="bg-navy-900/50 border border-white/5 rounded-2xl p-8">
                                <h2 className="text-2xl font-serif font-bold mb-2">Security Settings</h2>
                                <p className="text-gray-400 text-sm mb-8">보안 설정</p>

                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">New Admin Password (사용할 비밀번호)</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-navy-950 border border-white/10 p-4 rounded-xl text-white focus:border-gold-500 outline-none"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Confirm Password (비밀번호 확인)</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-navy-950 border border-white/10 p-4 rounded-xl text-white focus:border-gold-500 outline-none"
                                            placeholder="Retype password"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 bg-gold-500 text-navy-950 font-bold px-8 py-4 rounded-xl hover:bg-gold-400 transition-colors">
                                        <Save className="w-4 h-4" /> Save Changes 변경사항 저장
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPage;
