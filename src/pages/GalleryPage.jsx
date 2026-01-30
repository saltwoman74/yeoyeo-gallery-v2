import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import { LogOut, ChevronLeft, Image, Youtube, X, MessageCircle } from 'lucide-react';
import ComplexCard from '../components/gallery/ComplexCard';
import PhotoGrid from '../components/gallery/PhotoGrid';
import VideoGrid from '../components/gallery/VideoGrid'; // New Import
import ComparisonSlider from '../components/gallery/ComparisonSlider';
import { listVideos } from '../services/s3Service'; // New Import

import { COMPLEX_TYPES } from '../constants';

const GalleryPage = () => {
    const logout = useAuthStore((state) => state.logout);
    const [activeTab, setActiveTab] = useState('photos'); // photos | videos
    const [selectedComplex, setSelectedComplex] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [compareImages, setCompareImages] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isCompareMode, setIsCompareMode] = useState(false); // New: Workflow state
    const [replacingSide, setReplacingSide] = useState(null); // 'left' or 'right'
    const [swapComplex, setSwapComplex] = useState(null); // New: Complex selection for swap
    const [viewingImage, setViewingImage] = useState(null); // New: Full screen viewer state

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (activeTab === 'videos') {
            listVideos().then(setVideos);
        }
    }, [activeTab]);

    // Auto-open comparison when 2 images are selected in Compare Mode
    useEffect(() => {
        if (isCompareMode && selectedImages.length === 2) {
            // Small delay for visual effect
            setTimeout(() => {
                setCompareImages({ left: selectedImages[0], right: selectedImages[1] });
            }, 500);
        }
    }, [selectedImages, isCompareMode]);


    // ... existing constants ...
    const complexes = [1, 2, 3, 4];
    const types = selectedComplex ? COMPLEX_TYPES[selectedComplex] : [];

    const handleBack = () => {
        if (viewAll) {
            setViewAll(false);
        } else if (selectedType) {
            setSelectedType(null);
        } else if (selectedComplex) {
            setSelectedComplex(null);
        }
    };

    const startComparison = (left, right) => {
        setCompareImages({ left, right });
    };

    const toggleImageSelection = (img) => {
        // If not in compare mode, and not replacing, open full screen viewer
        if (!isCompareMode && !replacingSide) {
            setViewingImage(img);
            return;
        }

        // If replacing an image in the slider
        if (replacingSide) {
            setCompareImages(prev => ({
                ...prev,
                [replacingSide]: img
            }));

            // Update selected list for consistency (optional but good)
            // Logic: Remove the old one from that side? Actually selectedImages tracks the *initial* pair.
            // Let's just update the list to match the current slider state roughly.
            // Simplified: Just close the overlay.
            setReplacingSide(null);
            return;
        }

        // Normal Compare Mode Selection
        if (selectedImages.find(i => i.id === img.id)) {
            setSelectedImages(selectedImages.filter(i => i.id !== img.id));
        } else {
            if (selectedImages.length < 2) {
                setSelectedImages([...selectedImages, img]);
            }
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 text-white p-6 md:p-12 relative">
            {/* Top Bar */}
            <header className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-8 relative z-10 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight whitespace-nowrap">
                        <span className="text-gold-500">여여부동산</span> <span className="text-white/50 font-light">/ Gallery</span>
                    </h1>
                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                        <button onClick={() => { setActiveTab('photos'); setSelectedComplex(null); }} className="hover:text-white transition-colors">Home</button>
                        {activeTab === 'videos' && <span className="text-gold-500"> / Videos</span>}
                        {activeTab === 'photos' && selectedComplex && (
                            <>
                                <span>/</span>
                                <span className={!selectedType ? 'text-gold-500' : ''}>{selectedComplex}단지</span>
                            </>
                        )}
                        {activeTab === 'photos' && selectedType && (
                            <>
                                <span>/</span>
                                <span className="text-gold-500">{selectedType}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {/* 1. Chatbot Shortcut - Moved to Header */}
                    <button
                        onClick={() => window.open('https://lambent-sopapillas-6102aa.netlify.app/', '_blank')}
                        className="px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 border border-white/10"
                    >
                        <MessageCircle className="w-3 h-3" /> 챗봇 상담
                    </button>

                    {/* 2. Compare Mode Toggle */}
                    {activeTab === 'photos' && (
                        <button
                            onClick={() => {
                                setIsCompareMode(!isCompareMode);
                                setSelectedImages([]); // Reset on toggle
                            }}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all flex items-center gap-2 border ${isCompareMode
                                ? 'bg-gold-500 text-navy-950 border-gold-500 shadow-lg shadow-gold-500/20'
                                : 'bg-transparent text-gold-500 border-gold-500 hover:bg-gold-500/10'}`}
                        >
                            {isCompareMode ? '비교 모드 종료' : '이미지 비교 시작'}
                        </button>
                    )}

                    {/* 3 & 4. Mode Toggles (Photos / Videos) */}
                    <div className="bg-navy-900 border border-white/10 rounded-lg p-1 flex">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'photos' ? 'bg-gold-500 text-navy-950' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Image className="w-3 h-3" /> Photos
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'videos' ? 'border border-gold-500 text-gold-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Youtube className="w-3 h-3" /> Videos
                        </button>
                    </div>

                    {/* 5. Sign Out (Login/Admin) */}
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-wider border border-transparent hover:border-white/10"
                    >
                        <LogOut className="w-3 h-3" /> 관리자 로그아웃
                    </button>
                </div>
            </header>

            {/* Status Bar for Compare Mode */}
            <AnimatePresence>
                {isCompareMode && !compareImages && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <div className="bg-navy-900/90 backdrop-blur border border-gold-500/30 text-gold-500 px-6 py-2 rounded-full shadow-xl flex items-center gap-3">
                            <span className="font-bold text-sm">COMPARE MODE</span>
                            <div className="h-4 w-px bg-white/20"></div>
                            <span className="text-white text-sm">
                                {selectedImages.length === 0 && "Select 1st Image"}
                                {selectedImages.length === 1 && "Select 2nd Image"}
                                {selectedImages.length === 2 && "Auto-starting..."}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Overlay with Swap Logic */}
            <AnimatePresence>
                {compareImages && (
                    <ComparisonSlider
                        leftImage={compareImages.left}
                        rightImage={compareImages.right}
                        onClose={() => setCompareImages(null)}
                        onRequestReplace={(side) => {
                            setReplacingSide(side);
                            setSwapComplex(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Swap Image Selector Overlay */}
            <AnimatePresence>
                {replacingSide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-navy-950/95 backdrop-blur-xl flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Select Image for {replacingSide === 'left' ? 'Left' : 'Right'} Side</h2>
                            <button onClick={() => setReplacingSide(null)} className="p-2 hover:bg-white/10 rounded-full bg-white/5 text-white">Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {!swapComplex ? (
                                <div className="flex flex-col gap-4 h-full justify-center max-w-2xl mx-auto w-full">
                                    <h3 className="text-xl text-center mb-4 text-gray-400">Choose Complex (단지 선택)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setSwapComplex(num)}
                                                className="bg-navy-800 hover:bg-gold-500 hover:text-navy-950 border border-white/10 p-8 rounded-xl text-2xl font-bold transition-all shadow-lg hover:shadow-gold-500/20"
                                            >
                                                {num}단지
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setSwapComplex('all')}
                                        className="bg-navy-900 border border-gold-500/30 text-gold-500 p-6 rounded-xl hover:bg-gold-500/10 font-bold transition-all"
                                    >
                                        View All Images (전체 보기)
                                    </button>
                                </div>
                            ) : (
                                <div className="min-h-full flex flex-col">
                                    <button
                                        onClick={() => setSwapComplex(null)}
                                        className="self-start mb-6 sticky top-0 z-10 bg-navy-950/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-gold-500 hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back to Complex Selection
                                    </button>
                                    <PhotoGrid
                                        complex={swapComplex}
                                        type="all"
                                        selectedIds={[]}
                                        onToggleSelection={toggleImageSelection}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Image Viewer */}
            <AnimatePresence>
                {viewingImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setViewingImage(null)}
                    >
                        <button
                            onClick={() => setViewingImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gold-500 transition-colors bg-white/10 rounded-full p-2 hover:bg-white/20 z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={viewingImage.url}
                            alt="Full View"
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl select-none"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {viewingImage.displayName && (
                            <div className="absolute bottom-6 md:bottom-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-base md:text-lg border border-white/10 shadow-xl">
                                {viewingImage.displayName}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto">
                {/* Quick Navigation Bar - Always visible in photos mode */}
                {activeTab === 'photos' && (
                    <div className="mb-6 flex flex-wrap gap-3 items-center justify-between bg-navy-900/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setViewAll(true);
                                    setSelectedComplex(null);
                                    setSelectedType(null);
                                }}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${viewAll
                                    ? 'bg-gold-500 text-navy-950'
                                    : 'bg-navy-800 text-white hover:bg-navy-700'
                                    }`}
                            >
                                🖼️ 전체 보기
                            </button>

                            {[1, 2, 3, 4].map(num => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        setViewAll(false);
                                        setSelectedComplex(num);
                                        setSelectedType(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedComplex === num && !viewAll
                                        ? 'bg-gold-500 text-navy-950'
                                        : 'bg-navy-800 text-white hover:bg-navy-700'
                                        }`}
                                >
                                    {num}단지
                                </button>
                            ))}
                        </div>

                        {selectedComplex && !viewAll && (
                            <div className="text-sm text-gray-400">
                                {selectedType ? `${selectedType}평` : '평형 선택'}
                            </div>
                        )}
                    </div>
                )}

                {(selectedComplex || selectedType || viewAll) && activeTab === 'photos' && (
                    <button
                        onClick={handleBack}
                        className="mb-8 text-gold-500 hover:text-gold-400 flex items-center gap-2 font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                )}

                <AnimatePresence mode="wait">

                    {/* VIDEO GALLERY MODE */}
                    {activeTab === 'videos' && (
                        <motion.div
                            key="video-gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="mb-12 text-center md:text-left">
                                <h2 className="text-4xl font-bold mb-4 text-white">UniCity <span className="text-gold-500">Video Tour</span></h2>
                                <p className="text-gray-400 font-light">Explore the complex through immersive video experiences.</p>
                            </div>
                            <VideoGrid videos={videos} />
                        </motion.div>
                    )}

                    {/* PHOTO GALLERY MODE */}
                    {activeTab === 'photos' && !selectedComplex && !viewAll && (
                        <motion.div
                            key="complex-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <div className="mb-12 text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">Select Complex</h2>
                                <p className="text-gray-400 font-light">Choose a residential complex to explore offering units.</p>
                            </div>

                            {/* All Images Button */}
                            <div className="mb-6">
                                <button
                                    onClick={() => setViewAll(true)}
                                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold py-4 px-6 rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-gold-500/20"
                                >
                                    <span className="text-lg">🖼️ View All Images (전체 이미지 보기)</span>
                                    <p className="text-xs mt-1 opacity-80">Compare images across all complexes</p>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {complexes.map((num, index) => (
                                    <ComplexCard
                                        key={num}
                                        number={num}
                                        index={index}
                                        onClick={() => setSelectedComplex(num)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* View All Images */}
                    {activeTab === 'photos' && viewAll && (
                        <motion.div
                            key="all-images"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">All Images (전체 이미지)</h2>
                            <PhotoGrid
                                complex="all"
                                type="all"
                                onCompare={startComparison}
                                selectedIds={selectedImages.map(i => i.id)}
                                onToggleSelection={toggleImageSelection}
                            />
                        </motion.div>
                    )}

                    {/* View 2: Type Selection */}
                    {activeTab === 'photos' && selectedComplex && !selectedType && (
                        <motion.div
                            key="type-list"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h2 className="text-4xl font-bold mb-8 text-white">{selectedComplex}단지 <span className="text-gray-600">Units</span></h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {types.map((type) => (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.05, borderColor: '#c5a059' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedType(type)}
                                        className="bg-navy-900 border border-white/10 p-6 md:p-10 rounded-2xl cursor-pointer transition-colors text-center shadow-lg group"
                                    >
                                        <span className="text-xl md:text-2xl font-bold group-hover:text-gold-500 transition-colors">{type}</span>
                                        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">View Photos</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* View 3: Photo Grid */}
                    {activeTab === 'photos' && selectedType && (
                        <motion.div
                            key="photo-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">{selectedType} Gallery</h2>
                            <PhotoGrid
                                complex={selectedComplex}
                                type={selectedType}
                                onCompare={startComparison}
                                selectedIds={selectedImages.map(i => i.id)}
                                onToggleSelection={toggleImageSelection}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Original Floating Action Bar - kept for fallback or specific manual usage */}
                <AnimatePresence>
                    {selectedImages.length > 0 && isCompareMode && (
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4"
                        >
                            <div className="bg-navy-900/90 backdrop-blur-md border border-gold-500/50 rounded-full px-8 py-4 shadow-2xl flex items-center gap-6">
                                <span className="text-sm font-bold text-gray-300">
                                    <span className="text-gold-500 text-lg mr-1">{selectedImages.length}</span>
                                    selected
                                </span>
                                <span className="text-xs text-white/50">
                                    {selectedImages.length === 2 ? "Ready!" : "Select more..."}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Chatbot FAB */}

        </div>
    );
};

export default GalleryPage;
