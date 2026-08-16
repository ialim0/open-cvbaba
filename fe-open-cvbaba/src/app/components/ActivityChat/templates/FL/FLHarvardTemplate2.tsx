import React from 'react';

interface FLHarvardTemplate2Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLHarvardTemplate2: React.FC<FLHarvardTemplate2Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // For compact mode, use fixed small sizes
  const baseFontSize = compact ? 8 : 14;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    maxWidth: `${(compact ? 400 : 800) * scale}px`,
    margin: '0 auto',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 6 : 30) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 24) * scale}px`,
    fontWeight: 'bold',
    color: '#A51C30', // Harvard Crimson
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
  };

  const contactInfoStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
    fontSize: `${(compact ? 6 : 14) * scale}px`,
  };

  const dateStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const recipientStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const greetingStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const contentStyles = {
    textAlign: 'justify' as const,
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const closingStyles = {
    marginTop: `${(compact ? 6 : 30) * scale}px`,
  };

  const signatureStyles = {
    marginTop: `${(compact ? 8 : 40) * scale}px`,
  };

  const harvardStripeStyles = {
    height: `${(compact ? 4 : 8) * scale}px`,
    backgroundColor: '#A51C30', // Harvard Crimson
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-serif ${className}`}
        style={scaledStyles}
      >
        {/* Harvard Stripe */}
        <div style={harvardStripeStyles}></div>

        {/* Header */}
        <div style={headerStyles}>
          <div style={nameStyles}>JORDAN SMITH</div>
          <div style={contactInfoStyles}>
            123 Academic Avenue, Cambridge, MA 02138<br />
            (617) 555-0123 | jordan.smith@harvard.edu<br />
            linkedin.com/in/jordansmith
          </div>
        </div>

        {/* Date */}
        <div style={dateStyles}>March 13, 2025</div>

        {/* Recipient */}
        <div style={recipientStyles}>
          Dr. Elizabeth Chen<br />
          Director of Research<br />
          Massachusetts General Hospital<br />
          55 Fruit Street<br />
          Boston, MA 02114
        </div>

        {/* Greeting */}
        <div style={greetingStyles}>Dear Dr. Chen,</div>

        {/* Content */}
        <div>
          <p style={contentStyles}>
            As a recent graduate from Harvard University with a Bachelor of Science in Molecular Biology, I am writing to express my strong interest in the Research Assistant position at Massachusetts General Hospital's Department of Oncology.
          </p>
          
          <p style={contentStyles}>
            During my time at Harvard, I developed extensive laboratory skills through my work in Dr. Michael Rodriguez's immunology lab, where I contributed to a project investigating T-cell responses in autoimmune conditions.
          </p>
          
          <p style={contentStyles}>
            Beyond technical skills, my collaborative work as part of Harvard's Undergraduate Research Association has prepared me to thrive in team environments. I served as a peer mentor, guiding fellow students through research methodologies.
          </p>
          
          <p style={contentStyles}>
            What draws me to Massachusetts General Hospital is not only its reputation for excellence but also the alignment between your lab's focus on innovative therapeutic approaches and my own research interests.
          </p>
          
          <p style={contentStyles}>
            I welcome the opportunity to discuss how my background, technical skills, and enthusiasm could benefit your research program. Thank you for considering my application.
          </p>
        </div>

        {/* Closing */}
        <div style={closingStyles}>Sincerely,</div>

        {/* Signature */}
        <div style={signatureStyles}>Jordan Smith</div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div 
      className={`bg-white text-black font-serif ${className}`}
      style={scaledStyles}
    >
      {/* Harvard Stripe */}
      <div style={harvardStripeStyles}></div>

      {/* Header */}
      <div style={headerStyles}>
        <div style={nameStyles}>JORDAN SMITH</div>
        <div style={contactInfoStyles}>
          123 Academic Avenue, Cambridge, MA 02138<br />
          (617) 555-0123 | jordan.smith@harvard.edu<br />
          linkedin.com/in/jordansmith
        </div>
      </div>

      {/* Date */}
      <div style={dateStyles}>March 13, 2025</div>

      {/* Recipient */}
      <div style={recipientStyles}>
        Dr. Elizabeth Chen<br />
        Director of Research<br />
        Massachusetts General Hospital<br />
        55 Fruit Street<br />
        Boston, MA 02114
      </div>

      {/* Greeting */}
      <div style={greetingStyles}>Dear Dr. Chen,</div>

      {/* Content */}
      <div>
        <p style={contentStyles}>
          As a recent graduate from Harvard University with a Bachelor of Science in Molecular Biology, I am writing to express my strong interest in the Research Assistant position at Massachusetts General Hospital's Department of Oncology. Having followed your groundbreaking research on targeted cancer therapies, I am particularly inspired by your lab's innovative approach to addressing treatment resistance in solid tumors.
        </p>
        
        <p style={contentStyles}>
          During my time at Harvard, I developed extensive laboratory skills through my work in Dr. Michael Rodriguez's immunology lab, where I contributed to a project investigating T-cell responses in autoimmune conditions. This experience allowed me to master techniques in flow cytometry, cell culture, and PCR analysis. Additionally, my senior thesis project examining the role of specific cytokine pathways in inflammation earned departmental honors and further strengthened my analytical and problem-solving abilities.
        </p>
        
        <p style={contentStyles}>
          Beyond technical skills, my collaborative work as part of Harvard's Undergraduate Research Association has prepared me to thrive in team environments. I served as a peer mentor, guiding fellow students through research methodologies and experimental design. This experience, combined with my coursework in biostatistics and data analysis, has equipped me with the comprehensive skill set necessary to make meaningful contributions to your research team.
        </p>
        
        <p style={contentStyles}>
          What draws me to Massachusetts General Hospital is not only its reputation for excellence but also the alignment between your lab's focus on innovative therapeutic approaches and my own research interests. I am particularly excited about the possibility of contributing to work that has such direct translational potential to improve patient outcomes.
        </p>
        
        <p style={contentStyles}>
          I welcome the opportunity to discuss how my background, technical skills, and enthusiasm could benefit your research program. Thank you for considering my application. I look forward to the possibility of working with your team.
        </p>
      </div>

      {/* Closing */}
      <div style={closingStyles}>Sincerely,</div>

      {/* Signature */}
      <div style={signatureStyles}>Jordan Smith</div>
    </div>
  );
};

export default FLHarvardTemplate2;

