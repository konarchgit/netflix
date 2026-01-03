import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const faqData = [
        {
            question: "Devices that you Support?",
            answer: "No need 'Tech Savvy'. You just download the app on your TV and you could tell what to do."
        },
        {
            question: "How do I get started with Torin TV?",
            answer: "Getting started is easy! Just sign up for an account, choose your plan, and start streaming immediately on any supported device."
        },
        {
            question: "How I get technical support from Torin?",
            answer: "Our support team is available 24/7. You can reach us via live chat on our website or by sending an email to our help desk."
        },
        {
            question: "Which devices can I watch Torin TV on?",
            answer: "You can watch Torin TV on smart TVs, gaming consoles, streaming devices like Roku or Firestick, and all major mobile devices."
        },
        {
            question: "How long before I can use the service?",
            answer: "Your account is activated instantly after subscription. You can start watching your favorite shows within seconds."
        },
        {
            question: "Can I watch Torin TV while traveling?",
            answer: "Yes! You can stream your favorite content anywhere in the world as long as you have a stable internet connection."
        },
        {
            question: "What's about Refund Policy?",
            answer: "We offer a 7-day money-back guarantee if you're not satisfied with our service. No questions asked."
        },
        {
            question: "Are there really no DVR storage space limits?",
            answer: "That's right! Everyone gets unlimited cloud DVR storage, so you can record and save as many shows as you want."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section section-padding">
            <div className="container">
                <div className="faq-header text-center">
                    <h2 className="faq-title">Questions? We Are Here To Help</h2>
                    <p className="faq-subtitle">The reviews are in and we're as obsessed with your internet as you are.</p>
                </div>

                <div className="faq-grid">
                    {/* Column 1 */}
                    <div className="faq-column">
                        {faqData.filter((_, i) => i % 2 === 0).map((item, i) => {
                            const actualIndex = i * 2;
                            return (
                                <div key={actualIndex} className={`faq-item ${activeIndex === actualIndex ? 'active' : ''}`}>
                                    <div className="faq-question" onClick={() => toggleAccordion(actualIndex)}>
                                        <h3>{item.question}</h3>
                                        <div className="faq-icon">
                                            {activeIndex === actualIndex ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {activeIndex === actualIndex && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="faq-answer"
                                            >
                                                <p>{item.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Column 2 */}
                    <div className="faq-column">
                        {faqData.filter((_, i) => i % 2 !== 0).map((item, i) => {
                            const actualIndex = i * 2 + 1;
                            return (
                                <div key={actualIndex} className={`faq-item ${activeIndex === actualIndex ? 'active' : ''}`}>
                                    <div className="faq-question" onClick={() => toggleAccordion(actualIndex)}>
                                        <h3>{item.question}</h3>
                                        <div className="faq-icon">
                                            {activeIndex === actualIndex ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {activeIndex === actualIndex && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="faq-answer"
                                            >
                                                <p>{item.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
