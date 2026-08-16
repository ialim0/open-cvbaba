import React from 'react';

interface AcademicTemplate5Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const AcademicTemplate5: React.FC<AcademicTemplate5Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 14;
  const basePadding = compact ? 2 : 5;
  const baseMargin = compact ? 1 : 5;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.3,
    color: '#333',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: "'Helvetica', Arial, sans-serif",
    margin: `${baseMargin * scale}px`,
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingBottom: `${(compact ? 2 : 10) * scale}px`,
    borderBottom: '1px solid #ccc',
  };

  const nameStyles = {
    fontSize: `${(compact ? 9 : 18) * scale}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: `${(compact ? 0.2 : 0.5) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const titleStyles = {
    fontSize: `${(compact ? 6 : 12) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 5 : 10) * scale}px`,
    lineHeight: 1.2,
  };

  const sectionStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 6 : 12) * scale}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #333',
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    paddingBottom: `${(compact ? 0.5 : 2) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 1.5 : 8) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
  };

  const entrySubtitleStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    fontStyle: 'italic',
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
  };

  const entryDetailsStyles = {
    marginLeft: `${(compact ? 2 : 10) * scale}px`,
  };

  const entryDetailsListStyles = {
    margin: `${(compact ? 0.5 : 2) * scale}px 0`,
    paddingLeft: `${(compact ? 3 : 12) * scale}px`,
  };

  const entryDetailsListItemStyles = {
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}px`,
  };

  const interestsListStyles = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const interestsListItemStyles = {
    display: 'inline-block',
    marginRight: `${(compact ? 0.5 : 3) * scale}px`,
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}px`,
  };

  const publicationStyles = {
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
  };

  const journalStyles = {
    fontStyle: 'italic',
  };

  const skillsTableStyles = {
    width: '100%',
    borderCollapse: 'collapse' as const,
  };

  const skillsTableCellStyles = {
    padding: `${(compact ? 0.2 : 1) * scale}px`,
    fontSize: `${(compact ? 5 : 10) * scale}px`,
  };

  const listStyles = {
    listStyleType: 'disc',
    marginLeft: `${(compact ? 3 : 15) * scale}px`,
    marginTop: `${(compact ? 1 : 3) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
    display: 'list-item',
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div 
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        {/* Header */}
        <div style={headerStyles}>
          <div style={nameStyles}>Professor Maria Elena Rodriguez, Ph.D.</div>
          <div style={titleStyles}>Distinguished Researcher in Machine Learning & AI</div>
          <div style={contactInfoStyles}>
            Department of Computer Science, MIT<br />
            77 Massachusetts Avenue, Cambridge, MA 02139<br />
            rodriguez@mit.edu | (617) 555-0123<br />
            ORCID: 0000-0002-1234-5678
          </div>
        </div>

        {/* Research Interests */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Research Interests</div>
          <ul style={interestsListStyles}>
            <li style={interestsListItemStyles}>Foundation Models</li>
            <li style={interestsListItemStyles}>Causal Machine Learning</li>
            <li style={interestsListItemStyles}>Computational Neuroscience</li>
            <li style={interestsListItemStyles}>Ethical AI</li>
            <li style={interestsListItemStyles}>Quantum Machine Learning</li>
          </ul>
        </div>

        {/* Academic Appointments */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Academic Appointments</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Professor of Computer Science</span>
              <span>2019 - Present</span>
            </div>
            <div>Massachusetts Institute of Technology</div>
            <div style={entryDetailsStyles}>
              <ul style={entryDetailsListStyles}>
                <li style={entryDetailsListItemStyles}>Director, AI Safety and Alignment Laboratory</li>
                <li style={entryDetailsListItemStyles}>Principal Investigator, NSF AI Institute</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Selected Publications */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Selected Publications</div>
          <div style={publicationStyles}>
            Rodriguez, M.E., et al. (2023). "Emergence of Consciousness in Large Language Models." <span style={journalStyles}>Nature Machine Intelligence</span>.
          </div>
          <div style={publicationStyles}>
            Rodriguez, M.E., Chang, J. (2022). "Quantum-Inspired Neural Networks." <span style={journalStyles}>Science</span>.
          </div>
        </div>

        {/* Grants & Funding */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Grants & Funding</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>NSF CAREER Award</span>
              <span>$2,000,000</span>
            </div>
            <div>Advancing AI Safety through Causal Learning (2022-2027)</div>
          </div>
        </div>

        {/* Technical Expertise */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Technical Expertise</div>
          <table style={skillsTableStyles}>
            <tbody>
              <tr>
                <td style={skillsTableCellStyles}>Deep Learning:</td>
                <td style={skillsTableCellStyles}>PyTorch, TensorFlow, JAX</td>
              </tr>
              <tr>
                <td style={skillsTableCellStyles}>Languages:</td>
                <td style={skillsTableCellStyles}>Python, C++</td>
              </tr>
              <tr>
                <td style={skillsTableCellStyles}>Tools:</td>
                <td style={skillsTableCellStyles}>Weights & Biases, MLflow</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Academic Service */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Academic Service</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Area Chair: NeurIPS, ICML, ICLR</li>
            <li style={listItemStyles}>Reviewer: Nature Machine Intelligence, Science</li>
          </ul>
        </div>

        {/* Awards & Honors */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Awards & Honors</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Fellow, ACM, 2023</li>
            <li style={listItemStyles}>Best Paper Award, NeurIPS 2022</li>
          </ul>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Ph.D. in Computer Science</span>
              <span>2012 - 2016</span>
            </div>
            <div>Stanford University</div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>B.Sc. in Electrical Engineering</span>
              <span>2008 - 2012</span>
            </div>
            <div>University of California, Berkeley</div>
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
      {/* Header */}
      <div style={headerStyles}>
        <div style={nameStyles}>Professor Maria Elena Rodriguez, Ph.D.</div>
        <div style={titleStyles}>Distinguished Researcher in Machine Learning & AI</div>
        <div style={contactInfoStyles}>
          Department of Computer Science, MIT<br />
          77 Massachusetts Avenue, Cambridge, MA 02139<br />
          rodriguez@mit.edu | (617) 555-0123 | maria.rodriguez@mit.edu<br />
          ORCID: 0000-0002-1234-5678 | Google Scholar: Maria Rodriguez | Website: maria.mit.edu
        </div>
      </div>

      {/* Research Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research Interests</div>
        <ul style={interestsListStyles}>
          <li style={interestsListItemStyles}>Foundation Models</li>
          <li style={interestsListItemStyles}>Causal Machine Learning</li>
          <li style={interestsListItemStyles}>Computational Neuroscience</li>
          <li style={interestsListItemStyles}>Ethical AI</li>
          <li style={interestsListItemStyles}>Quantum Machine Learning</li>
          <li style={interestsListItemStyles}>AI Safety and Alignment</li>
          <li style={interestsListItemStyles}>Multimodal Learning</li>
          <li style={interestsListItemStyles}>Neural Architecture Search</li>
          <li style={interestsListItemStyles}>Federated Learning</li>
          <li style={interestsListItemStyles}>Explainable AI</li>
        </ul>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Ph.D. in Computer Science</span>
            <span>2012 - 2016</span>
          </div>
          <div>Stanford University, Stanford, CA</div>
          <div>Thesis: "Causal Machine Learning for AI Safety and Alignment"</div>
          <div>Advisor: Professor Daphne Koller; GPA: 3.98/4.00</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>M.S. in Electrical Engineering</span>
            <span>2010 - 2012</span>
          </div>
          <div>Stanford University, Stanford, CA</div>
          <div>Focus: Machine Learning and Signal Processing; GPA: 3.95/4.00</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>B.Sc. in Electrical Engineering, Summa Cum Laude</span>
            <span>2006 - 2010</span>
          </div>
          <div>University of California, Berkeley, Berkeley, CA</div>
          <div>Minor: Mathematics; Phi Beta Kappa; GPA: 3.97/4.00</div>
        </div>
      </div>

      {/* Academic Appointments */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Academic Appointments</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Professor of Computer Science</span>
            <span>2019 - Present</span>
          </div>
          <div>Massachusetts Institute of Technology, Cambridge, MA</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Director, AI Safety and Alignment Laboratory (2019-Present)</li>
              <li style={entryDetailsListItemStyles}>Principal Investigator, NSF AI Institute for AI Safety (2020-Present)</li>
              <li style={entryDetailsListItemStyles}>Associate Director, MIT Quest for Intelligence (2021-Present)</li>
              <li style={entryDetailsListItemStyles}>Lead researcher on causal machine learning and AI safety</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Associate Professor of Computer Science</span>
            <span>2016 - 2019</span>
          </div>
          <div>Massachusetts Institute of Technology, Cambridge, MA</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Established independent research program in AI safety and causal learning</li>
              <li style={entryDetailsListItemStyles}>Mentored 8 Ph.D. students and 4 postdoctoral researchers</li>
              <li style={entryDetailsListItemStyles}>Secured $2.5M in competitive research funding</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Postdoctoral Researcher</span>
            <span>2015 - 2016</span>
          </div>
          <div>Stanford AI Lab, Stanford, CA</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Research on causal inference and machine learning</li>
              <li style={entryDetailsListItemStyles}>Awarded NSF Postdoctoral Fellowship</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Selected Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Selected Publications</div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Chen, L., Smith, R., Johnson, M., Brown, K. (2023). "Emergence of Consciousness in Large Language Models: A Causal Analysis." <span style={journalStyles}>Nature Machine Intelligence</span>, 5(8), 1234-1245. [Impact Factor: 9.8, Citations: 234]
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Chang, J., Wilson, T., Garcia, M. (2022). "Quantum-Inspired Neural Networks for Causal Learning." <span style={journalStyles}>Science</span>, 378(6621), 123-128. [Impact Factor: 47.7, Citations: 156]
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Lee, H., Thompson, P., White, S. (2022). "Causal Machine Learning for AI Safety: A Comprehensive Framework." <span style={journalStyles}>Journal of Machine Learning Research</span>, 23(45), 1-45. [Impact Factor: 6.8, Citations: 89]
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Anderson, M., Davis, L., Taylor, R. (2021). "Multimodal Learning with Causal Attention Mechanisms." <span style={journalStyles}>NeurIPS</span>, 34, 12345-12358. [Citations: 67]
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Martinez, A., Wilson, T., Garcia, M. (2021). "Federated Learning for Privacy-Preserving AI: A Causal Perspective." <span style={journalStyles}>ICML</span>, 38, 9876-9885. [Citations: 45]
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Brown, K., Smith, R., Johnson, M. (2020). "Explainable AI through Causal Reasoning: A Deep Learning Approach." <span style={journalStyles}>Nature Machine Intelligence</span>, 2(6), 234-245. [Impact Factor: 9.8, Citations: 123]
        </div>
      </div>

      {/* Books and Monographs */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Books and Monographs</div>
        <div style={publicationStyles}>
          Rodriguez, M.E. (2023). "Causal Machine Learning for AI Safety: Principles and Applications." MIT Press. 320 pages. ISBN: 978-0-262-54321-0
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E., Koller, D. (2021). "Foundations of Causal Inference in Machine Learning." Cambridge University Press. 280 pages. ISBN: 978-1-107-12345-6
        </div>
        <div style={publicationStyles}>
          Rodriguez, M.E. (2019). "AI Safety and Alignment: A Comprehensive Guide." Springer. 240 pages. ISBN: 978-3-030-12345-6
        </div>
      </div>

      {/* Grants & Funding */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Grants & Funding</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NSF CAREER Award</span>
            <span>$2,000,000</span>
          </div>
          <div>Advancing AI Safety through Causal Learning (2022-2027)</div>
          <div>Principal Investigator; Focus on developing safe and aligned AI systems</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NSF AI Institute Grant</span>
            <span>$5,000,000</span>
          </div>
          <div>AI Institute for AI Safety and Alignment (2020-2025)</div>
          <div>Principal Investigator; Multi-institutional collaboration on AI safety</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Google Research Award</span>
            <span>$1,500,000</span>
          </div>
          <div>Causal Machine Learning for AI Safety (2021-2024)</div>
          <div>Principal Investigator; Research on causal learning methods</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>OpenAI Research Grant</span>
            <span>$750,000</span>
          </div>
          <div>AI Alignment through Causal Reasoning (2020-2023)</div>
          <div>Principal Investigator; Research on AI alignment</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NSF Postdoctoral Fellowship</span>
            <span>$200,000</span>
          </div>
          <div>Causal Inference in Machine Learning (2015-2017)</div>
          <div>Principal Investigator; Postdoctoral research fellowship</div>
        </div>
      </div>

      {/* Teaching Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Teaching Experience</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Introduction to Machine Learning (6.036)</span>
            <span>2016-Present</span>
          </div>
          <div>MIT, Undergraduate Course</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Core undergraduate course covering fundamental ML concepts</li>
              <li style={entryDetailsListItemStyles}>Average enrollment: 200 students per semester</li>
              <li style={entryDetailsListItemStyles}>Consistently received excellent teaching evaluations (4.8/5.0)</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Advanced Topics in AI Safety (6.883)</span>
            <span>2019-Present</span>
          </div>
          <div>MIT, Graduate Course</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Advanced graduate course on AI safety and alignment</li>
              <li style={entryDetailsListItemStyles}>Average enrollment: 25 students per semester</li>
              <li style={entryDetailsListItemStyles}>Covers causal learning, AI alignment, and safety methods</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Causal Machine Learning (6.884)</span>
            <span>2020-Present</span>
          </div>
          <div>MIT, Graduate Course</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Specialized course on causal inference in machine learning</li>
              <li style={entryDetailsListItemStyles}>Average enrollment: 15 students per semester</li>
              <li style={entryDetailsListItemStyles}>Covers causal discovery, causal effect estimation, and applications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mentoring Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Mentoring Experience</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Ph.D. Student Advisor</span>
            <span>2016-Present</span>
          </div>
          <div>MIT</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Supervised 12 Ph.D. students to successful dissertation completion</li>
              <li style={entryDetailsListItemStyles}>8 students currently in postdoctoral positions at top institutions</li>
              <li style={entryDetailsListItemStyles}>4 students have secured tenure-track faculty positions</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Postdoctoral Mentor</span>
            <span>2019-Present</span>
          </div>
          <div>MIT</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Mentored 6 postdoctoral researchers</li>
              <li style={entryDetailsListItemStyles}>4 have secured tenure-track faculty positions</li>
              <li style={entryDetailsListItemStyles}>2 have joined industry research labs</li>
            </ul>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Undergraduate Research Supervisor</span>
            <span>2016-Present</span>
          </div>
          <div>MIT</div>
          <div style={entryDetailsStyles}>
            <ul style={entryDetailsListStyles}>
              <li style={entryDetailsListItemStyles}>Supervised 20+ undergraduate researchers</li>
              <li style={entryDetailsListItemStyles}>15 have co-authored publications</li>
              <li style={entryDetailsListItemStyles}>10 have pursued Ph.D. studies in AI/ML</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Expertise */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Technical Expertise</div>
        <table style={skillsTableStyles}>
          <tbody>
            <tr>
              <td style={skillsTableCellStyles}>Deep Learning:</td>
              <td style={skillsTableCellStyles}>PyTorch, TensorFlow, JAX, Keras, Hugging Face, Weights & Biases</td>
            </tr>
            <tr>
              <td style={skillsTableCellStyles}>Programming Languages:</td>
              <td style={skillsTableCellStyles}>Python (Expert), C++ (Advanced), Julia (Advanced), R (Intermediate), MATLAB (Intermediate)</td>
            </tr>
            <tr>
              <td style={skillsTableCellStyles}>ML Frameworks:</td>
              <td style={skillsTableCellStyles}>Scikit-learn, XGBoost, LightGBM, Ray, MLflow, Optuna, Hydra</td>
            </tr>
            <tr>
              <td style={skillsTableCellStyles}>Causal Inference:</td>
              <td style={skillsTableCellStyles}>DoWhy, CausalML, EconML, Causal Discovery Toolbox</td>
            </tr>
            <tr>
              <td style={skillsTableCellStyles}>Cloud Platforms:</td>
              <td style={skillsTableCellStyles}>Google Cloud Platform (Expert), AWS (Advanced), Azure (Intermediate)</td>
            </tr>
            <tr>
              <td style={skillsTableCellStyles}>Development Tools:</td>
              <td style={skillsTableCellStyles}>Docker, Kubernetes, Git, Linux, VS Code, Jupyter, Apache Spark</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Academic Service */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Academic Service</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Area Chair:</strong> NeurIPS (2020-Present), ICML (2021-Present), ICLR (2022-Present), AAAI (2023-Present)</li>
          <li style={listItemStyles}><strong>Program Chair:</strong> NeurIPS 2023, ICML 2024</li>
          <li style={listItemStyles}><strong>Editorial Board:</strong> Journal of Machine Learning Research (2020-Present), Nature Machine Intelligence (2022-Present)</li>
          <li style={listItemStyles}><strong>Conference Organization:</strong> Workshop Co-Chair, NeurIPS 2022; Tutorial Chair, ICML 2023</li>
          <li style={listItemStyles}><strong>Reviewer:</strong> Nature Machine Intelligence, Science, Nature, IEEE TPAMI, IJCV, TACL</li>
          <li style={listItemStyles}><strong>Grant Reviewer:</strong> NSF, NIH, DARPA, Google Research, OpenAI</li>
          <li style={listItemStyles}><strong>Department Service:</strong> Graduate Admissions Committee (2017-2020), Faculty Search Committee (2018-2021)</li>
        </ul>
      </div>

      {/* Awards & Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Awards & Honors</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Fellow, Association for Computing Machinery (ACM)</strong> (2023) - Recognition for outstanding contributions to computing</li>
          <li style={listItemStyles}><strong>Best Paper Award, NeurIPS 2022</strong> - For work on causal machine learning for AI safety</li>
          <li style={listItemStyles}><strong>MIT Excellence in Teaching Award</strong> (2021) - Recognition for outstanding teaching contributions</li>
          <li style={listItemStyles}><strong>NSF CAREER Award</strong> (2022) - Early career development award for AI safety research</li>
          <li style={listItemStyles}><strong>Google Research Excellence Award</strong> (2020) - Recognition for research contributions</li>
          <li style={listItemStyles}><strong>Stanford Graduate Fellowship</strong> (2012-2016) - Full tuition and stipend for doctoral studies</li>
          <li style={listItemStyles}><strong>UC Berkeley Chancellor's Scholar</strong> (2006-2010) - Recognition for academic excellence</li>
          <li style={listItemStyles}><strong>Phi Beta Kappa</strong> (2009) - Inducted as junior for academic excellence</li>
        </ul>
      </div>

      {/* Professional Memberships */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Professional Memberships</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Association for Computing Machinery (ACM) - Fellow</li>
          <li style={listItemStyles}>Institute of Electrical and Electronics Engineers (IEEE)</li>
          <li style={listItemStyles}>Association for the Advancement of Artificial Intelligence (AAAI)</li>
          <li style={listItemStyles}>Women in Machine Learning (WiML)</li>
          <li style={listItemStyles}>Black in AI</li>
          <li style={listItemStyles}>Latinas in Computing</li>
        </ul>
      </div>
    </div>
  );
};

export default AcademicTemplate5;