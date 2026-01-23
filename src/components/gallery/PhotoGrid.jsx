import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Maximize2 } from 'lucide-react';
import { listImages } from '../../services/s3Service';

const PhotoGrid = ({ complex, type, onCompare, selectedIds = [], onToggleSelection }) => {
    const [images, setImages] = useState([]);
    // Removed local selectedIds state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);

            const typesConfig = {
                '1': ['25', '30', '35A', '35B', '41', '47', '56A', '56B'],
                '2': ['25', '30', '35A', '35B', '41'],
                '3': ['25', '30', '35A', '35B', '41'],
                '4': ['25', '30', '35A', '35B', '41', '48', '56A', '56B']
            };

            if (complex === 'all') {
                // Load all images from all complexes
                const allImages = [];
                const complexes = ['1', '2', '3', '4'];

                for (const c of complexes) {
                    for (const t of typesConfig[c]) {
                        try {
                            const path = `complex_${c}/${t}`;
                            const data = await listImages(path);
                            allImages.push(...data.map(img => ({
                                ...img,
                                displayName: `${c}단지 ${t}평`
                            })));
                        } catch (error) {
                            // Skip empty folders
                            console.log(`Skipping ${c}/${t}`);
                        }
                    }
                }
                setImages(allImages);
            } else if (type === 'all') {
                // Load ALL types for a SPECIFIC complex (New Logic)
                const complexTypes = typesConfig[complex] || [];
                const complexImages = [];

                for (const t of complexTypes) {
                    try {
                        const path = `complex_${complex}/${t}`;
                        const data = await listImages(path);
                        complexImages.push(...data.map(img => ({
                            ...img,
                            displayName: `${complex}단지 ${t}평`
                        })));
                    } catch (error) {
                        console.log(`Skipping ${complex}/${t}`);
                    }
                }
                setImages(complexImages);
            } else {
                // Load images from specific complex/type (Original Logic)
                const data = await listImages(`complex_${complex}/${type}`);
                setImages(data);
            }

            setLoading(false);
        };
        fetchImages();
    }, [complex, type]);

    // Updated handler to use prop
    const toggleSelection = (img) => {
        if (onToggleSelection) {
            onToggleSelection(img);
        }
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
                            onClick={() => toggleSelection(img)}
                            className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-gold-500 ring-4 ring-gold-500/20' : 'border-transparent hover:border-white/20'}`}
                        >
                            <img
                                src={img.url}
                                alt="Property"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Label showing complex and type */}
                            {img.displayName && (
                                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                    {img.displayName}
                                </div>
                            )}
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
        </div>
    );
};

export default PhotoGrid;
