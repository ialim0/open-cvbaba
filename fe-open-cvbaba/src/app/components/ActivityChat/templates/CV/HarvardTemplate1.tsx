import React from 'react';

interface HarvardTemplate1Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const HarvardTemplate1: React.FC<HarvardTemplate1Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Optimized styling like Jake template for better view experience
  const baseFontSize = compact ? 6 : 14;
  const basePadding = compact ? 2 : 10;
  const baseMargin = compact ? 1 : 10;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Garamond, serif',
    maxWidth: `${800 * scale}px`,
    margin: '0 auto',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 8 : 22) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: `${(compact ? 1 : 2) * scale}px`,
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 4 : 13) * scale}px`,
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 5 : 15) * scale}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    marginTop: `${(compact ? 2 : 12) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    paddingBottom: `${(compact ? 0.5 : 1) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 4 : 16) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
  };

  const entryOrgStyles = {
    fontStyle: 'italic',
  };

  const entryDateStyles = {
    textAlign: 'right' as const,
  };

  const entryLocationStyles = {
    fontStyle: 'italic',
  };

  const listStyles = {
    marginTop: `${(compact ? 1 : 3) * scale}px`,
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    paddingLeft: `${(compact ? 6 : 30) * scale}px`,
    listStyleType: 'disc',
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    display: 'list-item',
  };

  const skillsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${(compact ? 2 : 8) * scale}px`,
  };

  if (compact) {
    return (
      <div style={scaledStyles} className={className}>
        {/* Header */}
        <div style={headerStyles}>
          <div style={nameStyles}>Dr. Alexandra Chen</div>
          <div style={contactInfoStyles}>
            123 Harvard Yard • Cambridge, MA 02138 • (617) 555-0123 • alexandra.chen@harvard.edu • linkedin.com/in/alexandrachen
          </div>
        </div>

        {/* Education */}
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard University</span>
            <span style={entryDateStyles}>2020-2024</span>
          </div>
          <div style={entryOrgStyles}>Ph.D. in Economics, Behavioral Finance | GPA: 3.95/4.00</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Dissertation: "Market Anomalies and Investor Behavior: A Machine Learning Approach"</li>
            <li style={listItemStyles}>Advisor: Professor Robert Merton, Nobel Laureate</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>MIT</span>
            <span style={entryDateStyles}>2018-2020</span>
          </div>
          <div style={entryOrgStyles}>M.S. Computer Science, AI Specialization | GPA: 3.89/4.00</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Stanford University</span>
            <span style={entryDateStyles}>2014-2018</span>
          </div>
          <div style={entryOrgStyles}>B.S. Mathematics, Statistics Minor | GPA: 3.91/4.00</div>
        </div>

        {/* Professional Experience */}
        <div style={sectionTitleStyles}>Professional Experience</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Goldman Sachs</span>
            <span style={entryDateStyles}>2023-Present</span>
          </div>
          <div style={entryOrgStyles}>Quantitative Research Analyst | New York, NY</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed ML models for trading strategies, increasing returns by 23%</li>
            <li style={listItemStyles}>Led team of 5 analysts building risk algorithms for $2B+ portfolio</li>
            <li style={listItemStyles}>M&A analysis totaling $1.2B+ in deal value</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>McKinsey & Company</span>
            <span style={entryDateStyles}>Summer 2022</span>
          </div>
          <div style={entryOrgStyles}>Summer Associate | Boston, MA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Led digital transformation strategy identifying $50M+ cost savings</li>
            <li style={listItemStyles}>Developed fintech market analysis framework</li>
            <li style={listItemStyles}>Presented strategic recommendations to C-suite executives</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard Economics</span>
            <span style={entryDateStyles}>2020-Present</span>
          </div>
          <div style={entryOrgStyles}>Graduate Research Assistant | Cambridge, MA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Co-authored 3 papers in top-tier economics journals</li>
            <li style={listItemStyles}>Presented at 5 international conferences (AEA, NBER)</li>
            <li style={listItemStyles}>Analyzed large-scale financial datasets using Python and R</li>
          </ul>
        </div>

        {/* Research & Publications */}
        <div style={sectionTitleStyles}>Research & Publications</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"ML Applications in Behavioral Finance"</span>
            <span style={entryDateStyles}>2024</span>
          </div>
          <div style={entryOrgStyles}>Journal of Financial Economics (IF: 8.2)</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Market Anomalies in Digital Age"</span>
            <span style={entryDateStyles}>2023</span>
          </div>
          <div style={entryOrgStyles}>Review of Financial Studies (IF: 7.8)</div>
        </div>

        {/* Leadership & Activities */}
        <div style={sectionTitleStyles}>Leadership & Activities</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard Investment Association</span>
            <span style={entryDateStyles}>2021-Present</span>
          </div>
          <div style={entryOrgStyles}>President</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead 25 analysts managing $250K student fund</li>
            <li style={listItemStyles}>Increased membership 150%, fund performance 35%</li>
            <li style={listItemStyles}>Organize monthly speaker series with Fortune 500 CEOs</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Women in Finance Initiative</span>
            <span style={entryDateStyles}>2020-Present</span>
          </div>
          <div style={entryOrgStyles}>Co-Founder & Director</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Founded org with 200+ members promoting gender diversity</li>
            <li style={listItemStyles}>Annual conference: 500+ attendees, 50+ speakers</li>
            <li style={listItemStyles}>Established mentorship program for 100+ students</li>
          </ul>
        </div>

        {/* Awards & Honors */}
        <div style={sectionTitleStyles}>Awards & Honors</div>
        <div style={entryStyles}>
          <ul style={listStyles}>
            <li style={listItemStyles}>Forbes 30 Under 30 in Finance (2024)</li>
            <li style={listItemStyles}>Harvard Graduate Student Excellence Award (2023)</li>
            <li style={listItemStyles}>Best Paper Award, AFA Annual Meeting (2023)</li>
            <li style={listItemStyles}>Goldman Sachs Excellence in Research Award (2023)</li>
          </ul>
        </div>

        {/* Skills */}
        <div style={sectionTitleStyles}>Skills</div>
        <div style={skillsGridStyles}>
          <div>
            <strong>Programming:</strong> Python, R, SQL, Java, C++, JavaScript, MATLAB
          </div>
          <div>
            <strong>ML/AI:</strong> TensorFlow, PyTorch, Scikit-learn, Keras, XGBoost
          </div>
          <div>
            <strong>Financial:</strong> Bloomberg Terminal, FactSet, Excel/VBA, Tableau
          </div>
          <div>
            <strong>Languages:</strong> English (Native), Mandarin (Fluent), Spanish (Conversational)
          </div>
          <div>
            <strong>Certifications:</strong> CFA Level II, FRM Part I, AWS ML
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={scaledStyles} className={className}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={nameStyles}>Dr. Alexandra Chen</div>
        <div style={contactInfoStyles}>
          123 Harvard Yard • Cambridge, MA 02138 • (617) 555-0123 • alexandra.chen@harvard.edu • linkedin.com/in/alexandrachen • github.com/alexandrachen
        </div>
      </div>

      {/* Education */}
      <div style={sectionTitleStyles}>Education</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Harvard University</span>
          <span style={entryDateStyles}>Sept 2020 - May 2024</span>
        </div>
        <div style={entryOrgStyles}>Ph.D. in Economics, Concentration in Behavioral Finance | GPA: 3.95/4.00</div>
        <div style={entryLocationStyles}>Cambridge, MA</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Dissertation: "Market Anomalies and Investor Behavior: A Machine Learning Approach"</li>
          <li style={listItemStyles}>Advisor: Professor Robert Merton, Nobel Laureate in Economic Sciences</li>
          <li style={listItemStyles}>Relevant Coursework: Advanced Econometrics, Financial Economics, Machine Learning, Behavioral Economics</li>
          <li style={listItemStyles}>Honors: Summa Cum Laude, Phi Beta Kappa, John Harvard Scholar, Dean's List (2020-2024)</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Massachusetts Institute of Technology</span>
          <span style={entryDateStyles}>Sept 2018 - May 2020</span>
        </div>
        <div style={entryOrgStyles}>Master of Science in Computer Science, Specialization in Artificial Intelligence | GPA: 3.89/4.00</div>
        <div style={entryLocationStyles}>Cambridge, MA</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Thesis: "Deep Learning Applications in Financial Risk Assessment"</li>
          <li style={listItemStyles}>Relevant Coursework: Machine Learning, Deep Learning, Natural Language Processing, Computer Vision</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Stanford University</span>
          <span style={entryDateStyles}>Sept 2014 - May 2018</span>
        </div>
        <div style={entryOrgStyles}>Bachelor of Science in Mathematics, Minor in Statistics | GPA: 3.91/4.00</div>
        <div style={entryLocationStyles}>Stanford, CA</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Honors: Magna Cum Laude, Phi Beta Kappa, Dean's List (2014-2018)</li>
          <li style={listItemStyles}>Relevant Coursework: Advanced Calculus, Linear Algebra, Probability Theory, Statistical Inference</li>
        </ul>
      </div>

      {/* Professional Experience */}
      <div style={sectionTitleStyles}>Professional Experience</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Goldman Sachs</span>
          <span style={entryDateStyles}>June 2023 - Present</span>
        </div>
        <div style={entryOrgStyles}>Quantitative Research Analyst</div>
        <div style={entryLocationStyles}>New York, NY</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed machine learning models for high-frequency trading strategies, increasing portfolio returns by 23%</li>
          <li style={listItemStyles}>Led team of 5 analysts in building proprietary risk assessment algorithms for $2B+ trading portfolio</li>
          <li style={listItemStyles}>Conducted financial analysis for M&A transactions totaling over $1.2B in deal value</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>McKinsey & Company</span>
          <span style={entryDateStyles}>June 2022 - August 2022</span>
        </div>
        <div style={entryOrgStyles}>Summer Associate</div>
        <div style={entryLocationStyles}>Boston, MA</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Led digital transformation strategy for Fortune 500 financial services client, identifying $50M+ in cost savings</li>
          <li style={listItemStyles}>Developed comprehensive market analysis framework for fintech sector expansion</li>
          <li style={listItemStyles}>Collaborated with senior partners to present strategic recommendations to client board</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Harvard Economics Department</span>
          <span style={entryDateStyles}>Sept 2020 - Present</span>
        </div>
        <div style={entryOrgStyles}>Graduate Research Assistant</div>
        <div style={entryLocationStyles}>Cambridge, MA</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Assist Professor Merton with groundbreaking research on behavioral economics and market efficiency</li>
          <li style={listItemStyles}>Analyze large-scale financial datasets using Python, R, and SQL to identify market patterns</li>
          <li style={listItemStyles}>Co-authored 3 peer-reviewed papers published in top-tier economics journals</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>JP Morgan Chase</span>
          <span style={entryDateStyles}>June 2021 - August 2021</span>
        </div>
        <div style={entryOrgStyles}>Investment Banking Summer Analyst</div>
        <div style={entryLocationStyles}>New York, NY</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Supported M&A transactions in technology sector with combined value exceeding $800M</li>
          <li style={listItemStyles}>Built comprehensive financial models and valuation analyses for client presentations</li>
          <li style={listItemStyles}>Conducted due diligence and market research for potential acquisition targets</li>
        </ul>
      </div>

      {/* Research & Publications */}
      <div style={sectionTitleStyles}>Research & Publications</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>"Machine Learning Applications in Behavioral Finance"</span>
          <span style={entryDateStyles}>2024</span>
        </div>
        <div style={entryOrgStyles}>Journal of Financial Economics (Impact Factor: 8.2)</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>First author publication examining how AI can predict investor behavior patterns</li>
          <li style={listItemStyles}>Cited 45+ times within 6 months of publication</li>
          <li style={listItemStyles}>Featured in Wall Street Journal and Financial Times</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>"Market Anomalies in the Digital Age"</span>
          <span style={entryDateStyles}>2023</span>
        </div>
        <div style={entryOrgStyles}>Review of Financial Studies (Impact Factor: 7.8)</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Co-authored with Professor Merton, analyzing cryptocurrency market inefficiencies</li>
          <li style={listItemStyles}>Featured in Wall Street Journal and Financial Times</li>
          <li style={listItemStyles}>Presented at American Finance Association Annual Meeting</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>"Deep Learning for Risk Management"</span>
          <span style={entryDateStyles}>2023</span>
        </div>
        <div style={entryOrgStyles}>Journal of Risk and Financial Management</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Presented novel approach to credit risk assessment using neural networks</li>
          <li style={listItemStyles}>Adopted by 3 major financial institutions for pilot programs</li>
          <li style={listItemStyles}>Received Best Paper Award at Risk Management Conference</li>
        </ul>
      </div>

      {/* Projects */}
      <div style={sectionTitleStyles}>Notable Projects</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>AI-Powered Trading Algorithm</span>
          <span style={entryDateStyles}>2023</span>
        </div>
        <div style={entryOrgStyles}>Personal Project | Python, TensorFlow, Bloomberg API</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed machine learning algorithm that achieved 18% annual returns with 12% volatility</li>
          <li style={listItemStyles}>Implemented real-time data processing pipeline handling 1M+ data points daily</li>
          <li style={listItemStyles}>Open-sourced on GitHub with 500+ stars and 200+ forks</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Financial Literacy Mobile App</span>
          <span style={entryDateStyles}>2022</span>
        </div>
        <div style={entryOrgStyles}>Social Impact Project | React Native, Node.js, MongoDB</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Created educational app helping 10,000+ users improve financial decision-making</li>
          <li style={listItemStyles}>Featured in TechCrunch and Forbes for social impact</li>
          <li style={listItemStyles}>Partnered with 5 non-profit organizations for distribution</li>
        </ul>
      </div>

      {/* Leadership & Activities */}
      <div style={sectionTitleStyles}>Leadership & Activities</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Harvard Investment Association</span>
          <span style={entryDateStyles}>2021 - Present</span>
        </div>
        <div style={entryOrgStyles}>President</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Lead team of 25 analysts in managing $250,000 student investment fund</li>
          <li style={listItemStyles}>Organize monthly speaker series featuring Fortune 500 CEOs and hedge fund managers</li>
          <li style={listItemStyles}>Increased membership by 150% and fund performance by 35% during tenure</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Women in Finance Initiative</span>
          <span style={entryDateStyles}>2020 - Present</span>
        </div>
        <div style={entryOrgStyles}>Co-Founder & Director</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Founded organization promoting gender diversity in finance with 200+ members</li>
          <li style={listItemStyles}>Organized annual conference attracting 500+ attendees and 50+ industry speakers</li>
          <li style={listItemStyles}>Established mentorship program connecting 100+ students with industry professionals</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Harvard Graduate Economics Society</span>
          <span style={entryDateStyles}>2020 - 2022</span>
        </div>
        <div style={entryOrgStyles}>Vice President</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Coordinated academic seminars and networking events for 300+ graduate students</li>
          <li style={listItemStyles}>Managed $50,000 annual budget and 15-person executive board</li>
          <li style={listItemStyles}>Established partnerships with 10+ industry organizations for career development</li>
        </ul>
      </div>

      {/* Awards & Honors */}
      <div style={sectionTitleStyles}>Awards & Honors</div>
      <div style={entryStyles}>
        <ul style={listStyles}>
          <li style={listItemStyles}>Forbes 30 Under 30 in Finance (2024)</li>
          <li style={listItemStyles}>Harvard University Graduate Student Excellence Award (2023)</li>
          <li style={listItemStyles}>Best Paper Award, American Finance Association Annual Meeting (2023)</li>
          <li style={listItemStyles}>Goldman Sachs Excellence in Research Award (2023)</li>
          <li style={listItemStyles}>MIT Computer Science Outstanding Graduate Student Award (2020)</li>
          <li style={listItemStyles}>Stanford University Phi Beta Kappa (2018)</li>
          <li style={listItemStyles}>National Merit Scholar (2014)</li>
        </ul>
      </div>

      {/* Volunteer Work */}
      <div style={sectionTitleStyles}>Volunteer Work & Community Involvement</div>
      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Financial Literacy for All</span>
          <span style={entryDateStyles}>2021 - Present</span>
        </div>
        <div style={entryOrgStyles}>Volunteer Instructor</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Teach personal finance courses to underserved communities in Boston</li>
          <li style={listItemStyles}>Reached 500+ individuals through workshops and one-on-one counseling</li>
          <li style={listItemStyles}>Developed curriculum adopted by 5+ community organizations</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={entryHeaderStyles}>
          <span style={entryTitleStyles}>Harvard Square Homeless Shelter</span>
          <span style={entryDateStyles}>2020 - Present</span>
        </div>
        <div style={entryOrgStyles}>Volunteer Coordinator</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Coordinate weekly volunteer shifts for 50+ student volunteers</li>
          <li style={listItemStyles}>Organize fundraising events raising $25,000+ annually</li>
          <li style={listItemStyles}>Established partnerships with local businesses for food donations</li>
        </ul>
      </div>

      {/* Skills */}
      <div style={sectionTitleStyles}>Skills</div>
      <div style={skillsGridStyles}>
        <div>
          <strong>Programming Languages:</strong> Python, R, SQL, Java, C++, JavaScript, MATLAB
        </div>
        <div>
          <strong>Machine Learning:</strong> TensorFlow, PyTorch, Scikit-learn, Keras, XGBoost, Pandas, NumPy
        </div>
        <div>
          <strong>Financial Tools:</strong> Bloomberg Terminal, FactSet, Refinitiv, Excel/VBA, Tableau, Power BI
        </div>
        <div>
          <strong>Languages:</strong> English (Native), Mandarin (Fluent), Spanish (Conversational), French (Basic)
        </div>
        <div>
          <strong>Certifications:</strong> CFA Level II Candidate, FRM Part I, AWS Certified Machine Learning
        </div>
        <div>
          <strong>Soft Skills:</strong> Leadership, Public Speaking, Project Management, Cross-cultural Communication
        </div>
      </div>
    </div>
  );
};

export default HarvardTemplate1;