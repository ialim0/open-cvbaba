import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

interface FAANGTemplate2Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FAANGTemplate2: React.FC<FAANGTemplate2Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 7 : 12;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 15;
  
  const scaledStyles = {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
    color: '#2b2b2b',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const resumeStyles = {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'white',
    padding: `${basePadding * scale}px`,
  };

  const headerStyles = {
    padding: `${(compact ? 3 : 15) * scale}px ${(compact ? 3 : 15) * scale}px 0px`,
    textAlign: 'center' as const,
  };

  const nameSectionStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
  };

  const firstNameStyles = {
    color: '#aaaaaa',
    fontWeight: 300,
    fontSize: `${(compact ? 15 : 30) * scale}pt`,
    marginRight: `${(compact ? 1.5 : 7) * scale}px`,
  };

  const lastNameStyles = {
    color: '#2b2b2b',
    fontWeight: 300,
    fontSize: `${(compact ? 15 : 30) * scale}pt`,
  };

  const contactInfoStyles = {
    color: '#6A6A6A',
    fontSize: `${(compact ? 4.5 : 9) * scale}pt`,
    marginTop: `${(compact ? 1 : 3) * scale}px`,
    textAlign: 'center' as const,
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
  };

  const contactLinkStyles = {
    color: '#6A6A6A',
    textDecoration: 'none',
  };

  const dividerStyles = {
    height: `${(compact ? 0.2 : 0.4) * scale}pt`,
    backgroundColor: '#6A6A6A',
    margin: `${(compact ? 1 : 5) * scale}px 0 ${(compact ? 2 : 10) * scale}px`,
    width: '100%',
  };

  const lastUpdatedStyles = {
    color: '#666666',
    fontSize: `${(compact ? 3.5 : 7) * scale}pt`,
    textAlign: 'right' as const,
    marginRight: `${(compact ? 3 : 15) * scale}px`,
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 200,
  };

  const mainContentStyles = {
    display: 'flex',
    width: '100%',
  };

  const leftColumnStyles = {
    width: '38%',
    padding: `0 ${(compact ? 3 : 15) * scale}px`,
  };

  const rightColumnStyles = {
    width: '62%',
    padding: `0 ${(compact ? 3 : 15) * scale}px`,
  };

  const h2Styles = {
    color: '#6A6A6A',
    fontSize: `${(compact ? 6.5 : 13) * scale}pt`,
    fontWeight: 300,
    textTransform: 'uppercase' as const,
    letterSpacing: `${(compact ? 0.5 : 1) * scale}px`,
    marginBottom: `${(compact ? 1.5 : 6) * scale}px`,
    fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  };

  const sectionStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const educationItemStyles = {
    marginBottom: `${(compact ? 1.5 : 6) * scale}px`,
  };

  const schoolNameStyles = {
    fontWeight: 700,
    color: '#333333',
    fontSize: `${(compact ? 5.5 : 11) * scale}pt`,
    textTransform: 'uppercase' as const,
    fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
    display: 'inline-block',
  };

  const degreeStyles = {
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    color: '#333333',
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    fontWeight: 500,
    fontStyle: 'italic',
    display: 'inline-block',
  };

  const timePeriodStyles = {
    color: '#6A6A6A',
    fontSize: `${(compact ? 4.5 : 9) * scale}pt`,
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 500,
    display: 'block',
    marginTop: `${(compact ? 0.5 : 1) * scale}px`,
  };

  const descriptionStyles = {
    marginTop: `${(compact ? 1 : 3) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    color: '#2b2b2b',
  };

  const descriptionListStyles = {
    paddingLeft: `${(compact ? 3 : 13) * scale}px`,
    listStyleType: 'disc',
  };

  const descriptionListItemStyles = {
    marginBottom: `${(compact ? 0.5 : 1) * scale}pt`,
  };

  const linksStyles = {
    marginBottom: `${(compact ? 1 : 2) * scale}px`,
    color: '#2b2b2b',
    textDecoration: 'none',
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    display: 'block',
  };

  const linksHoverStyles = {
    textDecoration: 'underline',
  };

  const linksBoldStyles = {
    fontWeight: 700,
  };

  const subsectionTitleStyles = {
    fontSize: `${(compact ? 5.5 : 11) * scale}pt`,
    color: '#333333',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  };

  const coursesListStyles = {
    listStyleType: 'none',
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    color: '#2b2b2b',
    marginBottom: `${(compact ? 1.5 : 6) * scale}px`,
  };

  const awardItemStyles = {
    marginBottom: `${(compact ? 1 : 2) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
  };

  const awardsTableStyles = {
    width: '100%',
    borderSpacing: 0,
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    borderCollapse: 'separate' as const,
  };

  const awardsTableTrStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const awardsTableTdStyles = {
    padding: `${(compact ? 1 : 2) * scale}px 0`,
  };

  const awardsTableTdFirstStyles = {
    width: `${(compact ? 15 : 30) * scale}px`,
    textAlign: 'right' as const,
    paddingRight: `${(compact ? 1.5 : 7) * scale}px`,
    color: '#2b2b2b',
  };

  const awardsTableTdSecondStyles = {
    width: `${(compact ? 30 : 60) * scale}px`,
    fontWeight: 'normal',
    color: '#2b2b2b',
  };

  const awardsTableTdThirdStyles = {
    color: '#2b2b2b',
  };

  const bulletStyles = {
    display: 'inline-block',
    margin: `0 ${(compact ? 1 : 3) * scale}px`,
  };

  const skillsCategoryStyles = {
    marginTop: `${(compact ? 1 : 2) * scale}px`,
    color: '#6A6A6A',
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    fontSize: `${(compact ? 4.5 : 9) * scale}pt`,
    fontWeight: 500,
  };

  const titleLineStyles = {
    display: 'flex',
    alignItems: 'baseline',
  };

  const companyNameStyles = {
    fontWeight: 700,
    color: '#333333',
    fontSize: `${(compact ? 5.5 : 11) * scale}pt`,
    textTransform: 'uppercase' as const,
    fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
    display: 'inline-block',
  };

  const jobTitleStyles = {
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    color: '#333333',
    fontSize: `${(compact ? 5 : 10) * scale}pt`,
    fontWeight: 500,
    fontStyle: 'italic',
    display: 'inline-block',
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        <div style={resumeStyles}>
        <header style={headerStyles}>
          <div style={nameSectionStyles}>
            <div style={firstNameStyles}>Debarghya</div>
            <div style={lastNameStyles}>Das</div>
          </div>
          <div style={contactInfoStyles}>
              <a href="http://debarghyadas.com" style={contactLinkStyles}>debarghyadas.com</a> | 
              <a href="http://fb.co/dd" style={contactLinkStyles}>fb.co/dd</a> | 
              <a href="mailto:debarghya@fb.com" style={contactLinkStyles}>debarghya@fb.com</a> | 
            607.379.5733 | 
              <a href="mailto:dd367@stanford.edu" style={contactLinkStyles}>dd367@stanford.edu</a>
            </div>
          </header>
          
          <div style={dividerStyles}></div>
          
          <div style={mainContentStyles}>
            <div style={leftColumnStyles}>
              <div style={sectionStyles}>
                <h2 style={h2Styles}>Education</h2>
                <div style={educationItemStyles}>
                  <div style={schoolNameStyles}>Stanford University</div>
                  <div style={degreeStyles}>MEng in Computer Science</div>
                  <div style={timePeriodStyles}>Dec 2024 | Stanford, CA</div>
                </div>
              </div>
            </div>
            
            <div style={rightColumnStyles}>
              <div style={sectionStyles}>
                <h2 style={h2Styles}>Experience</h2>
                <div style={educationItemStyles}>
                  <div style={titleLineStyles}>
                    <div style={companyNameStyles}>Meta</div>
                    <div style={jobTitleStyles}>&nbsp;| Software Engineer</div>
                  </div>
                  <div style={timePeriodStyles}>Jan 2025 - Present | Menlo Park, CA</div>
                </div>
              </div>
            </div>
          </div>
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
      <div style={resumeStyles}>
        <header style={headerStyles}>
            <div style={nameSectionStyles}>
              <div style={firstNameStyles}>Debarghya</div>
              <div style={lastNameStyles}>Das</div>
            </div>
            <div style={contactInfoStyles}>
              <a href="http://debarghyadas.com" style={contactLinkStyles}>debarghyadas.com</a> | 
              <a href="http://fb.co/dd" style={contactLinkStyles}>fb.co/dd</a> | 
              <a href="mailto:debarghya@fb.com" style={contactLinkStyles}>debarghya@fb.com</a> | 
              607.379.5733 | 
              <a href="mailto:dd367@stanford.edu" style={contactLinkStyles}>dd367@stanford.edu</a>
          </div>
        </header>
        
        <div style={dividerStyles}></div>
        
        <div style={mainContentStyles}>
          <div style={leftColumnStyles}>
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Education</h2>
              
              <div style={educationItemStyles}>
                <div style={schoolNameStyles}>Stanford University</div>
                <div style={degreeStyles}>MEng in Computer Science</div>
                <div style={timePeriodStyles}>Dec 2024 | Stanford, CA</div>
              </div>
              
              <div style={educationItemStyles}>
                <div style={schoolNameStyles}>Stanford University</div>
                <div style={degreeStyles}>BS in Computer Science</div>
                <div style={timePeriodStyles}>May 2024 | Stanford, CA</div>
                <div style={descriptionStyles}>
                  Magna Cum Laude, Cum. GPA: 3.83 / 4.0, Major GPA: 3.9 / 4.0
                </div>
              </div>
              
              <div style={educationItemStyles}>
                <div style={schoolNameStyles}>Phillips Academy Andover</div>
                <div style={timePeriodStyles}>Grad. May 2020 | Andover, MA</div>
              </div>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Links</h2>
              <div>
                <a href="https://facebook/dd" style={linksStyles}>Facebook:// <span style={linksBoldStyles}>dd</span></a>
                <a href="https://github.com/debarghyadas" style={linksStyles}>Github:// <span style={linksBoldStyles}>debarghyadas</span></a>
                <a href="https://www.linkedin.com/in/debarghyadas" style={linksStyles}>LinkedIn:// <span style={linksBoldStyles}>debarghyadas</span></a>
                <a href="https://twitter.com/debarghya_das" style={linksStyles}>Twitter:// <span style={linksBoldStyles}>@debarghya_das</span></a>
              </div>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Coursework</h2>
              <div style={subsectionTitleStyles}>Graduate</div>
              <ul style={coursesListStyles}>
                <li>Advanced Machine Learning</li>
                <li>Open Source Software Engineering</li>
                <li>Advanced Interactive Graphics</li>
                <li>Compilers</li>
                <li>Cloud Computing</li>
              </ul>
              
              <div style={subsectionTitleStyles}>Undergraduate</div>
              <ul style={coursesListStyles}>
                <li>Information Retrieval</li>
                <li>Operating Systems</li>
                <li>Artificial Intelligence</li>
                <li>Functional Programming</li>
                <li>Computer Networks</li>
                <li>Database Systems</li>
              </ul>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Skills</h2>
              <div style={subsectionTitleStyles}>Programming</div>
              <div style={skillsCategoryStyles}>Experienced:</div>
              <div style={coursesListStyles}>
                Java <span style={bulletStyles}>•</span> Shell <span style={bulletStyles}>•</span> Python <span style={bulletStyles}>•</span> Javascript<br />
                OCaml <span style={bulletStyles}>•</span> Matlab <span style={bulletStyles}>•</span> Rails <span style={bulletStyles}>•</span> LaTeX
              </div>
              
              <div style={skillsCategoryStyles}>Familiar:</div>
              <div style={coursesListStyles}>
                C <span style={bulletStyles}>•</span> C++ <span style={bulletStyles}>•</span> CSS <span style={bulletStyles}>•</span> PHP <span style={bulletStyles}>•</span> Assembly
              </div>
            </div>
          </div>
          
          <div style={rightColumnStyles}>
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Experience</h2>
              
              <div style={educationItemStyles}>
                <div style={titleLineStyles}>
                  <div style={companyNameStyles}>Meta</div>
                  <div style={jobTitleStyles}>&nbsp;| Software Engineer</div>
                </div>
                <div style={timePeriodStyles}>Jan 2025 - Present | Menlo Park, CA</div>
                <div style={descriptionStyles}>
                  <ul style={descriptionListStyles}>
                    <li style={descriptionListItemStyles}>Leading development of Instagram's core feed algorithm, serving 2B+ daily active users</li>
                    <li style={descriptionListItemStyles}>Optimized recommendation system using machine learning, increasing user engagement by 15%</li>
                    <li style={descriptionListItemStyles}>Built distributed systems handling 100K+ requests per second with 99.99% uptime</li>
                    <li style={descriptionListItemStyles}>Mentored 3 junior engineers and conducted technical interviews for new hires</li>
                  </ul>
                </div>
              </div>
              
              <div style={educationItemStyles}>
                <div style={titleLineStyles}>
                  <div style={companyNameStyles}>Coursera</div>
                  <div style={jobTitleStyles}>&nbsp;| KPCB Fellow + Software Engineering Intern</div>
                </div>
                <div style={timePeriodStyles}>June 2024 – Sep 2024 | Mountain View, CA</div>
                <div style={descriptionStyles}>
                  <ul style={descriptionListStyles}>
                    <li style={descriptionListItemStyles}>Selected as KPCB Fellow 2024 (52/2500 applicants).</li>
                    <li style={descriptionListItemStyles}>Led and shipped Yoda - the admin interface for the new Phoenix platform.</li>
                    <li style={descriptionListItemStyles}>Full-stack developer using JS (Backbone, Jade, Stylus, Require) and Scala (Play).</li>
                    <li style={descriptionListItemStyles}>Improved platform performance by 30% through code optimization and caching strategies</li>
                  </ul>
                </div>
              </div>
              
              <div style={educationItemStyles}>
                <div style={titleLineStyles}>
                  <div style={companyNameStyles}>Google</div>
                  <div style={jobTitleStyles}>&nbsp;| Software Engineering Intern</div>
                </div>
                <div style={timePeriodStyles}>May 2023 – Aug 2023 | Mountain View, CA</div>
                <div style={descriptionStyles}>
                  <ul style={descriptionListStyles}>
                    <li style={descriptionListItemStyles}>Worked on YouTube Captions, in Javascript and Python.</li>
                    <li style={descriptionListItemStyles}>Designed, developed, and shipped full stack features to add and edit Automatic Speech Recognition captions.</li>
                    <li style={descriptionListItemStyles}>Created a backbone.js-like framework for the Captions editor.</li>
                    <li style={descriptionListItemStyles}>Reduced caption processing time by 40% through algorithm optimization</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Research</h2>
              
              <div style={educationItemStyles}>
                <div style={titleLineStyles}>
                  <div style={companyNameStyles}>Stanford AI Lab</div>
                  <div style={jobTitleStyles}>&nbsp;| Researcher</div>
                </div>
                <div style={timePeriodStyles}>Jan 2024 – Jan 2025 | Stanford, CA</div>
                <div style={descriptionStyles}>
                  Created <span style={linksBoldStyles}>PlanIt</span>, a tool that learns from large-scale user preference feedback to plan robot trajectories in human environments.
                </div>
              </div>
              
              <div style={educationItemStyles}>
                <div style={titleLineStyles}>
                  <div style={companyNameStyles}>Stanford HCI Lab</div>
                  <div style={jobTitleStyles}>&nbsp;| Head Undergraduate Researcher</div>
                </div>
                <div style={timePeriodStyles}>Mar 2022 – May 2023 | Stanford, CA</div>
                <div style={descriptionStyles}>
                  Led the development of <span style={linksBoldStyles}>QuickTongue</span>, the first tongue-controlled game to aid in Linguistics research.
                </div>
              </div>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Awards</h2>
              <table style={awardsTableStyles}>
                <tbody>
                  <tr style={awardsTableTrStyles}>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdFirstStyles}}>2024</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdSecondStyles}}>top 52/2500</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdThirdStyles}}>KPCB Engineering Fellow</td>
                  </tr>
                  <tr style={awardsTableTrStyles}>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdFirstStyles}}>2024</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdSecondStyles}}>1<sup>st</sup>/50</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdThirdStyles}}>Microsoft Coding Competition</td>
                  </tr>
                  <tr style={awardsTableTrStyles}>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdFirstStyles}}>2023</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdSecondStyles}}>National</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdThirdStyles}}>Jump Trading Challenge Finalist</td>
                  </tr>
                  <tr style={awardsTableTrStyles}>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdFirstStyles}}>2021</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdSecondStyles}}>National</td>
                    <td style={{...awardsTableTdStyles, ...awardsTableTdThirdStyles}}>USA Computing Olympiad Finalist</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style={sectionStyles}>
              <h2 style={h2Styles}>Publications</h2>
              <div style={awardItemStyles}>
                <div>
                  A. Jain, A. Chen, et al., "PlanIt: A crowdsourcing approach to interactive trajectory planning for mobile robots", <i>ICRA</i>, May 2025.
                </div>
              </div>
              <div style={awardItemStyles}>
                <div>
                  S. Tilsen, A. Chen, et al., "Real-time articulatory biofeedback for speech sound disorders using ultrasound and electropalatography: QuickTongue", <i>Linguistics Vanguard</i>, Oct. 2025.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAANGTemplate2;