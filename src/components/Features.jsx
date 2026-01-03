import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const Features = () => {
    const avatars = [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    ];

    return (
        <section className="features-section section-padding">
            <div className="container">
                <h2 className="section-title text-center main-feature-title">
                    What Made Torin Extraordinary
                </h2>

                <div className="features-grid">
                    {/* Feature 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="feature-card"
                    >
                        <div className="card-visual visual-accounts">
                            <div className="avatar-group">
                                {avatars.map((url, i) => (
                                    <div key={i} className={`avatar-bubble bubble-${i + 1}`}>
                                        <img src={url} alt="User" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>Upto 6 Individual Accounts</h3>
                            <p>With personalized recommendations.</p>
                        </div>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="feature-card"
                    >
                        <div className="card-visual visual-dvr">
                            <img
                                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=500&auto=format&fit=crop"
                                alt="DVR Grid"
                                className="dvr-img"
                            />
                        </div>
                        <div className="card-info">
                            <h3>Unlimited DVR Space For All</h3>
                            <p>Everyone gets their own login.</p>
                        </div>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="feature-card"
                    >
                        <div className="card-visual visual-streams">
                            <img
                                src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=500&auto=format&fit=crop"
                                alt="Simultaneous Streams"
                                className="streams-img"
                            />
                        </div>
                        <div className="card-info">
                            <h3>4 Simultaneous Streams</h3>
                            <p>Watch on your favourite device.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Features;
