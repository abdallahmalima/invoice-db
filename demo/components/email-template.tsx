import React from 'react';

interface EmailTemplateProps {
  totalPayments: number;
  numberOfClients: number;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({roomsData, totalPayments, numberOfClients,whenDay }) => {
  const formattedTotalPayments = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
  }).format(totalPayments);

  const {
    used_room,
    used_room_count,
    not_used_room,
    not_used_room_count,
  }=roomsData
  


  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Joshmal Hotels Revenue Report</h1>
      <p style={reportStyle}>{whenDay}'s Report:</p>
      <p style={figureStyle}>Revenue:{"  "}<span style={{color: '#FF5252',}}>{`${formattedTotalPayments}/=`}</span></p>
      <p style={figureStyle}>Clients:{"  "}<span style={{color: '#FF5252',}}>{`${numberOfClients}`}</span></p>
      <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
      <p style={figureStyle}>Room Used:{"  "}<span style={{color: '#FF5252',}}>{`${used_room_count} `}Rooms</span></p>
      <p style={figureStyle}>Room Not Used:{"  "}<span style={{color: '#FF5252',}}>{`${not_used_room_count} `}Rooms</span></p>
      <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
      <p style={figureStyle}>List of Room Used:{"  "}<span style={{color: '#FF5252',}}>{`${used_room} `}</span></p>
      <p style={figureStyle}>List of Room Not Used:{"  "}<span style={{color: '#FF5252',}}>{`${not_used_room} `}</span></p>
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
  textAlign: 'left',
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

export default EmailTemplate;
