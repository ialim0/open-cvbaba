import React from 'react';

interface FLHarvardTemplate5Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLHarvardTemplate5: React.FC<FLHarvardTemplate5Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
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
    maxWidth: `${(compact ? 400 : 680) * scale}px`, // 8.5in converted to px
    margin: '0 auto',
  };

  const headerStyles = {
    marginBottom: `${(compact ? 3 : 24) * scale}px`, // 1.5em
  };

  const letterheadStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 1 : 5) * scale}px`, // 0.3em
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 17) * scale}px`, // 1.2em
    fontWeight: 'normal',
    margin: 0,
  };

  const contactInfoStyles = {
    textAlign: 'center' as const,
    fontSize: `${(compact ? 6 : 13) * scale}px`, // 0.9em
    marginBottom: `${(compact ? 3 : 24) * scale}px`, // 1.5em
    color: '#444',
  };

  const dateStyles = {
    marginBottom: `${(compact ? 3 : 24) * scale}px`, // 1.5em
  };

  const recipientStyles = {
    marginBottom: `${(compact ? 3 : 24) * scale}px`, // 1.5em
    lineHeight: 1.3,
  };

  const salutationStyles = {
    marginBottom: `${(compact ? 2 : 16) * scale}px`, // 1em
  };

  const bodyStyles = {
    textAlign: 'justify' as const,
    marginBottom: `${(compact ? 3 : 24) * scale}px`, // 1.5em
  };

  const paragraphStyles = {
    marginBottom: `${(compact ? 2 : 13) * scale}px`, // 0.8em
  };

  const closingStyles = {
    marginBottom: `${(compact ? 4 : 32) * scale}px`, // 2em
  };

  const signatureStyles = {
    marginBottom: `${(compact ? 1 : 5) * scale}px`, // 0.3em
  };

  const boldNameStyles = {
    fontWeight: 'bold',
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
          <div style={letterheadStyles}>
            <h1 style={nameStyles}>
              <span style={boldNameStyles}>Alexandra J. Morgan</span>
            </h1>
          </div>
          <div style={contactInfoStyles}>
            123 Academic Drive • Boston, MA 02115 • (617) 555-1234 • amorgan@email.com
          </div>
        </div>

        {/* Date */}
        <div style={dateStyles}>March 13, 2025</div>

        {/* Recipient */}
        <div style={recipientStyles}>
          Dr. Jonathan Fitzgerald<br />
          Director of Admissions<br />
          Graduate School of Arts and Sciences<br />
          Harvard University<br />
          Cambridge, MA 02138
        </div>

        {/* Salutation */}
        <div style={salutationStyles}>Dear Dr. Fitzgerald,</div>

        {/* Body */}
        <div style={bodyStyles}>
          <p style={paragraphStyles}>
            I am writing to express my strong interest in the Doctoral Program in Molecular and Cellular Biology at Harvard University. As a Research Associate at the Boston Medical Institute with expertise in cellular adaptation to environmental stress, I am eager to contribute to Harvard's tradition of excellence in scientific discovery.
          </p>
          
          <p style={paragraphStyles}>
            My background in Biochemistry from Stanford University, combined with my development of a novel approach to studying mitochondrial stress responses that reduced analysis time by 40%, has prepared me well for this opportunity.
          </p>
          
          <p style={paragraphStyles}>
            Harvard's interdisciplinary approach and Dr. Sarah Chen's groundbreaking work on cellular stress responses particularly draw me to your program. I believe my expertise in high-throughput screening methods aligns perfectly with the department's growing focus on computational approaches.
          </p>
          
          <p style={paragraphStyles}>
            Beyond research, I have demonstrated commitment to scientific outreach by founding a program connecting underrepresented minority students with research mentors. I welcome the opportunity to discuss how my background would benefit Harvard's Molecular and Cellular Biology program.
          </p>
        </div>

        {/* Closing */}
        <div style={closingStyles}>Sincerely,</div>

        {/* Signature */}
        <div style={signatureStyles}>[Signature]</div>
        <div style={boldNameStyles}>Alexandra J. Morgan</div>
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
        <div style={letterheadStyles}>
          <h1 style={nameStyles}>
            <span style={boldNameStyles}>Alexandra J. Morgan</span>
          </h1>
        </div>
        <div style={contactInfoStyles}>
          123 Academic Drive • Boston, MA 02115 • (617) 555-1234 • amorgan@email.com
        </div>
      </div>

      {/* Date */}
      <div style={dateStyles}>March 13, 2025</div>

      {/* Recipient */}
      <div style={recipientStyles}>
        Dr. Jonathan Fitzgerald<br />
        Director of Admissions<br />
        Graduate School of Arts and Sciences<br />
        Harvard University<br />
        Cambridge, MA 02138
      </div>

      {/* Salutation */}
      <div style={salutationStyles}>Dear Dr. Fitzgerald,</div>

      {/* Body */}
      <div style={bodyStyles}>
        <p style={paragraphStyles}>
          I am writing to express my strong interest in the Doctoral Program in Molecular and Cellular Biology at Harvard University. As a Research Associate at the Boston Medical Institute with expertise in cellular adaptation to environmental stress, I am eager to contribute to Harvard's tradition of excellence in scientific discovery.
        </p>
        
        <p style={paragraphStyles}>
          My background in Biochemistry from Stanford University, combined with my development of a novel approach to studying mitochondrial stress responses that reduced analysis time by 40%, has prepared me well for this opportunity. These experiences have sharpened my skills in bioinformatics, experimental design, and cross-disciplinary collaboration.
        </p>
        
        <p style={paragraphStyles}>
          Harvard's interdisciplinary approach and Dr. Sarah Chen's groundbreaking work on cellular stress responses particularly draw me to your program. I believe my expertise in high-throughput screening methods and computational modeling aligns perfectly with the department's growing focus on computational approaches to biological questions.
        </p>
        
        <p style={paragraphStyles}>
          Beyond research, I have demonstrated commitment to scientific outreach by founding a program connecting underrepresented minority students with research mentors. I welcome the opportunity to discuss how my background would benefit Harvard's Molecular and Cellular Biology program and look forward to the possibility of joining your distinguished community.
        </p>
      </div>

      {/* Closing */}
      <div style={closingStyles}>Sincerely,</div>

      {/* Signature */}
      <div style={signatureStyles}>[Signature]</div>
      <div style={boldNameStyles}>Alexandra J. Morgan</div>
    </div>
  );
};

export default FLHarvardTemplate5;

