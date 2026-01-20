import React from 'react';

const VideoGrid = ({ videos }) => {
    const getEmbedUrl = (url) => {
        try {
            // Simple parser for standard youtube URLs
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/shorts/')) {
                // Support for YouTube Shorts
                videoId = url.split('shorts/')[1].split('?')[0];
            }
            return `https://www.youtube.com/embed/${videoId}`;
        } catch (e) {
            return '';
        }
    };

    if (!videos || videos.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-gray-500">등록된 영상이 없습니다 (No Videos)</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <div key={video.id} className="bg-navy-900 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-colors shadow-lg group">
                    <div className="relative aspect-video bg-black">
                        <iframe
                            src={getEmbedUrl(video.url)}
                            title={video.title}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-white group-hover:text-gold-500 transition-colors truncate">{video.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">YouTube</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoGrid;
