import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Minimize2 } from 'lucide-react';

const ComparisonSlider = ({ leftImage, rightImage, onClose, onRequestReplace }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleDrag = (event, info) => {
        if (!containerRef.current) return;
        const { width } = containerRef.current.getBoundingClientRect();
        const newPos = (info.point.x / width) * 100;
        setSliderPosition(Math.min(100, Math.max(0, newPos)));
    };

    // Mobile touch support
    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const newPos = (x / rect.width) * 100;
        setSliderPosition(Math.min(100, Math.max(0, newPos)));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-navy-950 flex flex-col landscape:flex-row"
        >
            {/* Header (Hidden in Landscape to maximize view) */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-navy-900/50 backdrop-blur-md landscape:hidden shrink-0">
                <div>
                    <h2 className="text-xl font-serif font-bold text-white">Comparison Mode</h2>
                    <p className="text-xs text-gold-500 uppercase tracking-widest">Before vs After</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <Minimize2 className="w-6 h-6" />
                </button>
            </div>

            {/* Close Button specific for Landscape (Overlay) */}
            <button
                onClick={onClose}
                className="hidden landscape:block absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white backdrop-blur-md border border-white/10"
            >
                <Minimize2 className="w-5 h-5" />
            </button>

            {/* Slider Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 landscape:p-0 overflow-hidden bg-black/50 landscape:bg-black">
                <div
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] md:aspect-video landscape:w-full landscape:h-full landscape:aspect-auto landscape:rounded-none rounded-2xl overflow-hidden shadow-2xl border border-white/10 select-none"
                    onTouchMove={handleTouchMove}
                >
                    {/* Right Image (Background) - "After" */}
                    <img
                        src={rightImage.url}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable="false"
                    />
                    {/* Left Image (Clipped) - "Before" */}
                    <div
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    >
                        <img
                            src={leftImage.url}
                            alt="Before"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable="false"
                        />
                    </div>

                    {/* Left Image Controls (Moved OUT of clip-path to fix Z-index/Clickability) */}
                    <div className="absolute top-20 left-4 z-30 flex flex-col items-start gap-2">
                        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white border border-white/10">
                            Target A {leftImage.displayName ? `(${leftImage.displayName})` : ''}
                        </div>
                        {onRequestReplace && (
                            <button
                                onClick={() => onRequestReplace('left')}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="bg-gold-500 text-navy-950 px-3 py-1 rounded text-xs font-bold hover:bg-gold-400 transition-colors shadow-lg pointer-events-auto"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {/* Right Image Controls (Moved here for Z-index stacking) */}
                    <div className="absolute top-20 right-4 z-30 flex flex-col items-end gap-2">
                        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white border border-white/10">
                            Target B {rightImage.displayName ? `(${rightImage.displayName})` : ''}
                        </div>
                        {onRequestReplace && (
                            <button
                                onClick={() => onRequestReplace('right')}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="bg-gold-500 text-navy-950 px-3 py-1 rounded text-xs font-bold hover:bg-gold-400 transition-colors shadow-lg pointer-events-auto"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {/* Handle Line */}
                    <div
                        className="absolute inset-y-0 w-1 bg-white cursor-ew-resize hover:bg-gold-400 transition-colors"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        {/* Handle Knob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-navy-950 cursor-grab active:cursor-grabbing">
                            <div className="flex gap-1">
                                <ChevronLeft className="w-3 h-3 text-navy-950" />
                                <ChevronRight className="w-3 h-3 text-navy-950" />
                            </div>
                        </div>
                    </div>

                    {/* Invisible Draggable Layer for Mouse */}
                    <motion.div
                        className="absolute inset-0 z-10 cursor-ew-resize opacity-0"
                        drag="x"
                        dragConstraints={containerRef}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={handleDrag}
                    />
                </div>
            </div>

            {/* Instructions (Hidden in Landscape) */}
            <div className="p-6 text-center text-gray-500 text-sm shrink-0 landscape:hidden">
                Drag the slider horizontally to compare details.
            </div>
        </motion.div>
    );
};

export default ComparisonSlider;
