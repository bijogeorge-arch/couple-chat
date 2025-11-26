import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatSidebar = ({ socket, roomId, userId, partnerName = 'Partner' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [partnerTyping, setPartnerTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const autoHideTimeoutRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (data) => {
            const newMessage = {
                id: Date.now(),
                text: data.message,
                sender: data.sender,
                timestamp: data.timestamp,
                isOwn: data.sender === userId
            };

            setMessages(prev => [...prev, newMessage]);

            // Increment unread count if chat is closed
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
        });

        socket.on('typing-start', (data) => {
            if (data.userId !== userId) {
                setPartnerTyping(true);
            }
        });

        socket.on('typing-stop', (data) => {
            if (data.userId !== userId) {
                setPartnerTyping(false);
            }
        });

        return () => {
            socket.off('receive-message');
            socket.off('typing-start');
            socket.off('typing-stop');
        };
    }, [socket, userId, isOpen]);

    // Auto-hide after 3 seconds of inactivity
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            clearTimeout(autoHideTimeoutRef.current);
            autoHideTimeoutRef.current = setTimeout(() => {
                // Don't auto-hide if user is typing
                if (!inputMessage) {
                    setIsOpen(false);
                }
            }, 3000);
        }

        return () => clearTimeout(autoHideTimeoutRef.current);
    }, [messages, isOpen, inputMessage]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket) return;

        const message = {
            roomId,
            message: inputMessage,
            sender: userId,
            timestamp: new Date().toISOString()
        };

        // Add to local messages
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: inputMessage,
            sender: userId,
            timestamp: message.timestamp,
            isOwn: true
        }]);

        // Send via socket
        socket.emit('send-message', message);

        // Clear input
        setInputMessage('');
        setShowEmojiPicker(false);

        // Stop typing indicator
        handleStopTyping();
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);

        // Typing indicator
        if (!isTyping) {
            setIsTyping(true);
            socket?.emit('typing-start', { roomId, userId });
        }

        // Clear previous timeout
        clearTimeout(typingTimeoutRef.current);

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            handleStopTyping();
        }, 1000);
    };

    const handleStopTyping = () => {
        setIsTyping(false);
        socket?.emit('typing-stop', { roomId, userId });
    };

    const handleEmojiClick = (emojiData) => {
        setInputMessage(prev => prev + emojiData.emoji);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={toggleChat}
                className="fixed right-6 bottom-24 z-40 p-4 bg-gradient-to-br from-blush to-lavender rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                title="Toggle Chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6 text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Chat Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-full md:w-96 bg-midnight/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blush/20 to-lavender/20">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-blush" />
                        <div>
                            <h3 className="font-heading font-semibold text-white">Chat</h3>
                            <p className="text-xs text-gray-400">with {partnerName}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100vh-180px)] custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <MessageCircle className="w-16 h-16 text-white/10 mb-4" />
                            <p className="text-gray-400 text-sm">No messages yet</p>
                            <p className="text-gray-500 text-xs mt-2">Send a message to start chatting!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.isOwn
                                            ? 'bg-gradient-to-br from-blush to-lavender text-white rounded-br-sm'
                                            : 'bg-white/10 text-white rounded-bl-sm'
                                        }`}
                                >
                                    <p className="text-sm break-words">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Typing Indicator */}
                    {partnerTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-midnight/95 border-t border-white/10">
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-full left-4 mb-2 z-50">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme="dark"
                                width={300}
                                height={400}
                            />
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        {/* Emoji Button */}
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors mb-1"
                            title="Add Emoji"
                        >
                            <Smile className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Input Field */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blush/50 transition-colors resize-none custom-scrollbar"
                                rows={1}
                                style={{ maxHeight: '100px' }}
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="p-3 bg-gradient-to-br from-blush to-lavender rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-1 hover:scale-110"
                            title="Send Message"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(248, 215, 227, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(248, 215, 227, 0.5);
                }
            `}</style>
        </>
    );
};

export default ChatSidebar;
