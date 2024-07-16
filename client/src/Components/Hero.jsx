import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import illustrationIntro from '../assets/images/illustration-intro.svg';

const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Unlocking Success Through Expert Accounting, Tax, and Advisory Solutions.",
    "Empowering Your Business with Proactive Financial Management.",
    "Guiding Your Growth with Tailored Accounting and Tax Strategies."
  ];
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let currentText = texts[textIndex];
    let interval = setInterval(() => {
      if (currentIndex === currentText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 2000); // Wait 2 seconds before switching to the next text
      } else {
        setDisplayedText(currentText.substring(0, currentIndex + 1));
        currentIndex++;
      }
    }, 40); // Typing speed: 100 milliseconds
    return () => clearInterval(interval);
  }, [textIndex]);

  const handleGetStartedClick = () => {
    // Redirect to WhatsApp with the specified phone number and message
    window.open('https://wa.me/+918801103053?text=Hello SSTax Mentors!', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "linear" }}
    >
      <section id='hero'>
        <div className='container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row'>
          <div className='flex flex-col mb-32 space-y-12 md:w-1/2'>
            <h1 className='max-w-md text-4xl font-bold text-center md:text-5xl md:text-left uppercase' style={{ lineHeight: '1.1' }}>
              Empower Your Financial Journey with<br></br> <span className='text-brightRed'>SS Tax Mentors</span>
            </h1>
            <div className="max-w-md h-16 overflow-hidden">
              <p className='text-1xl text-center uppercase text-darkGrayishBlue md:text-left'>
                {displayedText}
              </p>
            </div>
            <div className='flex justify-center md:justify-start'>
            <button
                onClick={handleGetStartedClick} // Call handleGetStartedClick function on button click
                className='p-3 px-6 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight'
              >
                Get Started
              </button>
              <Link
                to='/login'
                className='p-3 px-6 ml-5 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight'
              >
                Login / Signup
              </Link>
              
            </div>
          </div>
          <div className='md:w-1/2'>
            <img src={illustrationIntro} alt='' />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Hero;
