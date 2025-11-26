import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, Phone, Eye, EyeOff, Projector, Settings, Heart, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [stream, setStream] = useState(null);
    const [partnerStream, setPartnerStream] = useState(null);
    const [waiting, setWaiting] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isUiHidden, setIsUiHidden] = useState(false);
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // New Features State
    const [theme, setTheme] = useState('romantic');
    const [showSettings, setShowSettings] = useState(false);
    const [reactions, setReactions] = useState([]);
    const [connectedTime, setConnectedTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [showReactionsMenu, setShowReactionsMenu] = useState(false);
    const [partnerDisconnected, setPartnerDisconnected] = useState(false);

    const myVideo = useRef();
    const partnerVideo = useRef();
    const cinemaMainVideo = useRef(); // For cinema mode main screen
    const cinemaPipVideo = useRef(); // For cinema mode PiP
    const socketRef = useRef();
    const connectionRef = useRef();
    const partnerIdRef = useRef();
    const timerRef = useRef();
    const containerRef = useRef();
    const cameraStreamRef = useRef(null); // Store original camera stream
    const screenStreamRef = useRef(null); // Store screen share stream
    const audioContextRef = useRef(null); // Store audio context for mixing

    useEffect(() => {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
        socketRef.current = io(serverUrl);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                cameraStreamRef.current = currentStream; // Store camera stream
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                socketRef.current.emit('join-room', roomId);

                socketRef.current.on('room-full', () => {
                    alert("Room is full!");
                    navigate('/');
                });

                socketRef.current.on('user-connected', (userId) => {
                    console.log("User connected: " + userId);
                    partnerIdRef.current = userId;
                    setPartnerDisconnected(false);
                    callUser(userId, currentStream);
                });

                socketRef.current.on('offer', (payload) => {
                    console.log("Received offer from: " + payload.caller);
                    partnerIdRef.current = payload.caller;
                    setPartnerDisconnected(false);
                    answerCall(payload, currentStream);
                });

                socketRef.current.on('answer', (payload) => {
                    console.log("Received answer");
                    if (connectionRef.current) {
                        connectionRef.current.signal(payload.signal);
                    }
                });

                socketRef.current.on('ice-candidate', (payload) => {
                    if (connectionRef.current) {
                        connectionRef.current.signal(payload.candidate);
                    }
                });

                socketRef.current.on('cinema-mode-change', ({ mode }) => {
                    setIsCinemaMode(mode);
                });

                socketRef.current.on('receive-reaction', (payload) => {
                    addReaction(payload.emoji, payload.x, payload.y);
                });

                socketRef.current.on('update-theme', ({ theme }) => {
                    setTheme(theme);
                });

                socketRef.current.on('user-disconnected', () => {
                    setPartnerDisconnected(true);
                    // We don't set waiting to true, because we want to show the specific "Miss You" screen
                });

            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
            });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (connectionRef.current) connectionRef.current.destroy();
            if (cameraStreamRef.current) {
                cameraStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [roomId, navigate]);

    // Timer Logic
    useEffect(() => {
        if (!waiting && !partnerDisconnected && !timerRef.current) {
            const startTime = Date.now();
            setConnectedTime(startTime);

            timerRef.current = setInterval(() => {
                const now = Date.now();
                const diff = now - startTime;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setElapsedTime(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);
        } else if (partnerDisconnected) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [waiting, partnerDisconnected]);

    // Update partner video element when partnerStream changes
    useEffect(() => {
        if (partnerVideo.current && partnerStream) {
            partnerVideo.current.srcObject = partnerStream;
        }
    }, [partnerStream]);

    // Update cinema mode videos when screen sharing or streams change
    useEffect(() => {
        if (isCinemaMode) {
            if (isScreenSharing) {
                // I'm sharing: main screen shows my screen, PiP shows partner
                if (cinemaMainVideo.current && myVideo.current?.srcObject) {
                    cinemaMainVideo.current.srcObject = myVideo.current.srcObject;
                }
                if (cinemaPipVideo.current && partnerStream) {
                    cinemaPipVideo.current.srcObject = partnerStream;
                }
            } else {
                // Partner is sharing: main screen shows partner, PiP shows me
                if (cinemaMainVideo.current && partnerStream) {
                    cinemaMainVideo.current.srcObject = partnerStream;
                }
                if (cinemaPipVideo.current && cameraStreamRef.current) {
                    cinemaPipVideo.current.srcObject = cameraStreamRef.current;
                }
            }
        } else {
            // Not in cinema mode - restore normal video feeds
            if (myVideo.current && cameraStreamRef.current) {
                myVideo.current.srcObject = cameraStreamRef.current;
            }
            if (partnerVideo.current && partnerStream) {
                partnerVideo.current.srcObject = partnerStream;
            }
        }
    }, [isCinemaMode, isScreenSharing, partnerStream]);

    const callUser = (id, currentStream) => {
        const peer = new Peer({
            initiator: true,
            trickle: true,
            stream: currentStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ]
            }
        });

        peer.on('signal', (data) => {
            if (data.type === 'offer') {
                socketRef.current.emit('offer', { target: id, caller: socketRef.current.id, signal: data });
            } else if (data.candidate) {
                socketRef.current.emit('ice-candidate', { target: id, candidate: data });
            }
        });

        peer.on('stream', (remoteStream) => {
            console.log("Received remote stream");
            setPartnerStream(remoteStream);
            setWaiting(false);
        });

        peer.on('error', (err) => {
            console.error('Peer connection error:', err);
        });

        connectionRef.current = peer;
    };

    const answerCall = (payload, currentStream) => {
        setWaiting(false);

        const peer = new Peer({
            initiator: false,
            trickle: true,
            stream: currentStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ]
            }
        });

        peer.on('signal', (data) => {
            if (data.type === 'answer') {
                socketRef.current.emit('answer', { target: payload.caller, caller: socketRef.current.id, signal: data });
            } else if (data.candidate) {
                socketRef.current.emit('ice-candidate', { target: payload.caller, candidate: data });
            }
        });

        peer.on('stream', (remoteStream) => {
            console.log("Received remote stream");
            setPartnerStream(remoteStream);
        });

        peer.on('error', (err) => {
            console.error('Peer connection error:', err);
        });

        peer.signal(payload.signal);
        connectionRef.current = peer;
    };

    const startScreenShare = async () => {
        try {
            const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            screenStreamRef.current = newScreenStream;
            const screenVideoTrack = newScreenStream.getVideoTracks()[0];
            const screenAudioTrack = newScreenStream.getAudioTracks()[0];

            console.log('Screen share started. Has audio:', !!screenAudioTrack);

            // Replace video track in peer connection
            if (connectionRef.current && connectionRef.current._pc) {
                const senders = connectionRef.current._pc.getSenders();
                const videoSender = senders.find(s => s.track && s.track.kind === 'video');

                if (videoSender) {
                    await videoSender.replaceTrack(screenVideoTrack);
                    console.log('Video track replaced with screen share');
                }

                // Handle audio mixing
                const audioSender = senders.find(s => s.track && s.track.kind === 'audio');

                if (audioSender) {
                    if (screenAudioTrack) {
                        // Create audio context for mixing
                        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                        const destination = audioContextRef.current.createMediaStreamDestination();

                        // Add screen audio (movie/system audio)
                        const screenSource = audioContextRef.current.createMediaStreamSource(
                            new MediaStream([screenAudioTrack])
                        );
                        screenSource.connect(destination);
                        console.log('Screen audio connected');

                        // Add mic audio if available and not muted
                        if (cameraStreamRef.current && cameraStreamRef.current.getAudioTracks().length > 0) {
                            const micTrack = cameraStreamRef.current.getAudioTracks()[0];
                            if (micTrack.enabled) {
                                const micSource = audioContextRef.current.createMediaStreamSource(
                                    new MediaStream([micTrack])
                                );
                                micSource.connect(destination);
                                console.log('Microphone audio connected');
                            }
                        }

                        // Replace audio track with mixed audio
                        const mixedAudioTrack = destination.stream.getAudioTracks()[0];
                        await audioSender.replaceTrack(mixedAudioTrack);
                        console.log('Mixed audio track sent to partner');
                    } else {
                        console.log('No screen audio available, keeping microphone audio only');
                        // Keep the existing microphone audio
                    }
                }
            }

            // Update local video display
            if (myVideo.current) {
                myVideo.current.srcObject = newScreenStream;
            }

            setIsScreenSharing(true);
            setIsCinemaMode(true);
            socketRef.current.emit('cinema-mode-change', { roomId, mode: true });

            // Handle screen share ending
            screenVideoTrack.onended = () => {
                stopScreenShare();
            };

        } catch (err) {
            console.error("Failed to share screen", err);
        }
    };

    const stopScreenShare = async () => {
        console.log('Stopping screen share...');

        // Stop screen stream
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }

        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
            console.log('Audio context closed');
        }

        // Restore camera stream to peer connection
        if (connectionRef.current && connectionRef.current._pc && cameraStreamRef.current) {
            const senders = connectionRef.current._pc.getSenders();
            const videoTrack = cameraStreamRef.current.getVideoTracks()[0];
            const audioTrack = cameraStreamRef.current.getAudioTracks()[0];

            const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            const audioSender = senders.find(s => s.track && s.track.kind === 'audio');

            try {
                if (videoSender && videoTrack) {
                    await videoSender.replaceTrack(videoTrack);
                    console.log('Video track restored to camera');
                }
                if (audioSender && audioTrack) {
                    await audioSender.replaceTrack(audioTrack);
                    console.log('Audio track restored to microphone');
                }
            } catch (err) {
                console.error('Error restoring tracks:', err);
            }
        }

        // Update state to exit cinema mode
        setIsScreenSharing(false);
        setIsCinemaMode(false);
        socketRef.current.emit('cinema-mode-change', { roomId, mode: false });

        // Force update video elements after a brief delay
        setTimeout(() => {
            if (myVideo.current && cameraStreamRef.current) {
                myVideo.current.srcObject = cameraStreamRef.current;
                console.log('My video restored');
            }
            if (partnerVideo.current && partnerStream) {
                partnerVideo.current.srcObject = partnerStream;
                console.log('Partner video restored');
            }
        }, 100);
    };

    const toggleMute = () => {
        if (cameraStreamRef.current && cameraStreamRef.current.getAudioTracks().length > 0) {
            const audioTrack = cameraStreamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (cameraStreamRef.current && cameraStreamRef.current.getVideoTracks().length > 0) {
            const videoTrack = cameraStreamRef.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!isVideoOff);
        }
    };

    const toggleUi = () => {
        setIsUiHidden(!isUiHidden);
    };

    const endCall = () => {
        navigate('/');
        window.location.reload();
    };

    // --- New Features Logic ---

    const addReaction = (emoji, x, y) => {
        const id = Date.now() + Math.random();
        setReactions(prev => [...prev, { id, emoji, x, y }]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 3000);
    };

    const sendReaction = (emoji) => {
        const x = Math.floor(Math.random() * 80) + 10;
        const y = 80;
        addReaction(emoji, x, y);
        socketRef.current.emit('send-reaction', { roomId, emoji, x, y });
        setShowReactionsMenu(false);
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        socketRef.current.emit('change-theme', { roomId, theme: newTheme });
        setShowSettings(false);
    };

    const getThemeStyles = () => {
        switch (theme) {
            case 'starry':
                return 'bg-[#0B0D17] text-white';
            case 'minimal':
                return 'bg-[#F9FAFB] text-gray-900';
            default: // romantic
                return 'bg-gradient-to-b from-midnight to-[#0f0c18] text-cream';
        }
    };

    const handleMemorySnap = async () => {
        // Create a canvas to draw the polaroid
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size (HD)
        canvas.width = 1200;
        canvas.height = 1500; // Taller for polaroid style

        // Draw White Polaroid Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Videos
        // We need to capture the video frames.
        // If side-by-side:
        if (!isCinemaMode) {
            if (myVideo.current && partnerVideo.current) {
                // Draw My Video (Left)
                ctx.drawImage(myVideo.current, 50, 50, 525, 700); // Half width minus padding
                // Draw Partner Video (Right)
                ctx.drawImage(partnerVideo.current, 625, 50, 525, 700);
            } else if (myVideo.current) {
                // Only me (waiting?)
                ctx.drawImage(myVideo.current, 50, 50, 1100, 825);
            }
        } else {
            // Cinema Mode
            // Draw Main Screen
            if (isScreenSharing) {
                if (myVideo.current) ctx.drawImage(myVideo.current, 50, 50, 1100, 618); // 16:9 aspect
            } else {
                if (partnerVideo.current) ctx.drawImage(partnerVideo.current, 50, 50, 1100, 618);
            }
            // Draw PiP? Maybe too complex. Just the main movie is fine.
        }

        // Draw Text
        ctx.fillStyle = '#1F1B2E'; // Midnight blue text
        ctx.font = 'bold 40px Quicksand';
        ctx.textAlign = 'center';

        const date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillText(date, canvas.width / 2, 1300);

        ctx.font = '30px Quicksand';
        ctx.fillStyle = '#E8A4A4'; // Rosegold
        ctx.fillText(`Time Spent Together: ${elapsedTime}`, canvas.width / 2, 1360);

        ctx.font = 'italic 24px Poppins';
        ctx.fillStyle = '#888';
        ctx.fillText("Couple Video Call + Movie Night", canvas.width / 2, 1420);

        // Download
        const link = document.createElement('a');
        link.download = `memory-snap-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div ref={containerRef} className={`min-h-screen transition-colors duration-1000 ${isCinemaMode ? 'bg-[#0F0C15]' : getThemeStyles()} flex flex-col items-center justify-center relative overflow-hidden p-4`}>

            {/* Starry Night Background */}
            {theme === 'starry' && !isCinemaMode && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-twinkle"
                            style={{
                                width: Math.random() * 3 + 'px',
                                height: Math.random() * 3 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Floating Reactions */}
            <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
                {reactions.map(r => (
                    <div
                        key={r.id}
                        className="absolute text-4xl animate-float-sway"
                        style={{ left: `${r.x}%`, bottom: '0' }}
                    >
                        {r.emoji}
                    </div>
                ))}
            </div>

            {/* Together Timer */}
            {!waiting && !partnerDisconnected && (
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 animate-fade-in">
                    <div className={`px-4 py-2 rounded-full backdrop-blur-md border shadow-lg ${theme === 'minimal' ? 'bg-white/80 border-gray-200 text-gray-800' : 'bg-white/10 border-white/20 text-white'}`}>
                        <span className="font-cute font-bold tracking-widest text-sm md:text-base">
                            Together: {elapsedTime}
                        </span>
                    </div>
                </div>
            )}

            {/* Connected Toast */}
            {!waiting && !isCinemaMode && !partnerDisconnected && (
                <div className="absolute top-8 z-50 animate-fade-in-down">
                    <div className="bg-rosegold/20 backdrop-blur-md border border-rosegold/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(232,164,164,0.3)] flex items-center gap-2">
                        <span className="text-xl">❤️</span>
                        <span className="font-cute text-rosegold font-bold tracking-wide">Together at last</span>
                    </div>
                </div>
            )}

            {/* Miss You / Disconnected Screen */}
            {partnerDisconnected && (
                <div className="absolute inset-0 z-[60] bg-midnight/90 backdrop-blur-lg flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                    <div className="text-6xl mb-6 animate-bounce">🥺</div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                        Waiting for them to come back...
                    </h2>
                    <p className="text-lavender text-lg font-cute mb-8">
                        The connection was lost. Don't worry, they'll be back soon!
                    </p>
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
                        <div className="w-3 h-3 bg-rosegold rounded-full animate-ping"></div>
                        <span className="text-white/80 font-medium">Reconnecting...</span>
                    </div>
                </div>
            )}

            {/* Cinema Mode Glow */}
            {isCinemaMode && (
                <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            )}

            <div className={`flex w-full h-full transition-all duration-1000 ${isCinemaMode ? 'flex-col items-center justify-center' : 'flex-col md:flex-row max-w-6xl gap-6 items-center justify-center flex-1'}`}>
                {isCinemaMode ? (
                    <>
                        {/* MAIN SCREEN (The Movie) */}
                        <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center z-10">
                            <div className="relative w-full h-full max-w-[95%] md:max-w-[90%] max-h-[70vh] md:max-h-[85vh] aspect-video bg-black rounded-xl md:rounded-2xl shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden border border-white/10">
                                <video
                                    playsInline
                                    ref={cinemaMainVideo}
                                    autoPlay
                                    muted={isScreenSharing}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* PiP Container */}
                        <div className="fixed bottom-20 md:bottom-24 right-4 md:right-8 flex gap-4 z-50">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-lavender/50 overflow-hidden shadow-lg bg-black relative">
                                <video
                                    playsInline
                                    ref={cinemaPipVideo}
                                    autoPlay
                                    muted={!isScreenSharing}
                                    className={`w-full h-full object-cover ${!isScreenSharing ? 'scale-x-[-1]' : ''}`}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    /* NORMAL LAYOUT */
                    <>
                        {/* My Video */}
                        <div className={`relative transition-all duration-500 ${waiting ? 'w-full md:w-2/3 aspect-video' : 'w-full md:w-1/2 aspect-[3/4] md:aspect-[4/3]'}`}>
                            <div className="absolute inset-0 bg-lavender/10 rounded-[20px] md:rounded-[30px] blur-xl transform scale-105"></div>
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                className="relative w-full h-full object-cover rounded-[20px] md:rounded-[30px] border-2 border-lavender/30 shadow-2xl z-10 bg-midnight/50 scale-x-[-1]"
                            />
                            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-20 bg-black/40 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1 rounded-full border border-white/10">
                                <span className="text-xs font-medium text-white/80">You</span>
                            </div>
                        </div>

                        {/* Partner Video */}
                        {!waiting && (
                            <div className="relative w-full md:w-1/2 aspect-[3/4] md:aspect-[4/3] animate-fade-in">
                                <div className="absolute inset-0 bg-rosegold/10 rounded-[20px] md:rounded-[30px] blur-xl transform scale-105"></div>
                                <video
                                    playsInline
                                    ref={partnerVideo}
                                    autoPlay
                                    className="relative w-full h-full object-cover rounded-[20px] md:rounded-[30px] border-2 border-rosegold/30 shadow-2xl z-10 bg-midnight/50"
                                />
                                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-20 bg-black/40 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1 rounded-full border border-white/10">
                                    <span className="text-xs font-medium text-white/80">Partner</span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Waiting State */}
                {waiting && !partnerDisconnected && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="text-center animate-fade-in bg-midnight/60 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl pointer-events-auto">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 bg-rosegold/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 bg-rosegold/40 rounded-full animate-pulse"></div>
                                <div className="relative bg-gradient-to-tr from-rosegold to-peach w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(232,164,164,0.5)]">
                                    <span className="text-4xl animate-heartbeat">💖</span>
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-2 tracking-wide text-white">
                                Waiting for your person...
                            </h2>
                            <p className="text-lavender/80 font-cute text-lg mb-6">
                                Share code: <span className="font-bold text-rosegold tracking-widest bg-white/10 px-2 py-1 rounded-lg select-all cursor-pointer">{roomId}</span>
                            </p>

                            {/* Manual Connect Button (Fallback) */}
                            <button
                                onClick={() => {
                                    const partnerId = prompt("Enter partner's Socket ID (check console) or just click OK to retry if you know they are here:");
                                    if (partnerId) callUser(partnerId, stream);
                                    else if (partnerIdRef.current) callUser(partnerIdRef.current, stream);
                                    else alert("No partner detected yet. Wait for them to join!");
                                }}
                                className="text-xs text-white/50 hover:text-white underline"
                            >
                                Stuck? Click to Retry Connection
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div className={`fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isUiHidden ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'} max-w-[95vw]`}>
                <div className={`flex items-center gap-2 md:gap-4 backdrop-blur-lg border px-3 md:px-6 py-2 md:py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${theme === 'minimal' ? 'bg-white/80 border-gray-200' : 'bg-white/10 border-white/20'}`}>

                    <button
                        onClick={toggleMute}
                        className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-500/80 text-white hover:bg-red-600' : (theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')} hover:scale-110`}
                    >
                        {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${isVideoOff ? 'bg-red-500/80 text-white hover:bg-red-600' : (theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')} hover:scale-110`}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>

                    <button
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                        className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${isScreenSharing ? 'bg-peach text-midnight hover:bg-peach/80' : (theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')} hover:scale-110`}
                        title="Watch Movie"
                    >
                        <Projector className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Reactions Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
                            className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${showReactionsMenu ? 'bg-rosegold text-white' : (theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')} hover:scale-110`}
                            title="React"
                        >
                            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${showReactionsMenu ? 'fill-current' : ''}`} />
                        </button>

                        {/* Reactions Menu */}
                        {showReactionsMenu && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 flex flex-col gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 animate-fade-in-up">
                                {['❤️', '😂', '🥺', '🔥'].map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => sendReaction(emoji)}
                                        className="p-2 text-2xl hover:scale-125 transition-transform"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Memory Snap Button */}
                    <button
                        onClick={handleMemorySnap}
                        className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'} hover:scale-110 hidden md:flex`}
                        title="Memory Snap"
                    >
                        <Camera className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Settings Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${showSettings ? 'bg-lavender text-midnight' : (theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')} hover:scale-110 hidden md:flex`}
                            title="Settings"
                        >
                            <Settings className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Settings Menu (Theme Picker) */}
                        {showSettings && (
                            <div className={`absolute bottom-full right-0 mb-4 w-48 rounded-2xl backdrop-blur-xl border p-4 shadow-2xl animate-fade-in-up ${theme === 'minimal' ? 'bg-white/90 border-gray-200 text-gray-800' : 'bg-midnight/90 border-white/10 text-white'}`}>
                                <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">Theme</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => changeTheme('romantic')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${theme === 'romantic' ? 'bg-rosegold/20 text-rosegold font-bold' : 'hover:bg-white/5'}`}
                                    >
                                        🌹 Romantic
                                    </button>
                                    <button
                                        onClick={() => changeTheme('starry')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${theme === 'starry' ? 'bg-lavender/20 text-lavender font-bold' : 'hover:bg-white/5'}`}
                                    >
                                        ✨ Starry Night
                                    </button>
                                    <button
                                        onClick={() => changeTheme('minimal')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${theme === 'minimal' ? 'bg-gray-200 text-gray-900 font-bold' : 'hover:bg-white/5'}`}
                                    >
                                        ☁️ Minimal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={endCall}
                        className="p-2.5 md:p-4 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-lg shadow-red-500/30"
                    >
                        <Phone className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                    </button>

                    <button
                        onClick={toggleUi}
                        className={`p-2.5 md:p-4 rounded-full transition-all duration-300 ${theme === 'minimal' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'} hover:scale-110 hidden md:flex`}
                        title="Hide UI"
                    >
                        <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>

            {/* Show UI Button (when hidden) */}
            {isUiHidden && (
                <button
                    onClick={toggleUi}
                    className={`fixed bottom-8 right-8 z-50 p-3 rounded-full backdrop-blur-md border transition-all ${theme === 'minimal' ? 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                >
                    <Eye size={24} />
                </button>
            )}

        </div>
    );
};

export default Room;
