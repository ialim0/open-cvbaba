import React from 'react';

interface FLHarvardTemplate4Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLHarvardTemplate4: React.FC<FLHarvardTemplate4Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // For compact mode, use fixed small sizes
  const baseFontSize = compact ? 8 : 14;
  const basePadding = compact ? 4 : 40;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 6 : 30) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 26) * scale}px`,
    margin: 0,
    color: '#2c3e50',
  };

  const contactStyles = {
    fontSize: `${(compact ? 6 : 14) * scale}px`,
    margin: `${(compact ? 1 : 5) * scale}px 0`,
    color: '#7f8c8d',
  };

  const contentStyles = {
    margin: `${(compact ? 4 : 20) * scale}px 0`,
  };

  const paragraphStyles = {
    margin: `${(compact ? 2 : 10) * scale}px 0`,
  };

  const signatureStyles = {
    marginTop: `${(compact ? 6 : 30) * scale}px`,
    fontStyle: 'italic',
    color: '#2c3e50',
  };

  const highlightStyles = {
    color: '#e74c3c',
    fontWeight: 'bold',
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        {/* Header */}
        <div style={headerStyles}>
          <h1 style={nameStyles}>Jane Smith</h1>
          <p style={contactStyles}>456 Harvard Avenue, Cambridge, MA 02138</p>
          <p style={contactStyles}>Email: jane.smith@example.com | Phone: (987) 654-3210</p>
        </div>

        {/* Content */}
        <div style={contentStyles}>
          <p style={paragraphStyles}>October 10, 2023</p>
          <p style={paragraphStyles}>Hiring Manager</p>
          <p style={paragraphStyles}>InnovateTech Solutions</p>
          <p style={paragraphStyles}>789 Tech Drive, Boston, MA 02110</p>
          <br />
          <p style={paragraphStyles}>Dear Hiring Manager,</p>
          <p style={paragraphStyles}>
            I am excited to apply for the <span style={highlightStyles}>Product Manager</span> position at InnovateTech Solutions. As a recent Harvard graduate with a degree in Computer Science and a passion for driving innovation, I am eager to bring my technical expertise and leadership skills to your dynamic team.
          </p>
          <p style={paragraphStyles}>
            During my internship at TechForward Inc., I led a team of developers to design and launch a mobile app that garnered over 100,000 downloads within the first three months. My ability to bridge the gap between technical teams and stakeholders ensured the project's success.
          </p>
          <p style={paragraphStyles}>
            What excites me most about InnovateTech Solutions is your focus on cutting-edge technologies and user-centric design. I am confident that my analytical mindset, combined with my experience in agile project management, will make a significant impact on your product development initiatives.
          </p>
          <p style={paragraphStyles}>
            I would love the opportunity to discuss how my background and skills align with your needs. Please feel free to contact me at (987) 654-3210 or jane.smith@example.com to schedule a conversation.
          </p>
          <p style={paragraphStyles}>Thank you for your time and consideration.</p>
          <p style={paragraphStyles}>Sincerely,</p>
          <p style={signatureStyles}>Jane Smith</p>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div 
      className={`bg-white text-black font-sans ${className}`}
      style={scaledStyles}
    >
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={nameStyles}>Jane Smith</h1>
        <p style={contactStyles}>456 Harvard Avenue, Cambridge, MA 02138</p>
        <p style={contactStyles}>Email: jane.smith@example.com | Phone: (987) 654-3210</p>
      </div>

      {/* Content */}
      <div style={contentStyles}>
        <p style={paragraphStyles}>October 10, 2023</p>
        <p style={paragraphStyles}>Hiring Manager</p>
        <p style={paragraphStyles}>InnovateTech Solutions</p>
        <p style={paragraphStyles}>789 Tech Drive, Boston, MA 02110</p>
        <br />
        <p style={paragraphStyles}>Dear Hiring Manager,</p>
        <p style={paragraphStyles}>
          I am excited to apply for the <span style={highlightStyles}>Product Manager</span> position at InnovateTech Solutions. As a recent Harvard graduate with a degree in Computer Science and a passion for driving innovation, I am eager to bring my technical expertise and leadership skills to your dynamic team.
        </p>
        <p style={paragraphStyles}>
          During my internship at TechForward Inc., I led a team of developers to design and launch a mobile app that garnered over 100,000 downloads within the first three months. My ability to bridge the gap between technical teams and stakeholders ensured the project's success and alignment with business goals.
        </p>
        <p style={paragraphStyles}>
          What excites me most about InnovateTech Solutions is your focus on cutting-edge technologies and user-centric design. I am confident that my analytical mindset, combined with my experience in agile project management, will make a significant impact on your product development initiatives.
        </p>
        <p style={paragraphStyles}>
          I would love the opportunity to discuss how my background and skills align with your needs. Please feel free to contact me at (987) 654-3210 or jane.smith@example.com to schedule a conversation.
        </p>
        <p style={paragraphStyles}>Thank you for your time and consideration.</p>
        <p style={paragraphStyles}>Sincerely,</p>
        <p style={signatureStyles}>Jane Smith</p>
      </div>
    </div>
  );
};

export default FLHarvardTemplate4;

