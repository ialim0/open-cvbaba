import React from 'react';

interface FLHarvardTemplate3Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLHarvardTemplate3: React.FC<FLHarvardTemplate3Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // For compact mode, use fixed small sizes
  const baseFontSize = compact ? 8 : 14;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.8,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: `${basePadding * scale}px`,
    maxWidth: `${(compact ? 400 : 800) * scale}px`,
    margin: '0 auto',
  };

  const headerStyles = {
    textAlign: 'center' as const,
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 18) * scale}px`,
    fontWeight: 'bold',
    margin: 0,
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
  };

  const contactStyles = {
    fontSize: `${(compact ? 6 : 14) * scale}px`,
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const contentStyles = {
    marginTop: `${(compact ? 4 : 20) * scale}px`,
  };

  const paragraphStyles = {
    margin: `${(compact ? 2 : 10) * scale}px 0`,
  };

  const signatureStyles = {
    marginTop: `${(compact ? 8 : 50) * scale}px`,
    textAlign: 'right' as const,
  };

  const footerStyles = {
    textAlign: 'center' as const,
    marginTop: `${(compact ? 4 : 20) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-serif ${className}`}
        style={scaledStyles}
      >
        {/* Header */}
        <div style={headerStyles}>
          <h2 style={nameStyles}>Alice Johnson</h2>
          <p style={contactStyles}>789 Elm St, Anytown, USA</p>
          <p style={contactStyles}>alice.johnson@example.com | (987) 654-3210</p>
        </div>

        {/* Content */}
        <div style={contentStyles}>
          <p style={paragraphStyles}>October 1, 2023</p>
          <p style={paragraphStyles}>Robert Brown</p>
          <p style={paragraphStyles}>101 Corporate Blvd, Anytown, USA</p>
          <p style={paragraphStyles}>Dear Brown,</p>
          <p style={paragraphStyles}>
            I am excited to apply for the Marketing Specialist position at Creative Solutions LLC. With my extensive experience in marketing and communications, I am eager to bring my skills and passion to your esteemed organization.
          </p>
          <p style={paragraphStyles}>
            During my tenure at Ad Masters Inc., I successfully managed marketing campaigns that increased sales by 20%. This experience has honed my abilities in strategic planning, content creation, and social media management.
          </p>
          <p style={paragraphStyles}>
            What excites me about this opportunity is the chance to work on diverse and impactful projects. I am confident that my background and enthusiasm make me a strong fit for Creative Solutions LLC.
          </p>
          <p style={paragraphStyles}>
            Thank you for considering my application. I look forward to the opportunity to further discuss how my background and skills would make me a strong fit for your team.
          </p>
          <p style={paragraphStyles}>Sincerely,</p>
        </div>

        {/* Signature */}
        <div style={signatureStyles}>
          <p style={paragraphStyles}>Alice Johnson</p>
        </div>

        {/* Footer */}
        <div style={footerStyles}>
          <p style={paragraphStyles}>Enclosure: Resume</p>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div 
      className={`bg-white text-black font-serif ${className}`}
      style={scaledStyles}
    >
      {/* Header */}
      <div style={headerStyles}>
        <h2 style={nameStyles}>Alice Johnson</h2>
        <p style={contactStyles}>789 Elm St, Anytown, USA</p>
        <p style={contactStyles}>alice.johnson@example.com | (987) 654-3210</p>
      </div>

      {/* Content */}
      <div style={contentStyles}>
        <p style={paragraphStyles}>October 1, 2023</p>
        <p style={paragraphStyles}>Robert Brown</p>
        <p style={paragraphStyles}>101 Corporate Blvd, Anytown, USA</p>
        <p style={paragraphStyles}>Dear Brown,</p>
        <p style={paragraphStyles}>
          I am excited to apply for the Marketing Specialist position at Creative Solutions LLC. With my extensive experience in marketing and communications, I am eager to bring my skills and passion to your esteemed organization.
        </p>
        <p style={paragraphStyles}>
          During my tenure at Ad Masters Inc., I successfully managed successful marketing campaigns that increased sales by 20%. This experience has honed my abilities in strategic planning, content creation, and social media management, making me a strong candidate for this role.
        </p>
        <p style={paragraphStyles}>
          What excites me about this opportunity is the opportunity to work on diverse and impactful projects. I am confident that my background and enthusiasm make me a strong fit for Creative Solutions LLC.
        </p>
        <p style={paragraphStyles}>
          Thank you for considering my application. I look forward to the opportunity to further discuss how my background and skills would make me a strong fit for your team.
        </p>
        <p style={paragraphStyles}>Sincerely,</p>
      </div>

      {/* Signature */}
      <div style={signatureStyles}>
        <p style={paragraphStyles}>Alice Johnson</p>
      </div>

      {/* Footer */}
      <div style={footerStyles}>
        <p style={paragraphStyles}>Enclosure: Resume</p>
      </div>
    </div>
  );
};

export default FLHarvardTemplate3;

