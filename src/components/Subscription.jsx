import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Subscription.jsx'; // This is a mistake, should be .css
import './Subscription.css';

const Subscription = () => {
    return (
        <section className="subscription-section section-padding">
            <div className="container">
                <div className="subscription-grid">
                    {/* Left Visual Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="subscription-visual"
                    >
                        <div className="tv-mockup">
                            <img
                                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop"
                                alt="TV Content"
                                className="tv-screen"
                            />
                            <div className="device-overlays">
                                <img
                                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop"
                                    alt="Phone Mockup"
                                    className="phone-overlay"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1600080972464-8e5f358022e7?q=80&w=300&auto=format&fit=crop"
                                    alt="Controller"
                                    className="controller-overlay"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="subscription-content"
                    >
                        <h2 className="sub-title">Enjoy The All Movies, TV Shows & More</h2>
                        <p className="sub-description">
                            With our large and comprehensive collection of TV channels, never miss
                            your favorite sports games and TV shows.
                        </p>

                        <h3 className="offer-highlight">
                            Subscribe Torin TV Box & Get <span className="underline">Free Wi-Fi For 1 Month</span>
                        </h3>

                        <div className="pricing-cards">
                            <div className="price-card primary-card">
                                <span className="card-label">STARTING FROM</span>
                                <div className="price-value">
                                    <span className="currency">$</span>
                                    <span className="amount">49.99</span>
                                    <span className="period">/Mo</span>
                                </div>
                            </div>

                            <div className="price-card secondary-card">
                                <span className="card-label">Torin prepaid internet</span>
                                <h4>Only pay for the internet you need</h4>
                                <a href="#" className="learn-more">Learn More <ArrowRight size={16} /></a>
                            </div>
                        </div>

                        <button className="btn btn-pricing">View All Pricing Plan</button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Subscription;
