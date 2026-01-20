import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import { LogOut, ChevronLeft, Image, Youtube } from 'lucide-react';
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

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (activeTab === 'videos') {
            listVideos().then(setVideos);
        }
    }, [activeTab]);

    // ... existing constants ...
    const complexes = [1, 2, 3, 4];
    const types = selectedComplex ? COMPLEX_TYPES[selectedComplex] : [];

    const handleBack = () => {
        if (selectedType) {
            setSelectedType(null);
        } else if (selectedComplex) {
            setSelectedComplex(null);
        }
    };

    const startComparison = (left, right) => {
        setCompareImages({ left, right });
    };

    return (
        <div className="min-h-screen bg-navy-950 text-white p-6 md:p-12 relative">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight whitespace-nowrap">
                        <span className="text-gold-500">여여부동산</span> <span className="text-white/50 font-light">/ Gallery</span>
                    </h1>
                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
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

                <div className="flex gap-4">
                    {/* Mode Toggles */}
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

                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </header>

            {/* Comparison Overlay */}
            <AnimatePresence>
                {compareImages && (
                    <ComparisonSlider
                        leftImage={compareImages.left}
                        rightImage={compareImages.right}
                        onClose={() => setCompareImages(null)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto">
                {activeTab === 'photos' && (selectedComplex || selectedType) && (
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
                    {activeTab === 'photos' && !selectedComplex && (
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
                                        className="bg-navy-900 border border-white/10 p-10 rounded-2xl cursor-pointer transition-colors text-center shadow-lg group"
                                    >
                                        <span className="text-2xl font-bold group-hover:text-gold-500 transition-colors">{type}</span>
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
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default GalleryPage;
