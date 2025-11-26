import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings as SettingsIcon } from 'lucide-react';

const SyncPlayer = ({ socket, roomId, isHost = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const syncIntervalRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('play-video', ({ timestamp }) => {
            if (videoRef.current && !isHost) {
                videoRef.current.currentTime = timestamp;
                videoRef.current.play();
                setIsPlaying(true);
            }
        });

        socket.on('pause-video', ({ timestamp }) => {
            if (videoRef.current && !isHost) {
                videoRef.current.currentTime = timestamp;
                videoRef.current.pause();
                setIsPlaying(false);
            }
        });

        socket.on('seek-video', ({ time }) => {
            if (videoRef.current && !isHost) {
                videoRef.current.currentTime = time;
                setCurrentTime(time);
            }
        });

        socket.on('sync-request', () => {
            if (isHost && videoRef.current) {
                socket.emit('sync-response', {
                    roomId,
                    currentTime: videoRef.current.currentTime,
                    isPlaying: !videoRef.current.paused
                });
            }
        });

        socket.on('sync-response', ({ currentTime: syncTime, isPlaying: syncPlaying }) => {
            if (!isHost && videoRef.current) {
                const drift = Math.abs(videoRef.current.currentTime - syncTime);
                if (drift > 1) { // If drift is more than 1 second, sync
                    videoRef.current.currentTime = syncTime;
                }
                if (syncPlaying && videoRef.current.paused) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else if (!syncPlaying && !videoRef.current.paused) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            }
        });

        socket.on('countdown-start', ({ duration: countdownDuration }) => {
            startCountdown(countdownDuration);
        });

        socket.on('video-url-change', ({ url }) => {
            setVideoUrl(url);
            if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
            }
        });

        return () => {
            socket.off('play-video');
            socket.off('pause-video');
            socket.off('seek-video');
            socket.off('sync-request');
            socket.off('sync-response');
            socket.off('countdown-start');
            socket.off('video-url-change');
        };
    }, [socket, isHost, roomId]);

    // Periodic sync check (every 5 seconds)
    useEffect(() => {
        if (!isHost && socket) {
            syncIntervalRef.current = setInterval(() => {
                socket.emit('sync-request', { roomId });
            }, 5000);
        }

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [isHost, socket, roomId]);

    const startCountdown = (countdownDuration = 3) => {
        setShowCountdown(true);
        setCountdown(countdownDuration);

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                    handlePlay();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
            if (isHost && socket) {
                socket.emit('play-video', {
                    roomId,
                    timestamp: videoRef.current.currentTime
                });
            }
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
            if (isHost && socket) {
                socket.emit('pause-video', {
                    roomId,
                    timestamp: videoRef.current.currentTime
                });
            }
        }
    };

    const handleSeek = (e) => {
        if (!videoRef.current || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;

        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);

        if (isHost && socket) {
            socket.emit('seek-video', {
                roomId,
                time: newTime
            });
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            }
        }
    };

    const handleSkip = (seconds) => {
        if (videoRef.current) {
            const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);

            if (isHost && socket) {
                socket.emit('seek-video', {
                    roomId,
                    time: newTime
                });
            }
        }
    };

    const handleVideoUrlSubmit = () => {
        if (isHost && socket && videoUrl) {
            socket.emit('video-url-change', { roomId, url: videoUrl });
            if (videoRef.current) {
                videoRef.current.src = videoUrl;
                videoRef.current.load();
            }
            setShowUrlInput(false);
        }
    };

    const handleCountdownStart = () => {
        if (isHost && socket) {
            socket.emit('countdown-start', { roomId, duration: 3 });
            startCountdown(3);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-midnight/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onEnded={() => setIsPlaying(false)}
                    >
                        <source src={videoUrl} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-white/60 mb-4">No video loaded</p>
                            {isHost && (
                                <button
                                    onClick={() => setShowUrlInput(true)}
                                    className="px-6 py-3 bg-gradient-to-br from-blush to-lavender rounded-xl text-white font-medium hover:shadow-lg transition-all"
                                >
                                    Load Video
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Countdown Overlay */}
                {showCountdown && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                        <div className="text-center">
                            <p className="text-white/60 text-xl mb-4">Movie starts in...</p>
                            <div className="text-9xl font-bold text-white animate-bounce">
                                {countdown}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    className="relative h-2 bg-white/10 rounded-full cursor-pointer group"
                    onClick={handleSeek}
                >
                    <div
                        className="absolute h-full bg-gradient-to-r from-blush to-lavender rounded-full transition-all"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-sm text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Skip Back */}
                        <button
                            onClick={() => handleSkip(-10)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Skip back 10s"
                        >
                            <SkipBack className="w-5 h-5 text-white" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={isPlaying ? handlePause : handlePlay}
                            className="p-3 bg-gradient-to-br from-blush to-lavender rounded-full hover:shadow-lg transition-all hover:scale-110"
                            disabled={!videoUrl}
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-white fill-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white fill-white" />
                            )}
                        </button>

                        {/* Skip Forward */}
                        <button
                            onClick={() => handleSkip(10)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Skip forward 10s"
                        >
                            <SkipForward className="w-5 h-5 text-white" />
                        </button>

                        {/* Countdown (Host Only) */}
                        {isHost && videoUrl && (
                            <button
                                onClick={handleCountdownStart}
                                className="ml-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors"
                            >
                                3-2-1 Start
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Volume */}
                        <div className="flex items-center gap-2">
                            <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                {isMuted || volume === 0 ? (
                                    <VolumeX className="w-5 h-5 text-white" />
                                ) : (
                                    <Volume2 className="w-5 h-5 text-white" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 accent-blush"
                            />
                        </div>

                        {/* Fullscreen */}
                        <button
                            onClick={handleFullscreen}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Maximize className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Host Controls */}
                {isHost && (
                    <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 mb-2">Host Controls</p>
                        <button
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="text-sm text-blush hover:text-lavender transition-colors"
                        >
                            {showUrlInput ? 'Cancel' : 'Change Video URL'}
                        </button>
                    </div>
                )}
            </div>

            {/* URL Input Modal */}
            {showUrlInput && isHost && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-midnight/95 border border-white/10 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-heading font-semibold text-white mb-4">Load Video</h3>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Enter video URL (MP4, WebM, etc.)"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blush/50 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUrlInput(false)}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVideoUrlSubmit}
                                className="flex-1 px-4 py-2 bg-gradient-to-br from-blush to-lavender rounded-xl text-white font-medium hover:shadow-lg transition-all"
                            >
                                Load
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyncPlayer;
