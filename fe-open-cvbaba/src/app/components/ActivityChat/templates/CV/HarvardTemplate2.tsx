import React from 'react';

interface HarvardTemplate2Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const HarvardTemplate2: React.FC<HarvardTemplate2Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 14;
  const basePadding = compact ? 6 : 30;
  const baseMargin = compact ? 3 : 25;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.5,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Times New Roman, serif',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 6 : 25) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 26) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 3 : 12) * scale}px`,
  };

  const contactInfoStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: `${(compact ? 3 : 10) * scale}px`,
    fontSize: `${(compact ? 7 : 12) * scale}px`,
    marginTop: `${(compact ? 3 : 12) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 6 : 25) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 8 : 18) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 4 : 15) * scale}px`,
    position: 'relative' as const,
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${(compact ? 4 : 18) * scale}px`,
  };

  const sectionTitleBeforeStyles = {
    content: '""',
    height: '1px',
    backgroundColor: '#000',
    flex: 1,
    maxWidth: '35%',
  };

  const sectionTitleAfterStyles = {
    content: '""',
    height: '1px',
    backgroundColor: '#000',
    flex: 1,
    maxWidth: '35%',
  };

  const entryStyles = {
    marginBottom: `${(compact ? 4 : 18) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
    fontSize: `${(compact ? 8 : 16) * scale}px`,
  };

  const entryOrgStyles = {
    fontStyle: 'italic',
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const entryDateStyles = {
    fontStyle: 'italic',
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const listStyles = {
    marginLeft: `${(compact ? 6 : 20) * scale}px`,
    marginTop: `${(compact ? 2 : 6) * scale}px`,
    listStyleType: 'disc',
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
    textAlign: 'justify' as const,
    display: 'list-item',
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const skillsSectionStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${(compact ? 4 : 18) * scale}px`,
  };

  const skillCategoryStyles = {
    marginBottom: `${(compact ? 3 : 10) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
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
          <div style={nameStyles}>Dr. Michael Alexander Johnson</div>
          <div style={contactInfoStyles}>
            <div>michael.johnson@harvard.edu</div>
            <div>(617) 555-0123</div>
            <div>Cambridge, MA 02138</div>
            <div>linkedin.com/in/michaeljohnson</div>
            <div>github.com/mjohnson</div>
            <div>mjohnson.harvard.edu</div>
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <div style={sectionTitleBeforeStyles}></div>
            Education
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>Harvard University</span>
                <span style={entryOrgStyles}>, Cambridge, MA</span>
              </div>
              <span style={entryDateStyles}>Sept 2020 - May 2024</span>
            </div>
            <div>Ph.D. in Public Policy, Harvard Kennedy School</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Dissertation: "Digital Transformation in Government: A Comparative Analysis of Policy Implementation"</li>
              <li style={listItemStyles}>GPA: 3.95/4.00; Kennedy Scholar; Public Service Fellow; Dean's List</li>
              <li style={listItemStyles}>Relevant Coursework: Advanced Policy Analysis, Quantitative Methods, Digital Government, Public Management</li>
            </ul>
          </div>
          
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>Yale University</span>
                <span style={entryOrgStyles}>, New Haven, CT</span>
              </div>
              <span style={entryDateStyles}>Sept 2016 - May 2020</span>
            </div>
            <div>Bachelor of Arts in Political Science, magna cum laude</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Minor in Economics; Senior Thesis: "Impact of Digital Technologies on Public Policy"</li>
              <li style={listItemStyles}>GPA: 3.89/4.00; Phi Beta Kappa; Dean's List; Political Science Department Honors</li>
              <li style={listItemStyles}>Relevant Coursework: Constitutional Law, Public Administration, Statistics, International Relations</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>London School of Economics</span>
                <span style={entryOrgStyles}>, London, UK</span>
              </div>
              <span style={entryDateStyles}>Sept 2018 - May 2019</span>
            </div>
            <div>Study Abroad Program, Government Department</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Focus on Comparative Politics and European Union Policy</li>
              <li style={listItemStyles}>GPA: 3.92/4.00; Merit Scholarship Recipient</li>
            </ul>
          </div>
        </div>

        {/* Professional Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <div style={sectionTitleBeforeStyles}></div>
            Professional Experience
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>U.S. Department of State</span>
                <span style={entryOrgStyles}>, Washington, D.C.</span>
              </div>
              <span style={entryDateStyles}>Summer 2023</span>
            </div>
            <div>Policy Intern, Bureau of Economic and Business Affairs</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Analyzed international economic policies and their impact on U.S. foreign relations</li>
              <li style={listItemStyles}>Drafted policy memos and briefing materials for senior leadership</li>
              <li style={listItemStyles}>Contributed to development of digital economy framework with key trading partners</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>McKinsey & Company</span>
                <span style={entryOrgStyles}>, Boston, MA</span>
              </div>
              <span style={entryDateStyles}>2020 - 2022</span>
            </div>
            <div>Business Analyst</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Led analysis for public sector transformation projects across three state governments</li>
              <li style={listItemStyles}>Developed strategic recommendations for $500M government technology modernization</li>
              <li style={listItemStyles}>Created data-driven solutions for public health policy implementation</li>
            </ul>
          </div>
        </div>

        {/* Leadership & Research Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <div style={sectionTitleBeforeStyles}></div>
            Leadership & Research Experience
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <div>
                <span style={entryTitleStyles}>Harvard Kennedy School Digital Government Initiative</span>
              </div>
              <span style={entryDateStyles}>2022 - Present</span>
            </div>
            <div>Research Fellow</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Lead research project on digital transformation in government services</li>
              <li style={listItemStyles}>Published policy brief on AI implementation in public sector operations</li>
            </ul>
          </div>
        </div>

        {/* Skills & Interests */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <div style={sectionTitleBeforeStyles}></div>
            Skills & Interests
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={skillsSectionStyles}>
            <div style={skillCategoryStyles}>
              <strong>Analysis:</strong> Policy Analysis, Economic Modeling, Data Analytics (Python, R)
            </div>
            <div style={skillCategoryStyles}>
              <strong>Languages:</strong> English (Native), French (Professional), Arabic (Basic)
            </div>
          </div>
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
        <div style={nameStyles}>Michael Johnson</div>
        <div style={contactInfoStyles}>
          <div>mjohnson@harvard.edu</div>
          <div>(617) 555-0123</div>
          <div>Cambridge, MA 02138</div>
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          <div style={sectionTitleBeforeStyles}></div>
          Education
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard University</span>
              <span style={entryOrgStyles}>, Cambridge, MA</span>
            </div>
            <span style={entryDateStyles}>May 2024</span>
          </div>
          <div>Master of Public Policy Candidate, Harvard Kennedy School</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Concentration in Business and Government Policy</li>
            <li style={listItemStyles}>GPA: 3.95/4.00; Kennedy Scholar; Public Service Fellow</li>
          </ul>
        </div>
        
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <div>
              <span style={entryTitleStyles}>Yale University</span>
              <span style={entryOrgStyles}>, New Haven, CT</span>
            </div>
            <span style={entryDateStyles}>May 2020</span>
          </div>
          <div>Bachelor of Arts in Political Science, cum laude</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Minor in Economics; Thesis: "Impact of Digital Technologies on Public Policy"</li>
          </ul>
        </div>
      </div>

      {/* Professional Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          <div style={sectionTitleBeforeStyles}></div>
          Professional Experience
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <div>
              <span style={entryTitleStyles}>U.S. Department of State</span>
              <span style={entryOrgStyles}>, Washington, D.C.</span>
            </div>
            <span style={entryDateStyles}>Summer 2023</span>
          </div>
          <div>Policy Intern, Bureau of Economic and Business Affairs</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Analyzed international economic policies and their impact on U.S. foreign relations</li>
            <li style={listItemStyles}>Drafted policy memos and briefing materials for senior leadership</li>
            <li style={listItemStyles}>Contributed to development of digital economy framework with key trading partners</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <div>
              <span style={entryTitleStyles}>McKinsey & Company</span>
              <span style={entryOrgStyles}>, Boston, MA</span>
            </div>
            <span style={entryDateStyles}>2020 - 2022</span>
          </div>
          <div>Business Analyst</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Led analysis for public sector transformation projects across three state governments</li>
            <li style={listItemStyles}>Developed strategic recommendations for $500M government technology modernization</li>
            <li style={listItemStyles}>Created data-driven solutions for public health policy implementation</li>
          </ul>
        </div>
      </div>

      {/* Leadership & Research Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          <div style={sectionTitleBeforeStyles}></div>
          Leadership & Research Experience
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard Kennedy School Digital Government Initiative</span>
            </div>
            <span style={entryDateStyles}>2022 - Present</span>
          </div>
          <div>Research Fellow</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead research project on digital transformation in government services</li>
            <li style={listItemStyles}>Published policy brief on AI implementation in public sector operations</li>
          </ul>
        </div>
      </div>

      {/* Skills & Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          <div style={sectionTitleBeforeStyles}></div>
          Skills & Interests
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={skillsSectionStyles}>
          <div style={skillCategoryStyles}>
            <strong>Analysis:</strong> Policy Analysis, Economic Modeling, Data Analytics (Python, R)
          </div>
          <div style={skillCategoryStyles}>
            <strong>Languages:</strong> English (Native), French (Professional), Arabic (Basic)
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvardTemplate2;