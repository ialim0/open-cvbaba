import React from 'react';

interface FLHarvardTemplate1Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLHarvardTemplate1: React.FC<FLHarvardTemplate1Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
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
    fontFamily: 'Georgia, serif',
    maxWidth: `${800 * scale}px`,
    margin: '0 auto',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const letterheadStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
    borderBottom: `2px solid #003366`,
    paddingBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const universityNameStyles = {
    fontSize: `${(compact ? 10 : 18) * scale}px`,
    fontWeight: 'bold',
    color: '#003366',
  };

  const departmentStyles = {
    fontSize: `${(compact ? 6 : 14) * scale}px`,
    marginTop: `${(compact ? 1 : 5) * scale}px`,
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 5 : 12) * scale}px`,
    marginTop: `${(compact ? 1 : 5) * scale}px`,
    color: '#555',
  };

  const dateStyles = {
    textAlign: 'right' as const,
    margin: `${(compact ? 3 : 15) * scale}px 0`,
  };

  const recipientStyles = {
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const greetingStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const contentStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const paragraphStyles = {
    textAlign: 'justify' as const,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const listStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingLeft: `${(compact ? 8 : 20) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    display: 'list-item',
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

  const attachmentsStyles = {
    marginTop: `${(compact ? 4 : 20) * scale}px`,
    fontSize: `${(compact ? 5 : 12) * scale}px`,
    color: '#555',
    borderTop: '1px solid #ddd',
    paddingTop: `${(compact ? 2 : 10) * scale}px`,
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
          <div style={universityNameStyles}>HARVARD UNIVERSITY</div>
          <div style={departmentStyles}>Department of Molecular and Cellular Biology</div>
          <div style={contactInfoStyles}>
            16 Divinity Avenue, Cambridge, MA 02138<br />
            Tel: (617) 555-1234 | Email: mcb@harvard.edu
          </div>
        </div>

        <div style={dateStyles}>March 13, 2025</div>

        <div style={recipientStyles}>
          Dr. Emily Carter<br />
          Professor of Biochemistry<br />
          Massachusetts Institute of Technology<br />
          77 Massachusetts Avenue<br />
          Cambridge, MA 02139
        </div>

        <div style={greetingStyles}>Dear Dr. Carter,</div>

        <div style={contentStyles}>
        <p style={paragraphStyles}>
            I am writing to propose a collaborative research initiative between our laboratories to investigate the molecular mechanisms of protein folding in neurodegenerative diseases.
        </p>

        <p style={paragraphStyles}>
            Our laboratory has recently developed a novel live-cell imaging technique that allows real-time observation of protein folding dynamics in neuronal cells.
          </p>
          
          <p style={paragraphStyles}>I propose the following framework for collaboration:</p>
          
          <ul style={listStyles}>
            <li style={listItemStyles}>Joint development of experimental protocols to study protein folding in live cells.</li>
            <li style={listItemStyles}>Exchange of research materials, including cell lines and biochemical reagents.</li>
            <li style={listItemStyles}>Co-authorship of research papers and joint grant applications to funding agencies such as the NIH and NSF.</li>
          </ul>
          
          <p style={paragraphStyles}>
            Our department has allocated resources to support initial collaborative experiments, and I would be happy to discuss specific details at your convenience.
          </p>
        </div>

        <div style={closingStyles}>Sincerely,</div>

        <div style={signatureStyles}>
          <div style={signatureNameStyles}>Dr. Michael Thompson, Ph.D.</div>
          <div style={signatureTitleStyles}>Associate Professor of Molecular Biology</div>
          <div style={signatureTitleStyles}>Director, Cellular Dynamics Laboratory</div>
        </div>

        <div style={attachmentsStyles}>
          Attachments:<br />
          - Draft research plan<br />
          - Preliminary data from live-cell imaging experiments<br />
          - Current CV
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
        <div style={universityNameStyles}>HARVARD UNIVERSITY</div>
        <div style={departmentStyles}>Department of Molecular and Cellular Biology</div>
        <div style={contactInfoStyles}>
          16 Divinity Avenue, Cambridge, MA 02138<br />
          Tel: (617) 555-1234 | Email: mcb@harvard.edu
        </div>
      </div>

      <div style={dateStyles}>March 13, 2025</div>

      <div style={recipientStyles}>
        Dr. Emily Carter<br />
        Professor of Biochemistry<br />
        Massachusetts Institute of Technology<br />
        77 Massachusetts Avenue<br />
        Cambridge, MA 02139
      </div>

      <div style={greetingStyles}>Dear Dr. Carter,</div>

      <div style={contentStyles}>
        <p style={paragraphStyles}>
          I am writing to propose a collaborative research initiative between our laboratories to investigate the molecular mechanisms of protein folding in neurodegenerative diseases. Your groundbreaking work on protein misfolding and aggregation has inspired our team, and we believe that combining our expertise in cellular biology with your biochemical approaches could lead to significant advancements in this field.
        </p>
        
      <p style={paragraphStyles}>
          Our laboratory has recently developed a novel live-cell imaging technique that allows real-time observation of protein folding dynamics in neuronal cells. This method, combined with your innovative biochemical assays, could provide unprecedented insights into the early stages of protein misfolding and its role in diseases such as Alzheimer's and Parkinson's.
      </p>

      <p style={paragraphStyles}>
          The collaboration would focus on several key areas of mutual interest. First, we propose to develop integrated experimental protocols that combine our live-cell imaging capabilities with your established biochemical characterization methods. This approach would allow us to correlate real-time cellular events with detailed molecular analysis of protein folding intermediates.
      </p>
        
      <p style={paragraphStyles}>
          Second, we are particularly interested in investigating the role of cellular stress responses in protein misfolding. Our preliminary data suggests that endoplasmic reticulum stress significantly influences protein folding kinetics, and we believe your expertise in stress response pathways would be invaluable in understanding these mechanisms.
        </p>
        
        <p style={paragraphStyles}>I propose the following framework for collaboration:</p>
        
        <ul style={listStyles}>
          <li style={listItemStyles}>Joint development of experimental protocols to study protein folding in live cells using our novel imaging techniques combined with your biochemical assays.</li>
          <li style={listItemStyles}>Exchange of research materials, including specialized cell lines, protein constructs, and biochemical reagents developed in both laboratories.</li>
          <li style={listItemStyles}>Co-authorship of research papers and joint grant applications to funding agencies such as the NIH, NSF, and private foundations focused on neurodegenerative disease research.</li>
          <li style={listItemStyles}>Regular joint laboratory meetings and research seminars to facilitate knowledge exchange and collaborative problem-solving.</li>
          <li style={listItemStyles}>Graduate student and postdoctoral fellow exchange programs to provide cross-training opportunities.</li>
        </ul>
        
      <p style={paragraphStyles}>
          Our department has allocated resources to support initial collaborative experiments, including funding for shared reagents and travel expenses for joint meetings. I have also secured preliminary support from the Harvard Catalyst program, which provides additional resources for interdisciplinary research collaborations.
      </p>
        
      <p style={paragraphStyles}>
          I have attached a detailed research plan outlining our proposed experimental approaches, preliminary data from our live-cell imaging experiments, and a timeline for the first year of collaboration. The plan includes specific aims, expected outcomes, and a budget breakdown for the proposed research activities.
      </p>

      <p style={paragraphStyles}>
          I believe this collaboration has the potential to make significant contributions to our understanding of neurodegenerative diseases and could lead to the development of novel therapeutic approaches. The combination of our complementary expertise and resources would create a powerful research partnership that could advance the field in meaningful ways.
      </p>
        
      <p style={paragraphStyles}>
          I would be delighted to discuss this proposal further and explore how we can establish a mutually beneficial research collaboration. Please let me know if you are available for a meeting or video conference in the coming weeks to discuss the details of this initiative.
        </p>
      </div>

      <div style={closingStyles}>Sincerely,</div>

      <div style={signatureStyles}>
        <div style={signatureNameStyles}>Dr. Michael Thompson, Ph.D.</div>
        <div style={signatureTitleStyles}>Associate Professor of Molecular Biology</div>
        <div style={signatureTitleStyles}>Director, Cellular Dynamics Laboratory</div>
        <div style={signatureTitleStyles}>Harvard Medical School</div>
      </div>

      <div style={attachmentsStyles}>
        Attachments:<br />
        - Detailed research collaboration proposal<br />
        - Preliminary data from live-cell imaging experiments<br />
        - Current CV and publication list<br />
        - Budget proposal for collaborative research<br />
        - Timeline for first year of collaboration
      </div>
    </div>
  );
};

export default FLHarvardTemplate1;