import React from 'react';
import { motion } from 'framer-motion';
import './FreeTrial.css';

const FreeTrial = () => {
    // Generate a list of poster URLs for the background grid
    const posters = [
        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1456920248246-ff98b1e7c967?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505634467193-e3c748baf832?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542204113-e9352628043b?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=300&auto=format&fit=crop'
    ];

    return (
        <section className="free-trial-section">
            <div className="poster-grid-bg">
                {/* Double the posters for a fuller grid */}
                {[...posters, ...posters, ...posters].map((url, i) => (
                    <div key={i} className="bg-poster">
                        <img src={url} alt="Poster" />
                    </div>
                ))}
            </div>
            <div className="free-trial-overlay"></div>

            <div className="container free-trial-content">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="cta-card text-center"
                >
                    <h2 className="cta-title">Start Your Free Trial Today</h2>
                    <button className="btn btn-subscribe">Subscribe Now</button>
                </motion.div>
            </div>
        </section>
    );
};

export default FreeTrial;
