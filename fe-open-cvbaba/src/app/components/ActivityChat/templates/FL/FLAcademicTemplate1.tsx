import React from 'react';

interface FLAcademicTemplate1Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLAcademicTemplate1: React.FC<FLAcademicTemplate1Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 14;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.5,
    color: '#333',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Times New Roman, Times, serif',
    maxWidth: `${800 * scale}px`,
    margin: '0 auto',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const letterheadStyles = {
    borderBottom: `2px solid #003366`,
    paddingBottom: `${(compact ? 2 : 10) * scale}px`,
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const universityNameStyles = {
    fontSize: `${(compact ? 10 : 20) * scale}px`,
    fontWeight: 'bold',
    color: '#003366',
  };

  const departmentStyles = {
    fontSize: `${(compact ? 8 : 16) * scale}px`,
    color: '#555',
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 6 : 12) * scale}px`,
    marginTop: `${(compact ? 1 : 5) * scale}px`,
  };

  const dateStyles = {
    margin: `${(compact ? 4 : 20) * scale}px 0 ${(compact ? 3 : 15) * scale}px 0`,
  };

  const recipientStyles = {
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const subjectStyles = {
    fontWeight: 'bold',
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const greetingStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const paragraphStyles = {
    textAlign: 'justify' as const,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const closingStyles = {
    marginTop: `${(compact ? 4 : 20) * scale}px`,
  };

  const signatureStyles = {
    marginTop: `${(compact ? 6 : 30) * scale}px`,
  };

  const signatureNameStyles = {
    fontWeight: 'bold',
  };

  const signatureTitleStyles = {
    fontStyle: 'italic',
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div
        className={`bg-white text-black font-serif ${className}`}
        style={scaledStyles}
      >
        {/* Letterhead */}
        <div style={letterheadStyles}>
          <div style={universityNameStyles}>UNIVERSITY OF CAMBRIDGE</div>
          <div style={departmentStyles}>Department of Theoretical Physics</div>
          <div style={contactInfoStyles}>
            JJ Thomson Avenue, Cambridge CB3 0HE, United Kingdom<br />
            Tel: +44 (0)1223 337733 | Email: physics.dept@cam.ac.uk
          </div>
        </div>

        <div style={dateStyles}>March 13, 2025</div>

        <div style={recipientStyles}>
          Graduate Admissions Committee<br />
          Massachusetts Institute of Technology<br />
          77 Massachusetts Avenue<br />
          Cambridge, MA 02139<br />
          United States
        </div>

        <div style={subjectStyles}>RE: Letter of Recommendation for Emma Chen</div>

        <div style={greetingStyles}>Dear Admissions Committee,</div>

        <div>
          <p style={paragraphStyles}>
            I am writing to provide my strongest recommendation for Emma Chen, who is applying to your Doctoral Program in Theoretical Physics. I have known Emma for the past three years, first as a student in my Advanced Quantum Mechanics course, and subsequently as my research assistant investigating quantum field theories in curved spacetime.
          </p>
          
          <p style={paragraphStyles}>
            Emma ranks among the top 1% of students I have taught in my fifteen years at Cambridge. Her understanding of complex theoretical concepts is exceptional, as evidenced by her first-author paper in <i>Physical Review Letters</i> on symmetry breaking in non-equilibrium quantum systems.
          </p>
          
          <p style={paragraphStyles}>
            Beyond her remarkable intellectual capabilities, Emma possesses the persistence and creativity essential for pioneering research. When faced with a particularly challenging mathematical problem in our work on quantum entanglement, she developed a novel computational approach that elegantly resolved the issue.
          </p>
          
          <p style={paragraphStyles}>
            Emma's combination of exceptional analytical abilities, research creativity, and collaborative skills make her an ideal candidate for your program. I believe she has the potential to make significant contributions to theoretical physics, particularly in quantum information theory where your department has established leadership.
          </p>
        </div>

        <div style={closingStyles}>Sincerely,</div>

        <div style={signatureStyles}>
          <div style={signatureNameStyles}>Professor Jonathan Blackwell, D.Phil, FRS</div>
          <div style={signatureTitleStyles}>Chair of Quantum Information Theory</div>
          <div style={signatureTitleStyles}>Fellow of Trinity College</div>
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
      {/* Letterhead */}
      <div style={letterheadStyles}>
        <div style={universityNameStyles}>UNIVERSITY OF CAMBRIDGE</div>
        <div style={departmentStyles}>Department of Theoretical Physics</div>
        <div style={contactInfoStyles}>
          JJ Thomson Avenue, Cambridge CB3 0HE, United Kingdom<br />
          Tel: +44 (0)1223 337733 | Email: physics.dept@cam.ac.uk
        </div>
      </div>

      <div style={dateStyles}>March 13, 2025</div>

      <div style={recipientStyles}>
        Graduate Admissions Committee<br />
        Massachusetts Institute of Technology<br />
        77 Massachusetts Avenue<br />
        Cambridge, MA 02139<br />
        United States
      </div>

      <div style={subjectStyles}>RE: Letter of Recommendation for Emma Chen</div>

      <div style={greetingStyles}>Dear Admissions Committee,</div>

      <div>
        <p style={paragraphStyles}>
          I am writing to provide my strongest recommendation for Emma Chen, who is applying to your Doctoral Program in Theoretical Physics. I have known Emma for the past three years, first as a student in my Advanced Quantum Mechanics course, and subsequently as my research assistant investigating quantum field theories in curved spacetime.
        </p>
        
        <p style={paragraphStyles}>
          Emma ranks among the top 1% of students I have taught in my fifteen years at Cambridge. Her understanding of complex theoretical concepts is exceptional, as evidenced by her first-author paper in <i>Physical Review Letters</i> on symmetry breaking in non-equilibrium quantum systems. This work has already garnered significant attention in our field, with several research groups building upon her theoretical framework.
        </p>
        
        <p style={paragraphStyles}>
          Beyond her remarkable intellectual capabilities, Emma possesses the persistence and creativity essential for pioneering research. When faced with a particularly challenging mathematical problem in our work on quantum entanglement, she developed a novel computational approach that elegantly resolved the issue. This demonstrated not only technical proficiency but also the innovative thinking that characterizes the most successful theoretical physicists.
        </p>
        
        <p style={paragraphStyles}>
          Emma has also shown excellent communication abilities, presenting our research at three international conferences where her clarity and command of the material impressed senior colleagues. She has simultaneously mentored undergraduate students in our laboratory, displaying patience and an ability to explain complex concepts in accessible terms. These teaching skills will undoubtedly serve her well in an academic career.
        </p>
        
        <p style={paragraphStyles}>
          In addition to her research excellence, Emma has demonstrated exceptional leadership qualities within our department. She has organized weekly seminars for graduate students, creating a collaborative environment that has enhanced the intellectual atmosphere of our program. Her ability to synthesize complex ideas and present them clearly has made her a valuable resource for both faculty and fellow students.
        </p>
        
        <p style={paragraphStyles}>
          Emma's research contributions extend beyond her primary work in quantum field theory. She has co-authored two additional papers in <i>Nature Physics</i> and <i>Physical Review D</i>, demonstrating her versatility and depth of understanding across multiple areas of theoretical physics. Her work on quantum information theory, in particular, has shown remarkable insight into the fundamental principles underlying quantum computation and communication.
        </p>
        
        <p style={paragraphStyles}>
          What sets Emma apart from other exceptional students is her ability to bridge theoretical concepts with practical applications. Her research on quantum error correction has direct implications for the development of quantum computers, and she has already begun collaborating with experimental groups to test her theoretical predictions. This interdisciplinary approach is exactly what is needed to advance the field of quantum information science.
        </p>
        
        <p style={paragraphStyles}>
          Emma's combination of exceptional analytical abilities, research creativity, and collaborative skills make her an ideal candidate for your program. I believe she has the potential to make significant contributions to theoretical physics, particularly in quantum information theory where your department has established leadership. Her work ethic, intellectual curiosity, and passion for discovery make her precisely the kind of student who will thrive in your rigorous doctoral program.
        </p>
        
        <p style={paragraphStyles}>
          In conclusion, I recommend Emma Chen without reservation. She is precisely the kind of brilliant, dedicated scholar who will thrive in a demanding doctoral program and subsequently advance the boundaries of our field. Her combination of intellectual excellence, research innovation, and personal character make her an outstanding candidate for your program. Please do not hesitate to contact me should you require any further information about her qualifications or character.
        </p>
      </div>

      <div style={closingStyles}>Sincerely,</div>

      <div style={signatureStyles}>
        <div style={signatureNameStyles}>Professor Jonathan Blackwell, D.Phil, FRS</div>
        <div style={signatureTitleStyles}>Chair of Quantum Information Theory</div>
        <div style={signatureTitleStyles}>Fellow of Trinity College</div>
        <div style={signatureTitleStyles}>University of Cambridge</div>
      </div>
    </div>
  );
};

export default FLAcademicTemplate1;