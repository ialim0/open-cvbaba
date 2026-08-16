import React from 'react';

interface HarvardTemplate3Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const HarvardTemplate3: React.FC<HarvardTemplate3Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 12;
  const basePadding = compact ? 4 : 40;
  const baseMargin = compact ? 2 : 25;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.5,
    color: '#1a1a1a',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    backgroundColor: '#fff',
    fontFamily: 'Baskerville, serif',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    borderBottom: '3px double #1a1a1a',
    paddingBottom: `${(compact ? 5 : 15) * scale}px`,
    marginBottom: `${(compact ? 8 : 25) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 28) * scale}px`,
    fontWeight: 'normal',
    textAlign: 'center' as const,
    letterSpacing: `${(compact ? 1 : 3) * scale}px`,
    marginBottom: `${(compact ? 2 : 12) * scale}px`,
  };

  const contactGridStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: `${(compact ? 5 : 11) * scale}px`,
    textAlign: 'center' as const,
    marginTop: `${(compact ? 2 : 15) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 4 : 25) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 6 : 16) * scale}px`,
    fontWeight: 'normal',
    letterSpacing: `${(compact ? 0.5 : 2) * scale}px`,
    textTransform: 'uppercase' as const,
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
    display: 'flex',
    alignItems: 'center',
  };

  const sectionTitleAfterStyles = {
    content: '""',
    flexGrow: 1,
    height: '1px',
    backgroundColor: '#1a1a1a',
    marginLeft: `${(compact ? 5 : 15) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 6 : 18) * scale}px`,
    paddingLeft: `${(compact ? 4 : 15) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
  };

  const entryOrgStyles = {
    fontStyle: 'italic',
  };

  const entryDateStyles = {
    fontStyle: 'normal',
  };

  const entryLocationStyles = {
    fontStyle: 'italic',
    color: '#444',
  };

  const listStyles = {
    listStyleType: 'square',
    marginLeft: `${(compact ? 8 : 20) * scale}px`,
    marginTop: `${(compact ? 3 : 8) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
    lineHeight: 1.4,
    display: 'list-item',
  };

  const skillsContainerStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: `${(compact ? 4 : 20) * scale}px`,
    marginTop: `${(compact ? 3 : 10) * scale}px`,
  };

  const skillCategoryStyles = {
    fontStyle: 'italic',
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
          <div style={nameStyles}>ALEXANDRA CHEN</div>
          <div style={contactGridStyles}>
            <span>chen.alexandra@harvard.edu</span>
            <span>+1 (617) 555-9876</span>
            <span>linkedin.com/in/alexandrachen</span>
            <span>Cambridge, MA 02138</span>
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Education
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Harvard Business School</span>
              <span style={entryDateStyles}>Expected May 2025</span>
            </div>
            <div style={entryOrgStyles}>Master of Business Administration</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Selected as Baker Scholar (top 5% of class); Leadership & Ethics Fellow</li>
              <li style={listItemStyles}>Co-President, Technology & Innovation Club; VP of Operations, Women in Business</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Stanford University</span>
              <span style={entryDateStyles}>May 2020</span>
            </div>
            <div style={entryOrgStyles}>B.S. in Computer Science, Minor in Economics</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>GPA: 3.94/4.00; Phi Beta Kappa; Department Honors</li>
            </ul>
          </div>
        </div>

        {/* Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Experience
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Microsoft</span>
              <span style={entryDateStyles}>2020 - 2023</span>
            </div>
            <div style={entryOrgStyles}>Product Manager, Azure AI</div>
            <div style={entryLocationStyles}>Redmond, WA</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Led development and launch of new AI service generating $50M in first-year revenue</li>
              <li style={listItemStyles}>Managed cross-functional team of 15 engineers, designers, and data scientists</li>
              <li style={listItemStyles}>Created product strategy and roadmap for enterprise AI solutions</li>
            </ul>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Apple</span>
              <span style={entryDateStyles}>Summer 2019</span>
            </div>
            <div style={entryOrgStyles}>Product Management Intern</div>
            <div style={entryLocationStyles}>Cupertino, CA</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Developed feature recommendations for iOS privacy settings used by 100M+ users</li>
              <li style={listItemStyles}>Conducted user research and competitive analysis for new security features</li>
            </ul>
          </div>
        </div>

        {/* Skills & Interests */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Skills & Interests
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={skillsContainerStyles}>
            <div>
              <span style={skillCategoryStyles}>Technical:</span><br />
              Python, SQL, AWS, Azure
            </div>
            <div>
              <span style={skillCategoryStyles}>Business:</span><br />
              Product Strategy, Analytics
            </div>
            <div>
              <span style={skillCategoryStyles}>Languages:</span><br />
              English, Mandarin (native)
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
        <div style={nameStyles}>ALEXANDRA CHEN</div>
        <div style={contactGridStyles}>
          <span>chen.alexandra@harvard.edu</span>
          <span>+1 (617) 555-9876</span>
          <span>linkedin.com/in/alexandrachen</span>
          <span>Cambridge, MA 02138</span>
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Education
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard Business School</span>
            <span style={entryDateStyles}>Expected May 2025</span>
          </div>
          <div style={entryOrgStyles}>Master of Business Administration, Concentration in Technology & Innovation</div>
          <div style={entryLocationStyles}>Cambridge, MA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Selected as Baker Scholar (top 5% of class); Leadership & Ethics Fellow; Dean's List</li>
            <li style={listItemStyles}>Co-President, Technology & Innovation Club; VP of Operations, Women in Business</li>
            <li style={listItemStyles}>Selected for Harvard Innovation Lab Fellowship; Venture Capital & Private Equity Club</li>
            <li style={listItemStyles}>Relevant Coursework: Digital Strategy, Venture Capital, Entrepreneurship, Global Strategy</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Stanford University</span>
            <span style={entryDateStyles}>May 2020</span>
          </div>
          <div style={entryOrgStyles}>B.S. in Computer Science, Minor in Economics | GPA: 3.94/4.00</div>
          <div style={entryLocationStyles}>Stanford, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Phi Beta Kappa; Department Honors; Tau Beta Pi Engineering Honor Society</li>
            <li style={listItemStyles}>Relevant Coursework: Machine Learning, Data Structures, Algorithms, Microeconomics, Macroeconomics</li>
            <li style={listItemStyles}>Senior Thesis: "AI-Driven Product Optimization in E-commerce Platforms"</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Massachusetts Institute of Technology</span>
            <span style={entryDateStyles}>May 2018</span>
          </div>
          <div style={entryOrgStyles}>B.S. in Mathematics, Minor in Statistics | GPA: 3.91/4.00</div>
          <div style={entryLocationStyles}>Cambridge, MA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Magna Cum Laude; Phi Beta Kappa; Putnam Competition Honorable Mention</li>
            <li style={listItemStyles}>Relevant Coursework: Advanced Calculus, Linear Algebra, Probability Theory, Statistical Inference</li>
          </ul>
        </div>
      </div>

      {/* Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Professional Experience
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Microsoft Corporation</span>
            <span style={entryDateStyles}>2020 - 2023</span>
          </div>
          <div style={entryOrgStyles}>Senior Product Manager, Azure AI & Machine Learning Platform</div>
          <div style={entryLocationStyles}>Redmond, WA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Led development and launch of Azure Cognitive Services, generating $150M+ in first-year revenue</li>
            <li style={listItemStyles}>Managed cross-functional team of 25 engineers, designers, data scientists, and researchers</li>
            <li style={listItemStyles}>Created comprehensive product strategy and 3-year roadmap for enterprise AI solutions</li>
            <li style={listItemStyles}>Established partnerships with 50+ Fortune 500 companies, driving 40% increase in enterprise adoption</li>
            <li style={listItemStyles}>Mentored 8 junior product managers and led product management training program</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Apple Inc.</span>
            <span style={entryDateStyles}>Summer 2019</span>
          </div>
          <div style={entryOrgStyles}>Product Management Intern, iOS Privacy & Security</div>
          <div style={entryLocationStyles}>Cupertino, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed feature recommendations for iOS privacy settings used by 500M+ users globally</li>
            <li style={listItemStyles}>Conducted extensive user research and competitive analysis for new security features</li>
            <li style={listItemStyles}>Presented findings to senior leadership, resulting in implementation of 3 new privacy features</li>
            <li style={listItemStyles}>Received "Outstanding Intern" award and full-time offer upon graduation</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>McKinsey & Company</span>
            <span style={entryDateStyles}>Summer 2018</span>
          </div>
          <div style={entryOrgStyles}>Business Analyst Intern, Technology Practice</div>
          <div style={entryLocationStyles}>San Francisco, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Led digital transformation strategy for Fortune 100 technology client, identifying $75M+ in cost savings</li>
            <li style={listItemStyles}>Developed comprehensive market analysis framework for emerging technology sectors</li>
            <li style={listItemStyles}>Collaborated with senior partners to present strategic recommendations to C-suite executives</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Goldman Sachs</span>
            <span style={entryDateStyles}>Summer 2017</span>
          </div>
          <div style={entryOrgStyles}>Technology Summer Analyst, Investment Banking Technology</div>
          <div style={entryLocationStyles}>New York, NY</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed automated trading algorithms for fixed income securities, improving efficiency by 30%</li>
            <li style={listItemStyles}>Built comprehensive risk assessment models using machine learning techniques</li>
            <li style={listItemStyles}>Presented technical solutions to managing directors and received return offer</li>
          </ul>
        </div>
      </div>

      {/* Research & Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Research & Publications
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"AI-Driven Product Optimization in E-commerce Platforms"</span>
            <span style={entryDateStyles}>2024</span>
          </div>
          <div style={entryOrgStyles}>Journal of Product Innovation Management (Impact Factor: 6.8)</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>First author publication examining machine learning applications in product management</li>
            <li style={listItemStyles}>Cited 85+ times within 8 months of publication</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"The Future of Enterprise AI: A Strategic Framework"</span>
            <span style={entryDateStyles}>2023</span>
          </div>
          <div style={entryOrgStyles}>Harvard Business Review</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Co-authored with Harvard Business School faculty, featured as cover story</li>
            <li style={listItemStyles}>Shared 50,000+ times on LinkedIn and social media platforms</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Machine Learning in Product Management: Best Practices"</span>
            <span style={entryDateStyles}>2023</span>
          </div>
          <div style={entryOrgStyles}>MIT Sloan Management Review</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Presented novel framework for integrating AI into product development lifecycle</li>
            <li style={listItemStyles}>Adopted by 20+ technology companies for internal training programs</li>
          </ul>
        </div>
      </div>

      {/* Notable Projects */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Notable Projects
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>AI-Powered Product Analytics Platform</span>
            <span style={entryDateStyles}>2023</span>
          </div>
          <div style={entryOrgStyles}>Personal Project | Python, TensorFlow, React, AWS</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed comprehensive analytics platform that increased product engagement by 35%</li>
            <li style={listItemStyles}>Implemented real-time data processing pipeline handling 10M+ events daily</li>
            <li style={listItemStyles}>Open-sourced on GitHub with 1,200+ stars and 400+ forks</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Women in Tech Mentorship Platform</span>
            <span style={entryDateStyles}>2022</span>
          </div>
          <div style={entryOrgStyles}>Social Impact Project | React Native, Node.js, MongoDB</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Created mentorship platform connecting 2,000+ women in technology</li>
            <li style={listItemStyles}>Featured in Forbes and TechCrunch for social impact</li>
            <li style={listItemStyles}>Partnered with 15+ technology companies for mentorship programs</li>
          </ul>
        </div>
      </div>

      {/* Leadership & Activities */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Leadership & Activities
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard Technology & Innovation Club</span>
            <span style={entryDateStyles}>2023 - Present</span>
          </div>
          <div style={entryOrgStyles}>Co-President</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Lead organization of 300+ members focused on technology entrepreneurship</li>
            <li style={listItemStyles}>Organize monthly speaker series featuring Fortune 500 CTOs and startup founders</li>
            <li style={listItemStyles}>Increased membership by 200% and event attendance by 150% during tenure</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Women in Business Association</span>
            <span style={entryDateStyles}>2023 - Present</span>
          </div>
          <div style={entryOrgStyles}>Vice President of Operations</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Manage $100,000 annual budget and 15-person executive board</li>
            <li style={listItemStyles}>Organize annual conference attracting 800+ attendees and 100+ industry speakers</li>
            <li style={listItemStyles}>Established mentorship program connecting 200+ students with industry professionals</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Harvard Innovation Lab</span>
            <span style={entryDateStyles}>2023 - Present</span>
          </div>
          <div style={entryOrgStyles}>Fellow & Startup Advisor</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Mentor 10+ early-stage technology startups in product strategy and development</li>
            <li style={listItemStyles}>Lead workshops on AI/ML applications in business and entrepreneurship</li>
          </ul>
        </div>
      </div>

      {/* Awards & Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Awards & Honors
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <ul style={listStyles}>
            <li style={listItemStyles}>Forbes 30 Under 30 in Technology (2024)</li>
            <li style={listItemStyles}>Harvard Business School Baker Scholar (2024)</li>
            <li style={listItemStyles}>Microsoft Excellence in Product Management Award (2023)</li>
            <li style={listItemStyles}>Apple Outstanding Intern Award (2019)</li>
            <li style={listItemStyles}>Stanford University Phi Beta Kappa (2020)</li>
            <li style={listItemStyles}>MIT Putnam Competition Honorable Mention (2018)</li>
            <li style={listItemStyles}>National Merit Scholar (2014)</li>
          </ul>
        </div>
      </div>

      {/* Volunteer Work */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Volunteer Work & Community Involvement
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Girls Who Code</span>
            <span style={entryDateStyles}>2021 - Present</span>
          </div>
          <div style={entryOrgStyles}>Volunteer Instructor & Mentor</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Teach programming and technology skills to underserved high school students</li>
            <li style={listItemStyles}>Mentored 50+ students, with 80% pursuing STEM degrees in college</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Tech for Good Initiative</span>
            <span style={entryDateStyles}>2020 - Present</span>
          </div>
          <div style={entryOrgStyles}>Co-Founder & Director</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Founded organization providing technology solutions to non-profit organizations</li>
            <li style={listItemStyles}>Led 20+ volunteer developers in building solutions for 15+ non-profits</li>
            <li style={listItemStyles}>Raised $100,000+ in funding and in-kind technology donations</li>
          </ul>
        </div>
      </div>

      {/* Skills & Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Skills & Interests
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={skillsContainerStyles}>
          <div>
            <span style={skillCategoryStyles}>Technical Skills:</span><br />
            Python, SQL, R, JavaScript, React, Node.js, AWS, Azure, GCP, Docker, Kubernetes, TensorFlow, PyTorch, Scikit-learn
          </div>
          <div>
            <span style={skillCategoryStyles}>Business Skills:</span><br />
            Product Strategy, Product Management, Business Analytics, Market Research, Competitive Analysis, Financial Modeling, Project Management
          </div>
          <div>
            <span style={skillCategoryStyles}>Languages:</span><br />
            English (Native), Mandarin (Fluent), Spanish (Conversational), French (Basic)
          </div>
          <div>
            <span style={skillCategoryStyles}>Certifications:</span><br />
            AWS Certified Solutions Architect, Google Cloud Professional Data Engineer, PMI Project Management Professional (PMP)
          </div>
          <div>
            <span style={skillCategoryStyles}>Interests:</span><br />
            Technology Innovation, Entrepreneurship, Women in Tech, Sustainable Technology, AI Ethics, Venture Capital
          </div>
          <div>
            <span style={skillCategoryStyles}>Soft Skills:</span><br />
            Leadership, Public Speaking, Cross-cultural Communication, Team Building, Strategic Thinking, Problem Solving
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvardTemplate3;