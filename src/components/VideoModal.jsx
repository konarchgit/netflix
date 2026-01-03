import React, { useState, useEffect } from 'react';
import { X, Server, Cast } from 'lucide-react';
import { motion } from 'framer-motion';
import './VideoModal.css';

const SERVERS = [
    { name: 'Server 1 (VidSrc)', id: 'vidsrc' },
    { name: 'Server 2 (Pro)', id: 'vidsrcpro' },
    { name: 'Server 3 (Super)', id: 'superembed' },
    { name: 'Server 4 (Multi)', id: 'multiembed' },
];

const VideoModal = ({ playerState, onClose }) => {
    const [currentServer, setCurrentServer] = useState(SERVERS[0].id);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!playerState) return;

        if (playerState.mode === 'trailer') {
            setUrl(playerState.url);
            return;
        }

        // Full Video URL generation based on server
        const { id, type, season, episode } = playerState;

        let newUrl = '';
        switch (currentServer) {
            case 'vidsrc':
                newUrl = type === 'movie'
                    ? `https://vidsrc.cc/v2/embed/movie/${id}`
                    : `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
                break;
            case 'vidsrcpro':
                newUrl = type === 'movie'
                    ? `https://vidsrc.pro/embed/movie/${id}`
                    : `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
                break;
            case 'superembed': // Using VidLink/SuperEmbed style
                newUrl = type === 'movie'
                    ? `https://vidlink.pro/movie/${id}`
                    : `https://vidlink.pro/tv/${id}/${season}/${episode}`;
                break;
            case 'multiembed':
                newUrl = type === 'movie'
                    ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
                    : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
                break;
            default:
                newUrl = `https://vidsrc.cc/v2/embed/movie/${id}`;
        }
        setUrl(newUrl);

    }, [playerState, currentServer]);

    if (!playerState) return null;

    return (
        <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="video-modal-container"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="header-left">
                        <h3>{playerState.title}</h3>
                        {playerState.mode === 'full' && (
                            <div className="server-container">
                                <Server size={16} className="server-icon" />
                                <select
                                    className="server-select"
                                    value={currentServer}
                                    onChange={(e) => setCurrentServer(e.target.value)}
                                >
                                    {SERVERS.map(server => (
                                        <option key={server.id} value={server.id}>{server.name}</option>
                                    ))}
                                </select>
                                <span className="server-hint">Try switching servers for Audio/Subs</span>
                            </div>
                        )}
                    </div>
                    <button className="close-btn glass" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="video-wrapper">
                    <iframe
                        className="youtube-player"
                        src={url}
                        title={playerState.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default VideoModal;
