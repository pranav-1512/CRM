import { Link } from 'react-router-dom';

const handleGetStartedClick = () => {
  // Redirect to WhatsApp with the specified phone number and message
  window.open('https://wa.me/+918801103053?text=Hello SSTax Mentors!', '_blank');

};

const CallToAction = () => {
  return (
    <section id='cta' className='bg-brightRed'>
      {/* Flex Container */}
      <div className='container flex flex-col items-center justify-between px-6 py-24 mx-auto space-y-12 md:py-12 md:flex-row md:space-y-0'>
        {/* Heading */}
        <h2 className='text-5xl font-bold leading-tight text-center text-white md:text-4xl md:max-w-xl md:text-left'>
        Ready to Unlock Financial Success with SS Tax Mentors?
        </h2>
        {/* Button */}
        <div>
          <button
            onClick={handleGetStartedClick} // Call handleGetStartedClick function on button click
            className='p-3 px-6 ml-5 mb-5 text-brightRed bg-white rounded-full shadow-2xl baseline hover:bg-gray-900 hover:text-white'
          >
            Get Started
          </button>
          <Link
            to='/login'
            className='p-3 px-6 ml-5  text-brightRed bg-white rounded-full shadow-2xl baseline hover:bg-gray-900 hover:text-white'
             // Add margin-top style
          >
            Login / Signup
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
