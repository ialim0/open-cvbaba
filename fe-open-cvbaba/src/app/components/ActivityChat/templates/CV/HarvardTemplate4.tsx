import React from 'react';

interface HarvardTemplate4Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const HarvardTemplate4: React.FC<HarvardTemplate4Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 12;
  const basePadding = compact ? 4 : 35;
  const baseMargin = compact ? 2 : 25;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.5,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Palatino, serif',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 8 : 30) * scale}px`,
    position: 'relative' as const,
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 24) * scale}px`,
    fontWeight: 'normal',
    marginBottom: `${(compact ? 4 : 12) * scale}px`,
    borderBottom: '1px solid #000',
    paddingBottom: `${(compact ? 3 : 8) * scale}px`,
    display: 'inline-block',
  };

  const contactInfoStyles = {
    fontStyle: 'italic',
    lineHeight: 1.6,
  };

  const dividerStyles = {
    width: '100%',
    height: `${(compact ? 2 : 4) * scale}px`,
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    margin: `${(compact ? 4 : 15) * scale}px 0`,
  };

  const sectionStyles = {
    margin: `${(compact ? 6 : 25) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 6 : 16) * scale}px`,
    textTransform: 'uppercase' as const,
    letterSpacing: `${(compact ? 0.25 : 1) * scale}px`,
    marginBottom: `${(compact ? 4 : 15) * scale}px`,
    display: 'inline-block',
    borderBottom: '2px solid #000',
    paddingRight: `${(compact ? 20 : 50) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 6 : 20) * scale}px`,
  };

  const entryGridStyles = {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gap: `${(compact ? 3 : 10) * scale}px`,
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
  };

  const entryOrgStyles = {
    fontStyle: 'italic',
  };

  const entryDateStyles = {
    textAlign: 'right' as const,
    fontStyle: 'italic',
  };

  const listStyles = {
    listStyleType: 'disc',
    marginLeft: `${(compact ? 8 : 20) * scale}px`,
    marginTop: `${(compact ? 3 : 8) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 2 : 6) * scale}px`,
    textAlign: 'justify' as const,
    display: 'list-item',
  };

  const skillsTableStyles = {
    width: '100%',
    marginTop: `${(compact ? 3 : 10) * scale}px`,
  };

  const skillsTableCellStyles = {
    padding: `${(compact ? 2 : 5) * scale}px ${(compact ? 5 : 15) * scale}px ${(compact ? 2 : 5) * scale}px 0`,
    verticalAlign: 'top' as const,
  };

  const skillsTableFirstCellStyles = {
    fontWeight: 'bold',
    width: `${(compact ? 60 : 120) * scale}px`,
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
          <div style={nameStyles}>William H. Thompson</div>
          <div style={contactInfoStyles}>
            44 Harvard Law School · Cambridge, MA 02138<br />
            (617) 555-7890 · william.thompson@harvard.edu<br />
            linkedin.com/in/williamthompson
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={entryStyles}>
            <div style={entryGridStyles}>
              <div>
                <span style={entryTitleStyles}>Harvard Law School</span>
                <span style={entryOrgStyles}>, Cambridge, MA</span>
              </div>
              <div style={entryDateStyles}>May 2024</div>
            </div>
            <div>Juris Doctor Candidate</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Harvard Law Review, Executive Editor</li>
              <li style={listItemStyles}>Harvard Legal Aid Bureau, Student Attorney</li>
              <li style={listItemStyles}>GPA: 3.91/4.00; Dean's Scholar Prize in Constitutional Law</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryGridStyles}>
              <div>
                <span style={entryTitleStyles}>Princeton University</span>
                <span style={entryOrgStyles}>, Princeton, NJ</span>
              </div>
              <div style={entryDateStyles}>June 2020</div>
            </div>
            <div>A.B. in Politics, Certificate in Values & Public Life</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Summa Cum Laude; Phi Beta Kappa; Senior Thesis Prize</li>
            </ul>
          </div>
        </div>

        {/* Legal Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Legal Experience</div>
          <div style={entryStyles}>
            <div style={entryGridStyles}>
              <div>
                <span style={entryTitleStyles}>U.S. Court of Appeals</span>
                <span style={entryOrgStyles}>, First Circuit</span>
              </div>
              <div style={entryDateStyles}>Summer 2023</div>
            </div>
            <div>Judicial Intern, Hon. Judge Martinez</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Drafted bench memoranda and opinions for civil and criminal cases</li>
              <li style={listItemStyles}>Conducted legal research on constitutional law and statutory interpretation</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryGridStyles}>
              <div>
                <span style={entryTitleStyles}>Davis Polk & Wardwell LLP</span>
                <span style={entryOrgStyles}>, New York, NY</span>
              </div>
              <div style={entryDateStyles}>Summer 2022</div>
            </div>
            <div>Summer Associate</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Worked on corporate transactions and regulatory compliance matters</li>
              <li style={listItemStyles}>Assisted with pro bono asylum cases and housing rights advocacy</li>
            </ul>
          </div>
        </div>

        {/* Skills & Qualifications */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Skills & Qualifications</div>
          <table style={skillsTableStyles}>
            <tbody>
              <tr>
                <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Legal Research:</td>
                <td style={skillsTableCellStyles}>Westlaw, LexisNexis, Bloomberg Law</td>
              </tr>
              <tr>
                <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Certifications:</td>
                <td style={skillsTableCellStyles}>Certified in Legal Research & Writing</td>
              </tr>
              <tr>
                <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Languages:</td>
                <td style={skillsTableCellStyles}>English (Native), Spanish (Professional), German (Conversational)</td>
              </tr>
            </tbody>
          </table>
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
        <div style={nameStyles}>William H. Thompson</div>
        <div style={contactInfoStyles}>
          44 Harvard Law School · Cambridge, MA 02138<br />
          (617) 555-7890 · william.thompson@harvard.edu<br />
          linkedin.com/in/williamthompson
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard Law School</span>
              <span style={entryOrgStyles}>, Cambridge, MA</span>
            </div>
            <div style={entryDateStyles}>May 2024</div>
          </div>
          <div>Juris Doctor Candidate, Concentration in Constitutional Law</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Harvard Law Review, Executive Editor; Managing Editor (2023-2024)</li>
            <li style={listItemStyles}>Harvard Legal Aid Bureau, Student Attorney; Pro Bono Service Award</li>
            <li style={listItemStyles}>GPA: 3.91/4.00; Dean's Scholar Prize in Constitutional Law; Magna Cum Laude</li>
            <li style={listItemStyles}>Relevant Coursework: Constitutional Law, Civil Procedure, Criminal Law, Contracts, Torts</li>
            <li style={listItemStyles}>Moot Court Competition: First Place, Best Oral Argument Award</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Princeton University</span>
              <span style={entryOrgStyles}>, Princeton, NJ</span>
            </div>
            <div style={entryDateStyles}>June 2020</div>
          </div>
          <div>A.B. in Politics, Certificate in Values & Public Life | GPA: 3.89/4.00</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Summa Cum Laude; Phi Beta Kappa; Senior Thesis Prize; Dean's List</li>
            <li style={listItemStyles}>Senior Thesis: "The Evolution of Constitutional Interpretation in the Digital Age"</li>
            <li style={listItemStyles}>Relevant Coursework: Constitutional Law, Political Theory, American Government, Ethics</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Oxford University</span>
              <span style={entryOrgStyles}>, Oxford, UK</span>
            </div>
            <div style={entryDateStyles}>2018 - 2019</div>
          </div>
          <div>Study Abroad Program, Politics & International Relations</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Focus on Comparative Constitutional Law and European Legal Systems</li>
            <li style={listItemStyles}>GPA: 3.95/4.00; Rhodes Scholarship Finalist</li>
          </ul>
        </div>
      </div>

      {/* Legal Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Legal Experience</div>
        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>U.S. Court of Appeals for the First Circuit</span>
              <span style={entryOrgStyles}>, Boston, MA</span>
            </div>
            <div style={entryDateStyles}>Summer 2023</div>
          </div>
          <div>Judicial Intern, Hon. Judge Maria Martinez</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Drafted bench memoranda and opinions for civil and criminal cases</li>
            <li style={listItemStyles}>Conducted legal research on constitutional law and statutory interpretation</li>
            <li style={listItemStyles}>Assisted in preparation for oral arguments and case conferences</li>
            <li style={listItemStyles}>Researched emerging issues in technology law and privacy rights</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Davis Polk & Wardwell LLP</span>
              <span style={entryOrgStyles}>, New York, NY</span>
            </div>
            <div style={entryDateStyles}>Summer 2022</div>
          </div>
          <div>Summer Associate, Corporate Department</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Worked on corporate transactions and regulatory compliance matters</li>
            <li style={listItemStyles}>Assisted with pro bono asylum cases and housing rights advocacy</li>
            <li style={listItemStyles}>Drafted legal memoranda and due diligence reports for M&A transactions</li>
            <li style={listItemStyles}>Participated in client meetings and case strategy sessions</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Massachusetts Attorney General's Office</span>
              <span style={entryOrgStyles}>, Boston, MA</span>
            </div>
            <div style={entryDateStyles}>Summer 2021</div>
          </div>
          <div>Legal Intern, Civil Rights Division</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Researched civil rights violations and prepared legal briefs</li>
            <li style={listItemStyles}>Assisted in investigations of employment discrimination cases</li>
            <li style={listItemStyles}>Drafted policy recommendations for state legislation</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard Legal Aid Bureau</span>
              <span style={entryOrgStyles}>, Cambridge, MA</span>
            </div>
            <div style={entryDateStyles}>2022 - Present</div>
          </div>
          <div>Student Attorney, Family Law Practice</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Represented low-income clients in family court proceedings</li>
            <li style={listItemStyles}>Conducted client interviews and case preparation</li>
            <li style={listItemStyles}>Drafted legal documents and court filings</li>
          </ul>
        </div>
      </div>

      {/* Research & Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research & Publications</div>
        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>"Digital Privacy Rights in the Post-Snowden Era"</span>
            </div>
            <div style={entryDateStyles}>2024</div>
          </div>
          <div style={entryOrgStyles}>Harvard Law Review (Vol. 137, No. 3)</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Co-authored with Professor Sarah Chen; 15,000-word analysis of Fourth Amendment implications</li>
            <li style={listItemStyles}>Cited in 3 federal court decisions and 12 law review articles</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>"Constitutional Challenges to AI Regulation"</span>
            </div>
            <div style={entryDateStyles}>2023</div>
          </div>
          <div style={entryOrgStyles}>Yale Law Journal Online</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>First author publication examining constitutional implications of AI governance</li>
            <li style={listItemStyles}>Featured in New York Times and Wall Street Journal legal analysis</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>"The Future of Free Speech in Digital Spaces"</span>
            </div>
            <div style={entryDateStyles}>2023</div>
          </div>
          <div style={entryOrgStyles}>Stanford Law Review</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Presented at 5 national legal conferences</li>
            <li style={listItemStyles}>Adopted as reading material in 8 law school courses</li>
          </ul>
        </div>
      </div>

      {/* Leadership & Activities */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Leadership & Activities</div>
        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard Law Review</span>
            </div>
            <div style={entryDateStyles}>2022 - Present</div>
          </div>
          <div>Executive Editor (2023-2024), Staff Editor (2022-2023)</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead editorial team of 15 staff members in article selection and editing process</li>
            <li style={listItemStyles}>Oversee publication of 8 issues annually with 50+ articles</li>
            <li style={listItemStyles}>Manage relationships with leading legal scholars and practitioners</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Harvard Law School Student Government</span>
            </div>
            <div style={entryDateStyles}>2022 - Present</div>
          </div>
          <div>Vice President, Academic Affairs</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Represent student interests in curriculum development and academic policy</li>
            <li style={listItemStyles}>Organize academic events and speaker series with 200+ attendees</li>
            <li style={listItemStyles}>Manage $50,000 budget for student academic initiatives</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Constitutional Law Society</span>
            </div>
            <div style={entryDateStyles}>2021 - Present</div>
          </div>
          <div>President</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead organization of 150+ members focused on constitutional law education</li>
            <li style={listItemStyles}>Organize monthly debates and discussions on current constitutional issues</li>
            <li style={listItemStyles}>Host annual conference featuring Supreme Court justices and constitutional scholars</li>
          </ul>
        </div>
      </div>

      {/* Awards & Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Awards & Honors</div>
        <div style={entryStyles}>
          <ul style={listStyles}>
            <li style={listItemStyles}>Harvard Law School Dean's Scholar Prize in Constitutional Law (2024)</li>
            <li style={listItemStyles}>American Bar Association Law Student Division Award for Excellence (2023)</li>
            <li style={listItemStyles}>Harvard Legal Aid Bureau Pro Bono Service Award (2023)</li>
            <li style={listItemStyles}>Princeton University Senior Thesis Prize (2020)</li>
            <li style={listItemStyles}>Phi Beta Kappa Honor Society (2020)</li>
            <li style={listItemStyles}>Rhodes Scholarship Finalist (2019)</li>
            <li style={listItemStyles}>National Merit Scholar (2016)</li>
          </ul>
        </div>
      </div>

      {/* Volunteer Work */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Volunteer Work & Community Service</div>
        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Legal Aid Society of Massachusetts</span>
            </div>
            <div style={entryDateStyles}>2021 - Present</div>
          </div>
          <div>Volunteer Attorney</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Provide pro bono legal services to low-income individuals and families</li>
            <li style={listItemStyles}>Specialize in housing law, employment discrimination, and family law matters</li>
            <li style={listItemStyles}>Mentor junior volunteers and law students</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryGridStyles}>
            <div>
              <span style={entryTitleStyles}>Youth Legal Education Program</span>
            </div>
            <div style={entryDateStyles}>2020 - Present</div>
          </div>
          <div>Co-Founder & Director</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Founded program teaching legal literacy to high school students</li>
            <li style={listItemStyles}>Reached 500+ students across 15 schools in Massachusetts</li>
            <li style={listItemStyles}>Developed curriculum covering constitutional rights, criminal law, and civil rights</li>
          </ul>
        </div>
      </div>

      {/* Skills & Qualifications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Skills & Qualifications</div>
        <table style={skillsTableStyles}>
          <tbody>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Legal Research:</td>
              <td style={skillsTableCellStyles}>Westlaw, LexisNexis, Bloomberg Law, CourtLink, PACER, HeinOnline</td>
            </tr>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Legal Writing:</td>
              <td style={skillsTableCellStyles}>Brief Writing, Memo Drafting, Contract Analysis, Legal Research</td>
            </tr>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Certifications:</td>
              <td style={skillsTableCellStyles}>Certified in Legal Research & Writing, Bar Exam Preparation (Passed)</td>
            </tr>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Languages:</td>
              <td style={skillsTableCellStyles}>English (Native), Spanish (Professional), German (Conversational), French (Basic)</td>
            </tr>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Technology:</td>
              <td style={skillsTableCellStyles}>Microsoft Office, Legal Case Management Software, Document Review Platforms</td>
            </tr>
            <tr>
              <td style={{...skillsTableCellStyles, ...skillsTableFirstCellStyles}}>Interests:</td>
              <td style={skillsTableCellStyles}>Constitutional Law, Civil Rights, Technology Law, Legal Education, Public Service</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HarvardTemplate4;