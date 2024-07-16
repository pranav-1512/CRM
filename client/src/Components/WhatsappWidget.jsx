import React from 'react';
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css'; // Import WhatsApp widget styles

const WhatsappWidget = () => {
  return (
    <div style={{ position: 'relative', zIndex: 9999 }}>
      {/* Your app content */}
      <WhatsAppWidget 
        phoneNumber="+918801103053"
        message="Welcome to SS Tax Mentors! How can we help you?"
        position="right"
        size="large" // Set size to large
        className="custom-whatsapp-widget" // Add custom class name
        style={{
          '.whatsapp-widget-container': {
            backgroundColor: '#25d366', // WhatsApp green color
            color: '#ffffff', // Icon color set to white
            fontSize: '20px',
          },
        }}
      />
    </div>
  );
}

export default WhatsappWidget;
