// import { BrowserRouter } from 'react-router-dom';

import Navbar from '../Components/Navbar.jsx';
import Hero from '../Components/Hero';
import Features from '../Components/Features.jsx';
import Testimonial from '../Components/Testimonial';
import CallToAction from '../Components/CallToAction';
import Footer from '../Components/Footer';
import Front from '../Components/Front.jsx';
import Services from '../Components/Services.jsx';
import AboutUs from '../Components/AboutUs.jsx';
import WhatsappWidget from '../Components/WhatsappWidget.jsx';
import ClientLogos from '../Components/Clients.jsx';
import CallWidget from '../Components/CallWidget.jsx'
 
function Homepage() {
  return (
    // <BrowserRouter>
    <div>
        <WhatsappWidget/>
        <CallWidget/>
        <Navbar />
        <Hero />
        <Testimonial />
        <Features />
        <Front/>
        <Services />
        <AboutUs/>
        <ClientLogos/>
        <CallToAction />
        <Footer />
    </div>
    // </BrowserRouter>
  );
}

export default Homepage;
