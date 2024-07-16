import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import companyLogo from '../assets/images/logo.svg';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const toggleMenuHandler = () => {
    setToggleMenu(!toggleMenu);
  };

  const closeMenuHandler = () => {
    setToggleMenu(false);
  };

  return (
    <nav className='relative container mx-auto p-6'>
      <div className='flex items-center justify-between'>
        <div className='pt-1'>
          <img src={companyLogo} className='h-20' alt='' />
        </div>
        {/* Menu Items - only display on larger screens */}
        <div className='hidden md:flex space-x-6'>
          <ScrollLink to='testimonials' smooth={true} duration={500} className='hover:text-brightRed' onClick={closeMenuHandler}>
            Features
          </ScrollLink>
          <ScrollLink to='features' smooth={true} duration={500} className='hover:text-brightRed' onClick={closeMenuHandler}>
            WhyUs?
          </ScrollLink>
          <ScrollLink to='services' smooth={true} duration={500} className='hover:text-brightRed' onClick={closeMenuHandler}>
            Services
          </ScrollLink>
          <ScrollLink to='contact-us' smooth={true} duration={500} className='hover:text-brightRed' onClick={closeMenuHandler}>
            Contact
          </ScrollLink>
        </div>
        {/* Button */}
        <button
          className={`block hamburger focus:outline-none md:hidden ${toggleMenu ? 'open' : ''}`}
          onClick={toggleMenuHandler}
        >
          <span className='hamburger-top'></span>
          <span className='hamburger-middle'></span>
          <span className='hamburger-bottom'></span>
        </button>
        {/* Login/Signup Button */}
        <Link
          to='/login'
          className='hidden p-3 px-6 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight md:block'
        >
          Login / Signup
        </Link>
      </div>

      {/* Mobile Menu */}
      {toggleMenu && (
        <div className='absolute flex flex-col items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md md:hidden'>
          <ScrollLink to='testimonials' smooth={true} duration={500} onClick={closeMenuHandler}>Features</ScrollLink>
          <ScrollLink to='features' smooth={true} duration={500} onClick={closeMenuHandler}>WhyUs?</ScrollLink>
          <ScrollLink to='services' smooth={true} duration={500} onClick={closeMenuHandler}>Services</ScrollLink>
          <ScrollLink to='contact-us' smooth={true} duration={500} onClick={closeMenuHandler}>Contact</ScrollLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;