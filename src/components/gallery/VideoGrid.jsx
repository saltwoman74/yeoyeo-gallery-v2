import React from 'react';

const VideoGrid = ({ videos }) => {
    const getEmbedUrl = (url) => {
        try {
            // Normalize URL - handle both youtube.com and www.youtube.com
            const normalizedUrl = url.toLowerCase().trim();
            let videoId = '';

            // Method 1: Standard watch URL (youtube.com/watch?v=VIDEO_ID or www.youtube.com/watch?v=VIDEO_ID)
            if (normalizedUrl.includes('youtube.com/watch')) {
                const urlParams = new URLSearchParams(normalizedUrl.split('?')[1]);
                videoId = urlParams.get('v') || '';
            }
            // Method 2: Short URL (youtu.be/VIDEO_ID)
            else if (normalizedUrl.includes('youtu.be/')) {
                videoId = normalizedUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
            }
            // Method 3: YouTube Shorts (youtube.com/shorts/VIDEO_ID or www.youtube.com/shorts/VIDEO_ID)
            else if (normalizedUrl.includes('/shorts/')) {
                videoId = normalizedUrl.split('/shorts/')[1].split('?')[0].split('&')[0];
            }

            // Clean video ID (remove any remaining query parameters or fragments)
            videoId = videoId.split('?')[0].split('&')[0].split('#')[0];

            if (!videoId) {
                console.error('Failed to extract video ID from URL:', url);
                return '';
            }

            const embedUrl = `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`;
            console.log('Generated embed URL for video ID:', videoId, '→', embedUrl);
            return embedUrl;
        } catch (e) {
            console.error('Error parsing YouTube URL:', url, e);
            return '';
        }
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
                <div key={video.id} className="bg-navy-900 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-colors shadow-lg group">
                    <div className="relative aspect-video bg-black">
                        <iframe
                            src={getEmbedUrl(video.url)}
                            title={video.title}
                            className="absolute inset-0 w-full h-full"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            referrerPolicy="no-referrer-when-downgrade"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ border: 'none' }}
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
