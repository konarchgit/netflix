import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import './VideoModal.css';

const VideoModal = ({ videoUrl, onClose, title }) => {
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
                    <h3>{title}</h3>
                    <button className="close-btn glass" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="video-wrapper">
                    <iframe
                        className="youtube-player"
                        src={videoUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default VideoModal;
