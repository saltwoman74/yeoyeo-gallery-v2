import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Maximize2 } from 'lucide-react';
import { listImages } from '../../services/s3Service';

const PhotoGrid = ({ complex, type, onCompare }) => {
    const [images, setImages] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            const data = await listImages(`complex_${complex}/${type}`);
            setImages(data);
            setLoading(false);
        };
        fetchImages();
    }, [complex, type]);

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            if (selectedIds.length < 2) {
                setSelectedIds([...selectedIds, id]);
            }
        }
    };

    const handleCompare = () => {
        const selectedImages = images.filter(img => selectedIds.includes(img.id));
        onCompare(selectedImages[0], selectedImages[1]);
    };

    if (loading) {
        return <div className="text-center p-20 text-gold-500 animate-pulse">Loading Premium Gallery...</div>;
    }

    return (
        <div className="relative pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img) => {
                    const isSelected = selectedIds.includes(img.id);
                    return (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => toggleSelection(img.id)}
                            className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-gold-500 ring-4 ring-gold-500/20' : 'border-transparent hover:border-white/20'}`}
                        >
                            <img
                                src={img.url}
                                alt="Property"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                                {isSelected ? (
                                    <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-lg">
                                        <Check className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center">
                                        <Maximize2 className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4"
                    >
                        <div className="bg-navy-900/90 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 shadow-2xl flex items-center gap-6">
                            <span className="text-sm font-bold text-gray-300">
                                <span className="text-gold-500 text-lg mr-1">{selectedIds.length}</span>
                                selected
                            </span>

                            <button
                                onClick={handleCompare}
                                disabled={selectedIds.length !== 2}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedIds.length === 2
                                    ? 'bg-gold-500 text-navy-950 hover:bg-gold-400 hover:scale-105 shadow-lg shadow-gold-500/20'
                                    : 'bg-navy-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {selectedIds.length === 2 ? 'Start Comparison' : 'Select 2 to Compare'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotoGrid;
