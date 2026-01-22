import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Image as ImageIcon, Video, CheckCircle, ArrowLeftRight } from 'lucide-react';
import { COMPLEX_TYPES, PHOTO_CATEGORIES, VIDEO_CATEGORIES } from '../constants';
import 'img-comparison-slider';


const ImageComparisonApp = ({ onBack, onAdmin }) => {
    const [view, setView] = useState('main'); // main, gallery, comparison, admin


    const [selectedComplex, setSelectedComplex] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(PHOTO_CATEGORIES[0].id);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [mediaType, setMediaType] = useState('image'); // image, video
    const [changingSide, setChangingSide] = useState(null); // 'left' (0) or 'right' (1)
    const [data, setData] = useState([]);

    useEffect(() => {
        // Load data from local storage
        const savedData = localStorage.getItem('uniticity_media_data');
        if (savedData) {
            setData(JSON.parse(savedData));
        } else {
            // Initial mock data if empty
            const initialMock = [
                { id: 1, type: '35A타입', complex: '1단지', category: 'living', mediaType: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6191da95b4?w=800', title: '거실 샘플' },
                { id: 2, type: '35A타입', complex: '1단지', category: 'living', mediaType: 'image', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800', title: '거실 샘플 2' },
                { id: 3, type: '35A타입', complex: '1단지', category: 'indoor', mediaType: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: '실내 투어' }
            ];
            setData(initialMock);
            localStorage.setItem('uniticity_media_data', JSON.stringify(initialMock));
        }
    }, []);

    const filteredMedia = data.filter(item =>
        item.complex === selectedComplex &&
        item.type === selectedType &&
        item.category === selectedCategory &&
        item.mediaType === mediaType
    );



    const handleComplexSelect = (complex) => {
        setSelectedComplex(complex);
        setView('type');
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setView('gallery');
    };

    const toggleImageSelection = (img) => {
        if (selectedImages.find(i => i.id === img.id)) {
            setSelectedImages(selectedImages.filter(i => i.id !== img.id));
        } else {
            if (selectedImages.length < 2) {
                setSelectedImages([...selectedImages, img]);
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <ImageIcon className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight luxury-text">YE-YE REAL ESTATE</h1>
                        <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-[0.2em]">Premium Gallery</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <button onClick={() => {
                        if (view === 'main') onBack();
                        else setView('main');
                    }} className="hover:text-indigo-400 transition-colors">
                        {view === 'main' ? 'Chatbot' : 'Back to Main'}
                    </button>
                    <button className="hover:text-indigo-400 transition-colors">Compare</button>
                    <button className="hover:text-indigo-400 transition-colors">Virtual Tour</button>
                </nav>


                <div className="flex items-center gap-4">
                    <button
                        onClick={onAdmin}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-semibold border border-white/10 transition-all"
                    >
                        Admin
                    </button>
                </div>

            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {view === 'main' && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl md:text-5xl font-bold luxury-text">Explore UniCity</h2>
                                <p className="text-slate-400 max-w-2xl mx-auto">창원 중동 유니시티의 모든 단지와 타입을 고화질 이미지와 영상으로 만나보세요.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((num) => (
                                    <motion.button
                                        key={num}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleComplexSelect(`${num}단지`)}
                                        className="relative group h-96 rounded-3xl overflow-hidden border border-white/10"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                                        <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                                        <img
                                            src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop`}
                                            alt={`Complex ${num}`}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-8 left-8 z-30 space-y-1">
                                            <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Complex 0{num}</p>
                                            <h3 className="text-3xl font-bold luxury-text">{num}단지</h3>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === 'type' && (
                        <motion.div
                            key="type"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <button onClick={() => setView('main')} className="flex items-center gap-2 text-indigo-400 font-bold">
                                <ChevronLeft className="w-5 h-5" /> Back to Complexes
                            </button>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-bold luxury-text">{selectedComplex}</h2>
                                <p className="text-slate-400">비교하고 싶은 타입을 선택해주세요.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {COMPLEX_TYPES[selectedComplex].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeSelect(type)}
                                        className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all text-center group"
                                    >
                                        <span className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-4">
                                    <button onClick={() => setView('type')} className="flex items-center gap-2 text-indigo-400 font-bold">
                                        <ChevronLeft className="w-5 h-5" /> Back to Types
                                    </button>
                                    <h2 className="text-4xl font-bold luxury-text">{selectedComplex} <span className="text-indigo-400">/</span> {selectedType}</h2>
                                </div>

                                <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setMediaType('image')}
                                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mediaType === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <ImageIcon className="w-3.5 h-3.5" /> Images
                                    </button>
                                    <button
                                        onClick={() => setMediaType('video')}
                                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mediaType === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Video className="w-3.5 h-3.5" /> Videos
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                                {(mediaType === 'image' ? PHOTO_CATEGORIES : VIDEO_CATEGORIES).map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat.id ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'}`}
                                    >
                                        {cat.kr} <span className="opacity-50 font-medium ml-1">/ {cat.en}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMedia.length > 0 ? filteredMedia.map((item) => (
                                    <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
                                        {item.mediaType === 'image' ? (
                                            <>
                                                <img
                                                    src={item.url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                    <button className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                        <Maximize2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleImageSelection(item)}
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${selectedImages.find(i => i.id === item.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-950'}`}
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full relative">
                                                <iframe
                                                    src={item.url}
                                                    className="w-full h-full"
                                                    title={item.title}
                                                    allowFullScreen
                                                />
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                        <Play className="w-3 h-3 fill-current" /> YOUTUBE
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <p className="text-slate-500 font-medium">등록된 데이터가 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Compare Bar */}
            <AnimatePresence>
                {selectedImages.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full z-50 p-6 flex justify-center"
                    >
                        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-6 max-w-2xl w-full">
                            <div className="flex gap-2">
                                {selectedImages.map(img => (
                                    <div key={img.id} className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20">
                                        <img src="https://images.unsplash.com/photo-1600585154340-be6191da95b4?w=200" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => toggleImageSelection(img)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {selectedImages.length === 1 && (
                                    <div className="w-16 h-12 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <span className="text-[10px] text-slate-500 font-bold">ADD</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-400">Selection: <span className="text-white">{selectedImages.length}/2</span></p>
                                <p className="text-[10px] text-slate-500">2장의 이미지를 비교하여 차이를 확인하세요.</p>
                            </div>

                            <button
                                onClick={() => setShowComparison(true)}
                                disabled={selectedImages.length < 2}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${selectedImages.length === 2 ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-500 grayscale cursor-not-allowed'}`}
                            >
                                Compare Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && selectedImages.length === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950 flex flex-col"
                    >
                        {/* Selector Overlay */}
                        {changingSide !== null && (
                            <div className="absolute inset-0 z-[110] bg-slate-950/90 backdrop-blur-xl flex flex-col">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
                                    <h3 className="text-lg font-bold">Select Image for {changingSide === 0 ? 'Left' : 'Right'} Side</h3>
                                    <button onClick={() => setChangingSide(null)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {data.filter(d => d.mediaType === 'image').map(img => (
                                        <button
                                            key={img.id}
                                            onClick={() => {
                                                const newSelection = [...selectedImages];
                                                newSelection[changingSide] = img;
                                                setSelectedImages(newSelection);
                                                setChangingSide(null);
                                            }}
                                            className="group relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500 transition-all"
                                        >
                                            <img src={img.url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 p-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-xs font-bold">{img.complex}</p>
                                                <p className="text-[10px] text-slate-300">{img.type}</p>
                                            </div>
                                            {selectedImages.find(i => i.id === img.id) && (
                                                <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full"><CheckCircle className="w-3 h-3" /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Modal Header */}
                        <div className="p-4 md:p-6 bg-slate-900 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold luxury-text">Image Comparison</h2>
                                    <p className="text-xs text-slate-400">
                                        {selectedImages[0].complex} {selectedImages[0].type} vs {selectedImages[1].complex} {selectedImages[1].type}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-white/5 px-3 py-1 rounded text-[10px] font-bold border border-white/10">SLIDER MODE</span>
                                <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-white/5 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Slider Area */}
                        <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
                            <div className="w-full max-w-5xl aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-slate-900">
                                <img-comparison-slider class="w-full h-full cursor-ew-resize focus:outline-none">
                                    <img
                                        slot="first"
                                        src={selectedImages[0].url}
                                        className="w-full h-full object-cover"
                                        alt="First image"
                                    />
                                    <img
                                        slot="second"
                                        src={selectedImages[1].url}
                                        className="w-full h-full object-cover"
                                        alt="Second image"
                                    />
                                    <div slot="handle" className="h-full w-1 bg-white relative flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-900">
                                            <ArrowLeftRight className="w-4 h-4 text-slate-900" />
                                        </div>
                                    </div>
                                </img-comparison-slider>

                                {/* Labels & Controls */}
                                <div className="absolute top-6 left-6 z-10 flex items-start gap-2">
                                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Left</p>
                                        <p className="text-sm font-bold text-white">{selectedImages[0].complex} {selectedImages[0].type}</p>
                                    </div>
                                    <button
                                        onClick={() => setChangingSide(0)}
                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>

                                <div className="absolute top-6 right-6 z-10 flex items-start gap-2 flex-row-reverse text-right">
                                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Right</p>
                                        <p className="text-sm font-bold text-white">{selectedImages[1].complex} {selectedImages[1].type}</p>
                                    </div>
                                    <button
                                        onClick={() => setChangingSide(1)}
                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Info / Footer */}
                        <div className="p-8 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
                            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">비교 가이드</h3>
                                    <p className="text-sm text-slate-400">중앙의 핸들을 좌우로 드래그하여 두 이미지의 차이점을 확인하세요. 'Change' 버튼을 눌러 다른 단지의 이미지와 비교할 수 있습니다.</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold text-xs">
                                        <Play className="w-4 h-4 fill-current" /> 관련 영상 보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

const CheckCircle2 = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

export default ImageComparisonApp;
