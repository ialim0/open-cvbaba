import React from 'react';

interface FAANGTemplate6Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FAANGTemplate6: React.FC<FAANGTemplate6Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 14;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 10;
  
  const scaledStyles = {
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    padding: `0 ${(compact ? 2 : 15) * scale}px`,
    maxWidth: `${900 * scale}px`,
    color: '#333',
    lineHeight: 1.4,
    fontSize: `${baseFontSize * scale}px`,
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    padding: `${(compact ? 3 : 20) * scale}px 0 ${(compact ? 2 : 15) * scale}px`,
    borderBottom: '1px solid #000',
  };

  const nameStyles = {
    fontSize: `${(compact ? 18 : 36) * scale}px`,
    margin: 0,
    fontWeight: 'normal',
  };

  const nameStrongStyles = {
    fontWeight: 'bold',
  };

  const contactInfoStyles = {
    margin: `${(compact ? 2 : 10) * scale}px 0`,
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const contactLinkStyles = {
    color: '#0366d6',
    textDecoration: 'none',
  };

  const contactIconStyles = {
    marginRight: `${(compact ? 1 : 3) * scale}px`,
    color: '#555',
  };

  const mainContentStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: `${(compact ? 2 : 10) * scale}px`,
    padding: `${(compact ? 2 : 10) * scale}px 0`,
  };

  const leftColumnStyles = {
    flex: 1,
    minWidth: `${300 * scale}px`,
    paddingRight: `${(compact ? 1 : 10) * scale}px`,
  };

  const rightColumnStyles = {
    flex: 1,
    minWidth: `${300 * scale}px`,
    paddingLeft: `${(compact ? 1 : 10) * scale}px`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 10 : 20) * scale}px`,
    margin: `${(compact ? 2 : 10) * scale}px 0 ${(compact ? 1 : 5) * scale}px`,
    textTransform: 'uppercase' as const,
    color: '#000',
    paddingBottom: `${(compact ? 0.5 : 2) * scale}px`,
    borderBottom: '1px solid #eaeaea',
  };

  const subsectionStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const subsectionTitleStyles = {
    fontWeight: 'bold',
    margin: `${(compact ? 1.5 : 6) * scale}px 0 ${(compact ? 1 : 4) * scale}px`,
    lineHeight: 1.3,
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const experienceHeaderStyles = {
    marginBottom: `${(compact ? 1 : 4) * scale}px`,
  };

  const companyStyles = {
    color: '#0366d6',
    fontWeight: 'bold',
  };

  const techStackStyles = {
    fontWeight: 'bold',
  };

  const positionInfoStyles = {
    fontStyle: 'italic',
    margin: `${(compact ? 1 : 4) * scale}px 0`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const listStyles = {
    margin: `${(compact ? 1.5 : 6) * scale}px 0`,
    paddingLeft: `${(compact ? 3 : 15) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1.5 : 6) * scale}px`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const skillsSectionStyles = {
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
  };

  const skillsCategoryStyles = {
    fontWeight: 'bold',
    marginRight: `${(compact ? 1 : 5) * scale}px`,
  };

  const educationItemStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const schoolNameStyles = {
    fontWeight: 'bold',
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const degreeStyles = {
    margin: `${(compact ? 1 : 4) * scale}px 0`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const gradDateStyles = {
    margin: `${(compact ? 1 : 4) * scale}px 0`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const courseworkListStyles = {
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: `${(compact ? 0.5 : 3) * scale}px`,
  };

  const courseworkListItemStyles = {
    display: 'inline',
    marginRight: `${(compact ? 1.5 : 8) * scale}px`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  const interestsListStyles = {
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: `${(compact ? 0.5 : 3) * scale}px`,
  };

  const interestsListItemStyles = {
    display: 'inline',
    marginRight: `${(compact ? 1.5 : 8) * scale}px`,
    fontSize: `${(compact ? 6.5 : 13) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        <div style={headerStyles}>
          <h1 style={nameStyles}>Sahil <strong style={nameStrongStyles}>Gaba</strong></h1>
          <div style={contactInfoStyles}>
            <i className="fas fa-phone" style={contactIconStyles}></i> XXX-XXX-XXXX | <i className="fas fa-envelope" style={contactIconStyles}></i> <a href="mailto:xxx@gmail.com" style={contactLinkStyles}>xxx@gmail.com</a> | <i className="fab fa-linkedin" style={contactIconStyles}></i> <a href="https://linkedin.com/in/gabag26" style={contactLinkStyles}>linkedin.com/in/gabag26</a>
          </div>
        </div>

        <div style={mainContentStyles}>
          <div style={leftColumnStyles}>
            <h2 style={sectionTitleStyles}>Skills</h2>
            <div style={skillsSectionStyles}>
              <div style={listItemStyles}><span style={skillsCategoryStyles}>BACK END:</span> Java • Python • Spring • Express • NodeJS</div>
              <div style={listItemStyles}><span style={skillsCategoryStyles}>FRONT END:</span> ReactJS • Redux • JavaScript • HTML • CSS</div>
            </div>

            <h2 style={sectionTitleStyles}>Experience</h2>
            <div style={subsectionStyles}>
              <div style={experienceHeaderStyles}>
                <span style={companyStyles}>AMAZON</span> | <span style={techStackStyles}>Java, Spring, Python, AWS</span>
              </div>
              <div style={positionInfoStyles}>Software Engineer | Jul 2019 – Present, Seattle, WA</div>
            </div>
          </div>

          <div style={rightColumnStyles}>
            <h2 style={sectionTitleStyles}>Education</h2>
            <div style={educationItemStyles}>
              <div style={schoolNameStyles}>UNIVERSITY OF ILLINOIS – URBANA CHAMPAIGN (UIUC)</div>
              <div style={degreeStyles}>M.S., Mechanical Engineering</div>
              <div style={gradDateStyles}>Dec 2016 | Urbana-Champaign, IL</div>
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
      <div style={headerStyles}>
        <h1 style={nameStyles}>Sahil <strong style={nameStrongStyles}>Gaba</strong></h1>
        <div style={contactInfoStyles}>
          <i className="fas fa-phone" style={contactIconStyles}></i> XXX-XXX-XXXX | <i className="fas fa-envelope" style={contactIconStyles}></i> <a href="mailto:xxx@gmail.com" style={contactLinkStyles}>xxx@gmail.com</a> | <i className="fab fa-linkedin" style={contactIconStyles}></i> <a href="https://linkedin.com/in/gabag26" style={contactLinkStyles}>linkedin.com/in/gabag26</a>
        </div>
      </div>

      <div style={mainContentStyles}>
        <div style={leftColumnStyles}>
          <h2 style={sectionTitleStyles}>Skills</h2>
          <div style={skillsSectionStyles}>
            <div style={listItemStyles}><span style={skillsCategoryStyles}>BACK END:</span> Java • Python • Spring • Express • NodeJS</div>
            <div style={listItemStyles}><span style={skillsCategoryStyles}>DATA PIPELINES:</span> Amazon Redshift • Amazon EFS • S3</div>
            <div style={listItemStyles}><span style={skillsCategoryStyles}>MISC:</span> Amazon AWS • Recommendations • Machine learning • MongoDB</div>
            <div style={listItemStyles}><span style={skillsCategoryStyles}>FRONT END:</span> ReactJS • Redux • JavaScript • HTML • CSS</div>
            <div style={listItemStyles}><span style={skillsCategoryStyles}>SOFT:</span> Team player • Bias for action • Deliver results</div>
          </div>

          <h2 style={sectionTitleStyles}>Experience</h2>
          <div style={subsectionStyles}>
            <div style={experienceHeaderStyles}>
              <span style={companyStyles}>AMAZON</span> |
              <span style={techStackStyles}> Java, Spring, Python, AWS, Machine Learning</span>
            </div>
            <div style={positionInfoStyles}>Software Engineer | Jul 2019 – Present, Seattle, WA</div>
            <div style={subsectionTitleStyles}>Amazon's Choice recommendations for incomplete missions</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Developed strategy to recommend Amazon's Choice items related to customer's incomplete missions.</li>
              <li style={listItemStyles}>Built data pipeline with Amazon Redshift and Amazon EFS to use offline data.</li>
            </ul>
            <div style={subsectionTitleStyles}>Personalized recommendations with Topic Modeling</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Implemented a recommendation feature in Java using topics and incomplete missions.</li>
              <li style={listItemStyles}>Built an extensible 'filters' module to remove Adult topics.</li>
            </ul>
            <div style={subsectionTitleStyles}>Complementary recommendations for Hardlines</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Developed algorithm using Collaborative Filtering to improve coverage of recommendations.</li>
              <li style={listItemStyles}>Created data pipeline using Amazon EFS, Amazon Distributed Data Service, and Amazon Distributed Job Service.</li>
              <li style={listItemStyles}>Implemented multiprocessing and LRU cache in Python to solve scalability challenges.</li>
            </ul>
          </div>

          <div style={subsectionStyles}>
            <div style={experienceHeaderStyles}>
              <span style={companyStyles}>FINTECH CORPORATION</span>
            </div>
            <div style={positionInfoStyles}>Software Engineer | Jan 2017 – Jun 2019, Chicago, IL</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Implemented Fidessa API for custom order management and execution.</li>
              <li style={listItemStyles}>Developed and tested regional solutions tailored for stock exchanges of Americas.</li>
            </ul>
          </div>
        </div>

        <div style={rightColumnStyles}>
          <h2 style={sectionTitleStyles}>Education</h2>
          <div style={educationItemStyles}>
            <div style={schoolNameStyles}>UNIVERSITY OF ILLINOIS – URBANA CHAMPAIGN (UIUC)</div>
            <div style={degreeStyles}>M.S., Mechanical Engineering</div>
            <div style={gradDateStyles}>Dec 2016 | Urbana-Champaign, IL</div>
          </div>

          <div style={educationItemStyles}>
            <div style={schoolNameStyles}>INDIAN INSTITUTE OF TECHNOLOGY DELHI (IITD)</div>
            <div style={degreeStyles}>B.S., Mechanical Engineering</div>
            <div style={gradDateStyles}>May 2014 | New Delhi, India</div>
          </div>

          <h2 style={sectionTitleStyles}>Honors & Awards</h2>
          <div style={subsectionStyles}>
            <div style={subsectionTitleStyles}>CHARPAK SCHOLARSHIP</div>
            <div style={listItemStyles}>For top exchange students from India | French Embassy | 2012</div>
          </div>
          <div style={subsectionStyles}>
            <div style={subsectionTitleStyles}>DIRECTORS MERIT AWARD</div>
            <div style={listItemStyles}>For top students | IIT Delhi | 2011</div>
          </div>
          <div style={subsectionStyles}>
            <div style={subsectionTitleStyles}>K. VASUDEVAN AWARD</div>
            <div style={listItemStyles}>For topping the institute | IIT Delhi | 2011</div>
          </div>

          <h2 style={sectionTitleStyles}>Coursework</h2>
          <ul style={courseworkListStyles}>
            <li style={courseworkListItemStyles}>Data Structures</li>
            <li style={courseworkListItemStyles}>Machine Learning</li>
            <li style={courseworkListItemStyles}>Data Mining</li>
            <li style={courseworkListItemStyles}>Statistics</li>
          </ul>

          <h2 style={sectionTitleStyles}>Interests</h2>
          <ul style={interestsListStyles}>
            <li style={interestsListItemStyles}>Travelling</li>
            <li style={interestsListItemStyles}>Fitness</li>
            <li style={interestsListItemStyles}>Food</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FAANGTemplate6;