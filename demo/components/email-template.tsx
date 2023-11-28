import React from 'react';

interface EmailTemplateProps {
  totalPayments: number;
  numberOfClients: number;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  totalPayments,
  numberOfClients,
}) => {
  const formattedTotalPayments = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
  }).format(totalPayments);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Joshmal Hotels Sales Report</h1>
      <p style={reportStyle}>Yesterday's Report:</p>
      <p style={figureStyle}>{`Sales: ${formattedTotalPayments}`}</p>
      <p style={figureStyle}>{`Clients: ${numberOfClients}`}</p>
      <button style={buttonStyle} onClick={() => window.location.href = 'https://joshmal.jasmai.design/pages/products'}>
        More Info
      </button>
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
  color: '#4285f4',
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
  color: '#1a73e8',
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
};

export default EmailTemplate;
