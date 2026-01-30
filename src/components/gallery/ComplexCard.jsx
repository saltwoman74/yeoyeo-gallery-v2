import React from 'react';
import { motion } from 'framer-motion';

const ComplexCard = ({ number, onClick, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }} // index comes from props
            onClick={() => onClick(number)}
            className="group relative h-60 md:h-80 w-full cursor-pointer perspective-1000 touch-manipulation"
        >
            <div className="absolute inset-0 bg-navy-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 transform md:group-hover:-translate-y-2 md:group-hover:scale-[1.02] active:scale-[0.98] md:active:scale-[0.98] border border-white/5 md:group-hover:border-gold-500/50 active:border-gold-500 active:bg-gold-500/10 active:shadow-[0_0_40px_rgba(197,160,89,0.4)] active:brightness-125 md:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Image/Gradient Background placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950 opacity-90 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mixed-blend-overlay" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-16 h-1 bg-gold-500/30 rounded-full mb-8 group-hover:w-24 group-hover:bg-gold-500 transition-all duration-300" />

                    <h3 className="text-3xl md:text-5xl font-sans font-bold text-white mb-2 tracking-tight group-hover:text-gold-100 transition-colors drop-shadow-lg whitespace-nowrap">
                        <span className="inline-block transform group-hover:scale-110 transition-transform duration-300">{number}</span>
                        <span className="text-xl md:text-3xl ml-1 font-light opacity-80">단지</span>
                    </h3>

                    <p className="text-gold-500/80 text-sm tracking-[0.3em] uppercase mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Premium Complex
                    </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </motion.div>
    );
};

export default ComplexCard;
