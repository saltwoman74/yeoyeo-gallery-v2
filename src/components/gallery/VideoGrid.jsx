import React from 'react';
import { ExternalLink } from 'lucide-react';

const VideoGrid = ({ videos }) => {
    const getVideoId = (url) => {
        try {
            // IDs are case sensitive, so we only trim
            const normalizedUrl = url.trim();
            let videoId = '';

            if (normalizedUrl.includes('youtube.com/watch')) {
                const urlParams = new URLSearchParams(normalizedUrl.split('?')[1]);
                videoId = urlParams.get('v') || '';
            }
            else if (normalizedUrl.includes('youtu.be/')) {
                videoId = normalizedUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
            }
            else if (normalizedUrl.includes('/shorts/')) {
                videoId = normalizedUrl.split('/shorts/')[1].split('?')[0].split('&')[0];
            }

            if (videoId) {
                videoId = videoId.split('?')[0].split('&')[0].split('#')[0];
            }

            return videoId;
        } catch (e) {
            console.error('Error parsing YouTube URL:', url, e);
            return '';
        }
    };

    const getThumbnailUrl = (url) => {
        const videoId = getVideoId(url);
        if (!videoId) return '';
        // Use maxresdefault for best quality, fallback to hqdefault
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    };

    console.log('VideoGrid rendering with videos:', videos);

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
                <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-navy-900 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all shadow-lg group cursor-pointer"
                >
                    <div className="relative aspect-video bg-black">
                        <img
                            src={getThumbnailUrl(video.url)}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to hqdefault if maxresdefault fails
                                const videoId = getVideoId(video.url);
                                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            }}
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        {/* External link icon */}
                        <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-white group-hover:text-gold-500 transition-colors truncate">{video.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">YouTube에서 보기</p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default VideoGrid;
