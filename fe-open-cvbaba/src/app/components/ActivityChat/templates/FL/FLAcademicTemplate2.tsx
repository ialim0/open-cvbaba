import React from 'react';

interface FLAcademicTemplate2Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FLAcademicTemplate2: React.FC<FLAcademicTemplate2Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 13;
  const basePadding = compact ? 2 : 5;
  const baseMargin = compact ? 1 : 10;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
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
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingBottom: `${(compact ? 1 : 5) * scale}px`,
    borderBottom: `1px solid #8a1538`,
  };

  const universityNameStyles = {
    fontSize: `${(compact ? 8 : 16) * scale}px`,
    fontWeight: 'bold',
    color: '#8a1538',
  };

  const departmentStyles = {
    fontSize: `${(compact ? 6 : 13) * scale}px`,
    marginTop: `${(compact ? 0.5 : 2) * scale}px`,
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 5 : 11) * scale}px`,
    marginTop: `${(compact ? 0.5 : 3) * scale}px`,
  };

  const dateStyles = {
    textAlign: 'right' as const,
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const recipientStyles = {
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const subjectStyles = {
    fontWeight: 'bold',
    textAlign: 'center' as const,
    textDecoration: 'underline',
    fontSize: `${(compact ? 6 : 13) * scale}px`,
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const greetingStyles = {
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const paragraphStyles = {
    textAlign: 'justify' as const,
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
  };

  const sabbaticalPlanStyles = {
    margin: `${(compact ? 2 : 10) * scale}px 0`,
    padding: `${(compact ? 1 : 5) * scale}px`,
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
  };

  const sabbaticalPlanTitleStyles = {
    marginTop: 0,
    color: '#8a1538',
    borderBottom: '1px dotted #8a1538',
    paddingBottom: `${(compact ? 1 : 3) * scale}px`,
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const timelineStyles = {
    marginLeft: `${(compact ? 2 : 10) * scale}px`,
  };

  const timelineItemStyles = {
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    fontSize: `${(compact ? 5 : 12) * scale}px`,
  };

  const closingStyles = {
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const signatureStyles = {
    margin: `${(compact ? 1 : 5) * scale}px 0`,
  };

  const signatureNameStyles = {
    fontWeight: 'bold',
  };

  const attachmentsStyles = {
    fontSize: `${(compact ? 5 : 11) * scale}px`,
    fontStyle: 'italic',
    margin: `${(compact ? 1 : 5) * scale}px 0`,
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
          <div style={universityNameStyles}>BOSTON UNIVERSITY</div>
          <div style={departmentStyles}>Department of Comparative Literature</div>
          <div style={contactInfoStyles}>
            685 Commonwealth Avenue, Boston, MA 02215<br />
            Tel: (617) 555-3426 | Email: complit@bu.edu
          </div>
        </div>

        <div style={dateStyles}>March 13, 2025</div>

        <div style={recipientStyles}>
          Professor Richard Martinez<br />
          Chair, Department of Comparative Literature<br />
          Boston University<br />
          685 Commonwealth Avenue<br />
          Boston, MA 02215
        </div>

        <div style={subjectStyles}>REQUEST FOR SABBATICAL LEAVE: ACADEMIC YEAR 2025-2026</div>

        <div style={greetingStyles}>Dear Professor Martinez,</div>

        <div>
          <p style={paragraphStyles}>
            I am writing to formally request a sabbatical leave for the Fall semester of the 2025-2026 academic year. Having served as a faculty member for the past seven years, I am eligible for this sabbatical. This leave would significantly enhance my academic contribution to the department and the field.
          </p>

          <p style={paragraphStyles}>
            During my sabbatical, I plan to complete my book manuscript, "<em>Borders in Translation: Literary Migrations Across the Global South</em>," which examines cross-cultural identity formation. This builds upon research supported by the university's Faculty Research Grant (2023) and a fellowship (2024).
          </p>

          <div style={sabbaticalPlanStyles}>
            <h3 style={sabbaticalPlanTitleStyles}>Sabbatical Research Plan</h3>
            <p style={paragraphStyles}>My sabbatical project will involve:</p>
            <ol style={timelineStyles}>
              <li style={timelineItemStyles}><strong>Manuscript Completion:</strong> Finalizing three chapters of my book manuscript, solicited by Duke University Press.</li>
              <li style={timelineItemStyles}><strong>Archival Research:</strong> Conducting a research visit to the National Library of Brazil.</li>
              <li style={timelineItemStyles}><strong>International Collaboration:</strong> Working with colleagues at the University of São Paulo on our digital humanities project.</li>
            </ol>

            <p style={paragraphStyles}>This will contribute to our department's emphasis on global literary movements and enhance graduate course offerings upon my return.</p>
          </div>

          <p style={paragraphStyles}>
            Professor Anna Kim has agreed to serve as interim advisor to my doctoral students, and Professor James Wong will cover my World Literature seminar (CL301). I will complete committee work before departure and remain available virtually.
          </p>

          <p style={paragraphStyles}>
            Upon my return, I will offer a new graduate seminar, "Literary Border-Crossings in the Global South," and plan to organize a symposium to foster international scholarly exchange.
          </p>

          <p style={paragraphStyles}>Thank you for considering this request. I am happy to provide any additional information.</p>
        </div>

        <div style={closingStyles}>Respectfully submitted,</div>

        <div style={signatureStyles}>
          <div style={signatureNameStyles}>Dr. Elena Fernandez, Ph.D.</div>
          <div>Associate Professor of Comparative Literature</div>
          <div style={contactInfoStyles}>
            Office: CAS 507 | Email: efernandez@bu.edu | Phone: (617) 555-9831
          </div>
        </div>

        <div style={attachmentsStyles}>
          Attachments:<br />
          - Detailed sabbatical research plan<br />
          - Publication schedule from Duke University Press<br />
          - Letter of invitation from University of São Paulo<br />
          - Teaching coverage plan approved by relevant faculty<br />
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
        <div style={universityNameStyles}>BOSTON UNIVERSITY</div>
        <div style={departmentStyles}>Department of Comparative Literature</div>
        <div style={contactInfoStyles}>
          685 Commonwealth Avenue, Boston, MA 02215<br />
          Tel: (617) 555-3426 | Email: complit@bu.edu
        </div>
      </div>

      <div style={dateStyles}>March 13, 2025</div>

      <div style={recipientStyles}>
        Professor Richard Martinez<br />
        Chair, Department of Comparative Literature<br />
        Boston University<br />
        685 Commonwealth Avenue<br />
        Boston, MA 02215
      </div>

      <div style={subjectStyles}>REQUEST FOR SABBATICAL LEAVE: ACADEMIC YEAR 2025-2026</div>

      <div style={greetingStyles}>Dear Professor Martinez,</div>

      <div>
        <p style={paragraphStyles}>
          I am writing to formally request a sabbatical leave for the Fall semester of the 2025-2026 academic year. Having served as a faculty member in the Department of Comparative Literature for the past seven years, I am eligible for this sabbatical under the university's faculty development policy. This period of focused research and scholarly engagement would significantly enhance my academic contribution to both the department and the broader field of contemporary transnational literature.
        </p>
        
        <p style={paragraphStyles}>
          During my sabbatical, I plan to complete my book manuscript, "<em>Borders in Translation: Literary Migrations Across the Global South</em>," which examines how contemporary authors from Latin America, West Africa, and Southeast Asia represent cross-cultural identity formation in their works. This project builds directly upon the research I have conducted over the past three years, supported in part by the university's Faculty Research Grant (2023) and a fellowship from the American Comparative Literature Association (2024).
        </p>
        
        <div style={sabbaticalPlanStyles}>
          <h3 style={sabbaticalPlanTitleStyles}>Sabbatical Research Plan</h3>
          <p style={paragraphStyles}>My sabbatical project will involve three interconnected components:</p>
          <ol style={timelineStyles}>
            <li style={timelineItemStyles}><strong>Manuscript Completion:</strong> Finalizing the remaining three chapters of my book manuscript (approximately 100 pages), which has already been solicited by Duke University Press. This work will synthesize my research on transnational literary movements and provide a comprehensive analysis of how contemporary authors navigate cultural boundaries in their creative works.</li>
            <li style={timelineItemStyles}><strong>Archival Research:</strong> Conducting a four-week research visit to the National Library of Brazil in Rio de Janeiro, where I will examine previously unexplored correspondence between Brazilian modernist writers and their counterparts in Senegal and the Philippines. This archival work will provide crucial primary source material for my book's central argument about cross-cultural literary influence.</li>
            <li style={timelineItemStyles}><strong>International Collaboration:</strong> Working with colleagues at the University of São Paulo on our joint digital humanities project mapping transnational literary influences, which has been preliminarily funded by a grant from the Mellon Foundation. This collaboration will result in a digital archive that will be accessible to scholars worldwide.</li>
          </ol>
          
          <p style={paragraphStyles}>This work will directly contribute to our department's strategic emphasis on global literary movements and will enhance our graduate course offerings in transnational literary studies upon my return. The research will also strengthen our department's international reputation and provide new opportunities for student research and collaboration.</p>
        </div>
        
        <p style={paragraphStyles}>
          I have carefully planned for my teaching and service responsibilities during my absence. Professor Anna Kim has agreed to serve as interim advisor to the three doctoral students under my supervision, and I have arranged with Professor James Wong to cover my undergraduate seminar on World Literature (CL301). I will complete all pending committee work before my departure and will remain available virtually for any urgent departmental matters that may require my input.
        </p>

        <p style={paragraphStyles}>
          Upon my return in Spring 2026, I will offer a new graduate seminar based on my sabbatical research, tentatively titled "Literary Border-Crossings in the Global South," which will complement our existing curriculum in transnational literary studies. I also plan to organize a symposium featuring scholars from Latin America, Africa, and Asia to foster international scholarly exchange within our department.
        </p>

        <p style={paragraphStyles}>
          The sabbatical will also provide me with the opportunity to develop new research methodologies that I can incorporate into my teaching. Specifically, I plan to explore digital humanities approaches to literary analysis that will enhance our department's technological capabilities and provide students with cutting-edge research tools.
        </p>

        <p style={paragraphStyles}>
          Thank you for considering this request. I believe this sabbatical will significantly enhance my scholarly contribution to Boston University and to the field of comparative literature. The research I conduct during this period will not only advance my own scholarly agenda but will also strengthen our department's position as a leader in transnational literary studies. I am happy to provide any additional information that might be helpful in your deliberation.
        </p>
      </div>

      <div style={closingStyles}>Respectfully submitted,</div>

      <div style={signatureStyles}>
        <div style={signatureNameStyles}>Dr. Elena Fernandez, Ph.D.</div>
        <div>Associate Professor of Comparative Literature</div>
        <div style={contactInfoStyles}>
          Office: CAS 507 | Email: efernandez@bu.edu | Phone: (617) 555-9831
        </div>
      </div>
      
      <div style={attachmentsStyles}>
        Attachments:<br />
        - Detailed sabbatical research plan<br />
        - Publication schedule from Duke University Press<br />
        - Letter of invitation from University of São Paulo<br />
        - Teaching coverage plan approved by relevant faculty<br />
        - Current CV with publication record
      </div>
    </div>
  );
};

export default FLAcademicTemplate2;