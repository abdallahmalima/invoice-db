import React from 'react';
import { formatNumberWithCommas } from '../lib/currency';

interface EmailTemplateProps {
  totalPayments: number;
  numberOfClients: number;
}

const EmailTemplateLowPrice = ({payment,payment_less,room_no,user,user_phone}) => {

 

  const emailContent =
  <div>
    Test Email From the system
    <p style={reportStyle}>
    ❌ Danger: Room Number <span style={figureStyle}>{room_no}</span>, was sold by <span style={figureStyle}>{user}(<span tel={user_phone}>{user_phone}</span>)</span> with a lower price <span style={figureStyle}>{formatNumberWithCommas(payment)}{"/="}</span> than its minimum price which is <span style={figureStyle}>{formatNumberWithCommas(payment_less)}{"/="}</span>
    </p>
    <p style={reportStyle}>
      Please follow up on this to make sure everything is okay.
    </p>
    <p style={reportStyle}>
      Stay vigilant 👀😠⚠️
    </p>
  </div>
  ;

    
  return (
    <div style={containerStyle}>
       {emailContent}
      <a style={buttonStyle} href="https://joshmal.jasmai.design/pages/products">
        More Info
      </a>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: 'auto',
};

const titleStyle: React.CSSProperties = {
  color: '#34a853',
  fontSize: '24px',
  margin: '10px 0',
};

const reportStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1a73e8',
  margin: '10px 0',
};

const figureStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#FF5252',
  margin: '10px 0',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#34a853',
  color: '#ffffff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '10px 0',
};

export default  EmailTemplateLowPrice;
