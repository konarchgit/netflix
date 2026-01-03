import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="footer-grid-bg"></div>
            <div className="container footer-container">
                <div className="footer-main-grid">
                    {/* Left Branding Column */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">N</span>
                            <span className="logo-text">TORIN</span>
                        </div>
                        <p className="footer-brand-desc">
                            Helping our communities connect, work, & thrive since 1952
                        </p>
                        <div className="footer-social">
                            <h3>Social Media</h3>
                            <div className="social-links">
                                <a href="#"><Facebook size={18} /></a>
                                <a href="#" className="x-icon">𝕏</a>
                                <a href="#"><Instagram size={18} /></a>
                                <a href="#"><Linkedin size={18} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer-links-col">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#">Internet</a></li>
                            <li><a href="#">TV</a></li>
                            <li><a href="#">Phone</a></li>
                            <li><a href="#">Managed Wireless</a></li>
                            <li><a href="#">PAC's</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Policies</a></li>
                            <li><a href="#">Shop</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h3>Information</h3>
                        <ul>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Directory</a></li>
                            <li><a href="#">Resources</a></li>
                            <li><a href="#">Location In Map</a></li>
                            <li><a href="#">Pay My Bill</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-contact-col">
                        <h3>Get In Touch</h3>
                        <div className="contact-item">
                            <span className="phone-number">+1 (800) 216 20 20</span>
                            <span className="phone-label">(for customer service and support)</span>
                        </div>
                        <div className="contact-item">
                            <span className="phone-number">+1 (800) 216 20 21</span>
                            <span className="phone-label">(for new customers)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="footer-bottom">
                <div className="container">
                    <p>© Torin is Proudly Owned by <span>HiboTheme</span></p>
                </div>
                <div className="bottom-red-bar"></div>
            </div>
        </footer>
    );
};

export default Footer;
