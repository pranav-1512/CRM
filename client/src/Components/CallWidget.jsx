import React, { useState } from 'react';

const CallWidget = () => {
  const phoneNumber = "+918801103053"; // Specify the phone number
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '93px', 
        right: '25px', 
        zIndex: 9999
      }}
    >
      {isHovered && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '-75px', 
            right: '10px', 
            backgroundColor: 'hsl(227, 96%, 47%)', 
            color: '#fff', 
            borderRadius: '30px', 
            padding: '10px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', 
            minWidth: '220px', 
            textAlign: 'center', 
            zIndex: '1000'
          }}
        >
          Maximize Your Finances Call Now! 📞
        </div>
      )}
      <a
        href={`tel:${phoneNumber}`}
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          color: 'green',
          borderRadius: '50%',
          backgroundColor: isHovered ? 'hsl(227, 100%, 73%)' : '#ffffff',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          fontSize: '20px',
          lineHeight: '1',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        📞
      </a>
    </div>
  );
}

export default CallWidget;


