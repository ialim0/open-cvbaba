import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faBuilding, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface AcademicTemplate3Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const AcademicTemplate3: React.FC<AcademicTemplate3Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 15;
  const basePadding = compact ? 4 : 30;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#1a1a1a',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: "'Computer Modern', 'Latin Modern', serif",
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 10 : 20) * scale}px`,
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    letterSpacing: `${(compact ? 0.2 : 0.5) * scale}px`,
    fontWeight: 'bold',
  };

  const titleStyles = {
    fontSize: `${(compact ? 7 : 14) * scale}px`,
    color: '#444',
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const contactInfoStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: `${(compact ? 2 : 10) * scale}px`,
    flexWrap: 'wrap' as const,
    fontSize: `${(compact ? 5 : 10) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 4 : 20) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 7 : 14) * scale}px`,
    color: '#1a1a1a',
    borderBottom: `1.5px solid #1a1a1a`,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
  };

  const entryInstitutionStyles = {
    fontStyle: 'italic',
  };

  const publicationStyles = {
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    paddingLeft: `${(compact ? 3 : 15) * scale}px`,
    textIndent: `${-(compact ? 3 : 15) * scale}px`,
  };

  const paperTitleStyles = {
    fontStyle: 'italic',
  };

  const journalStyles = {
    fontWeight: 'bold',
  };

  const authorsStyles = {
    color: '#444',
  };

  const metricsStyles = {
    color: '#666',
    fontSize: `${(compact ? 4 : 10) * scale}px`,
  };

  const grantStyles = {
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
  };

  const listStyles = {
    listStyleType: 'disc',
    marginLeft: `${(compact ? 3 : 15) * scale}px`,
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    display: 'list-item',
  };

  const researchInterestsStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: `${(compact ? 1 : 5) * scale}px`,
    marginTop: `${(compact ? 1 : 5) * scale}px`,
  };

  const interestTagStyles = {
    background: '#f0f0f0',
    padding: `${(compact ? 1 : 2) * scale}px ${(compact ? 2 : 6) * scale}px`,
    borderRadius: `${(compact ? 1 : 3) * scale}px`,
    fontSize: `${(compact ? 4 : 10) * scale}px`,
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
          <div style={nameStyles}>Dr. Sarah J. Anderson</div>
          <div style={titleStyles}>Research Scientist in Artificial Intelligence & Machine Learning</div>
          <div style={contactInfoStyles}>
            <span><FontAwesomeIcon icon={faEnvelope} className="text-black" /> s.anderson@university.edu</span>
            <span><FontAwesomeIcon icon={faGithub} className="text-black" /> github.com/sanderson</span>
            <span><FontAwesomeIcon icon={faPhone} className="text-black" /> (123) 456-7890</span>
            <span><FontAwesomeIcon icon={faBuilding} className="text-black" /> AI Lab, University of Technology</span>
            <span><FontAwesomeIcon icon={faChartBar} className="text-black" /> Google Scholar</span>
          </div>
        </div>

        {/* Research Interests */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Research Interests</div>
          <div style={researchInterestsStyles}>
            <span style={interestTagStyles}>Deep Learning</span>
            <span style={interestTagStyles}>Reinforcement Learning</span>
            <span style={interestTagStyles}>Computer Vision</span>
            <span style={interestTagStyles}>Natural Language Processing</span>
            <span style={interestTagStyles}>AI Safety</span>
            <span style={interestTagStyles}>Explainable AI</span>
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Ph.D. in Computer Science (AI)</span>
              <span>2018-2022</span>
            </div>
            <div style={entryInstitutionStyles}>Stanford University</div>
            <div>Thesis: "Advanced Architectures for Self-Supervised Learning in Computer Vision"</div>
          </div>
          
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>M.S. in Machine Learning</span>
              <span>2016-2018</span>
            </div>
            <div style={entryInstitutionStyles}>Carnegie Mellon University</div>
          </div>
        </div>

        {/* Selected Publications */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Selected Publications</div>
          <div style={publicationStyles}>
            <span style={authorsStyles}>Anderson, S., Smith, J., Johnson, M.</span> (2023). 
            <span style={paperTitleStyles}> "Self-Supervised Vision Transformers for Medical Image Analysis"</span>. 
            <span style={journalStyles}> NeurIPS</span>.
          </div>
          
          <div style={publicationStyles}>
            <span style={authorsStyles}>Anderson, S., Brown, R.</span> (2022). 
            <span style={paperTitleStyles}> "Towards Robust Deep Learning: A Bayesian Approach"</span>. 
            <span style={journalStyles}> ICML</span>.
          </div>
        </div>

        {/* Research Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Research Experience</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Research Scientist</span>
              <span>2022-Present</span>
            </div>
            <div style={entryInstitutionStyles}>Google AI Research</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Leading research on large-scale vision-language models.</li>
              <li style={listItemStyles}>Developed novel architecture for efficient multi-modal learning.</li>
              <li style={listItemStyles}>Published 5 papers in top-tier conferences.</li>
            </ul>
          </div>
        </div>

        {/* Grants & Funding */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Grants & Funding</div>
          <div style={grantStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>NSF Research Grant</span>
              <span>$500,000</span>
            </div>
            <div>"Advancing AI Safety through Robust Deep Learning" (2023-2025)</div>
          </div>
        </div>

        {/* Teaching & Mentorship */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Teaching & Mentorship</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Advanced Deep Learning (CS 4010)</span>
              <span>Fall 2022</span>
            </div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Developed curriculum for graduate-level deep learning course.</li>
              <li style={listItemStyles}>Supervised Ph.D. and Master's theses.</li>
            </ul>
          </div>
        </div>

        {/* Technical Skills */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Technical Skills</div>
          <ul style={listStyles}>
            <li style={listItemStyles}><strong>Programming:</strong> Python (PyTorch, TensorFlow), C++</li>
            <li style={listItemStyles}><strong>ML Frameworks:</strong> Transformers, Ray, MLflow</li>
            <li style={listItemStyles}><strong>Tools:</strong> Docker, Git, AWS, Google Cloud</li>
          </ul>
        </div>

        {/* Service & Leadership */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Service & Leadership</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Program Committee Member: NeurIPS, ICML, ICLR (2020-Present)</li>
            <li style={listItemStyles}>Reviewer: Journal of Machine Learning Research</li>
          </ul>
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
        <div style={nameStyles}>Dr. Sarah J. Anderson</div>
        <div style={titleStyles}>Research Scientist in Artificial Intelligence & Machine Learning</div>
        <div style={contactInfoStyles}>
          <span><FontAwesomeIcon icon={faEnvelope} className="text-black" /> s.anderson@university.edu</span>
          <span><FontAwesomeIcon icon={faGithub} className="text-black" /> github.com/sanderson</span>
          <span><FontAwesomeIcon icon={faPhone} className="text-black" /> (123) 456-7890</span>
          <span><FontAwesomeIcon icon={faBuilding} className="text-black" /> AI Lab, University of Technology</span>
          <span><FontAwesomeIcon icon={faChartBar} className="text-black" /> Google Scholar</span>
        </div>
      </div>

      {/* Research Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research Interests</div>
        <div style={researchInterestsStyles}>
          <span style={interestTagStyles}>Deep Learning</span>
          <span style={interestTagStyles}>Reinforcement Learning</span>
          <span style={interestTagStyles}>Computer Vision</span>
          <span style={interestTagStyles}>Natural Language Processing</span>
          <span style={interestTagStyles}>AI Safety</span>
          <span style={interestTagStyles}>Explainable AI</span>
          <span style={interestTagStyles}>Multimodal Learning</span>
          <span style={interestTagStyles}>Neural Architecture Search</span>
          <span style={interestTagStyles}>Federated Learning</span>
          <span style={interestTagStyles}>Adversarial Robustness</span>
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Ph.D. in Computer Science (AI)</span>
            <span>2018-2022</span>
          </div>
          <div style={entryInstitutionStyles}>Stanford University, Stanford, CA</div>
          <div>Thesis: "Advanced Architectures for Self-Supervised Learning in Computer Vision"</div>
          <div>Advisor: Professor Andrew Ng; GPA: 3.95/4.00</div>
        </div>
        
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>M.S. in Machine Learning</span>
            <span>2016-2018</span>
          </div>
          <div style={entryInstitutionStyles}>Carnegie Mellon University, Pittsburgh, PA</div>
          <div>Focus: Deep Learning and Computer Vision; GPA: 3.92/4.00</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>B.S. in Computer Science, Summa Cum Laude</span>
            <span>2012-2016</span>
          </div>
          <div style={entryInstitutionStyles}>Massachusetts Institute of Technology, Cambridge, MA</div>
          <div>Minor: Mathematics; Phi Beta Kappa; GPA: 3.98/4.00</div>
        </div>
      </div>

      {/* Academic Appointments */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Academic Appointments</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Research Scientist</span>
            <span>2022-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Google AI Research, Mountain View, CA</div>
          <div>Leading research on large-scale vision-language models and multimodal learning</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Postdoctoral Researcher</span>
            <span>2021-2022</span>
          </div>
          <div style={entryInstitutionStyles}>Stanford AI Lab, Stanford, CA</div>
          <div>Research on self-supervised learning and computer vision applications</div>
        </div>
      </div>

      {/* Selected Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Selected Publications</div>
        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Smith, J., Johnson, M., Brown, K.</span> (2023). 
          <span style={paperTitleStyles}> "Self-Supervised Vision Transformers for Medical Image Analysis: A Comprehensive Study"</span>. 
          <span style={journalStyles}> NeurIPS</span>. 
          <span style={metricsStyles}>[Citations: 234, Impact Factor: 8.5]</span>
        </div>
        
        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Brown, R., Davis, L.</span> (2022). 
          <span style={paperTitleStyles}> "Towards Robust Deep Learning: A Bayesian Approach to Adversarial Defense"</span>. 
          <span style={journalStyles}> ICML</span>. 
          <span style={metricsStyles}>[Citations: 156, Impact Factor: 7.2]</span>
        </div>

        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Wilson, T., Garcia, M.</span> (2022). 
          <span style={paperTitleStyles}> "Multimodal Learning with Vision-Language Transformers: A Survey"</span>. 
          <span style={journalStyles}> Journal of Machine Learning Research</span>. 
          <span style={metricsStyles}>[Citations: 89, Impact Factor: 6.8]</span>
        </div>

        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Lee, H., Chen, X.</span> (2021). 
          <span style={paperTitleStyles}> "Neural Architecture Search for Efficient Computer Vision Models"</span>. 
          <span style={journalStyles}> ICLR</span>. 
          <span style={metricsStyles}>[Citations: 67, Impact Factor: 5.9]</span>
        </div>

        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Taylor, R., Martinez, A.</span> (2021). 
          <span style={paperTitleStyles}> "Federated Learning for Privacy-Preserving AI: Challenges and Solutions"</span>. 
          <span style={journalStyles}> AAAI</span>. 
          <span style={metricsStyles}>[Citations: 45, Impact Factor: 4.2]</span>
        </div>

        <div style={publicationStyles}>
          <span style={authorsStyles}>Anderson, S., Thompson, P., White, S.</span> (2020). 
          <span style={paperTitleStyles}> "Explainable AI for Medical Diagnosis: A Deep Learning Approach"</span>. 
          <span style={journalStyles}> Nature Machine Intelligence</span>. 
          <span style={metricsStyles}>[Citations: 123, Impact Factor: 9.8]</span>
        </div>
      </div>

      {/* Research Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research Experience</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Research Scientist</span>
            <span>2022-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Google AI Research, Mountain View, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Leading research on large-scale vision-language models with 1B+ parameters, achieving state-of-the-art performance on 15+ benchmarks.</li>
            <li style={listItemStyles}>Developed novel architecture for efficient multi-modal learning, reducing computational cost by 40% while maintaining accuracy.</li>
            <li style={listItemStyles}>Published 8 papers in top-tier conferences (NeurIPS, ICML, ICLR) with 500+ total citations.</li>
            <li style={listItemStyles}>Mentored 5 Ph.D. interns and 3 postdoctoral researchers, contributing to their career development.</li>
            <li style={listItemStyles}>Led collaboration with medical institutions to develop AI systems for radiology and pathology diagnosis.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Postdoctoral Researcher</span>
            <span>2021-2022</span>
          </div>
          <div style={entryInstitutionStyles}>Stanford AI Lab, Stanford, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Conducted research on self-supervised learning for computer vision applications in healthcare.</li>
            <li style={listItemStyles}>Developed novel contrastive learning methods that improved medical image classification by 15%.</li>
            <li style={listItemStyles}>Collaborated with Stanford Medical School on AI-powered diagnostic tools.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Graduate Research Assistant</span>
            <span>2018-2021</span>
          </div>
          <div style={entryInstitutionStyles}>Stanford University, Stanford, CA</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Conducted doctoral research on advanced architectures for self-supervised learning.</li>
            <li style={listItemStyles}>Developed novel neural network architectures that achieved state-of-the-art results on ImageNet.</li>
            <li style={listItemStyles}>Published 6 papers in top-tier conferences and journals during Ph.D. program.</li>
          </ul>
        </div>
      </div>

      {/* Grants & Funding */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Grants & Funding</div>
        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NSF Research Grant</span>
            <span>$500,000</span>
          </div>
          <div>"Advancing AI Safety through Robust Deep Learning" (2023-2025)</div>
          <div>Principal Investigator; Focus on developing robust AI systems for critical applications</div>
        </div>

        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Google Research Award</span>
            <span>$200,000</span>
          </div>
          <div>"Multimodal Learning for Healthcare Applications" (2022-2024)</div>
          <div>Co-Principal Investigator; Developing AI systems for medical image analysis</div>
        </div>

        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Stanford Graduate Fellowship</span>
            <span>$150,000</span>
          </div>
          <div>"Self-Supervised Learning for Computer Vision" (2018-2021)</div>
          <div>Full tuition and stipend for doctoral studies</div>
        </div>

        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Microsoft Research PhD Fellowship</span>
            <span>$100,000</span>
          </div>
          <div>"Explainable AI for Medical Diagnosis" (2020-2022)</div>
          <div>Highly competitive fellowship for outstanding Ph.D. students</div>
        </div>
      </div>

      {/* Teaching & Mentorship */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Teaching & Mentorship</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Advanced Deep Learning (CS 4010)</span>
            <span>Fall 2022</span>
          </div>
          <div style={entryInstitutionStyles}>University of Technology, Graduate Course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed comprehensive curriculum for graduate-level deep learning course covering modern architectures and applications.</li>
            <li style={listItemStyles}>Supervised 12 Ph.D. and Master's theses on topics including computer vision, NLP, and multimodal learning.</li>
            <li style={listItemStyles}>Received outstanding teaching evaluations (4.8/5.0 average) from 45 students.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Introduction to Machine Learning (CS 3010)</span>
            <span>Spring 2023</span>
          </div>
          <div style={entryInstitutionStyles}>University of Technology, Undergraduate Course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Taught fundamental concepts of machine learning to 80+ undergraduate students.</li>
            <li style={listItemStyles}>Designed hands-on programming assignments using PyTorch and TensorFlow.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Guest Lecturer</span>
            <span>2021-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Various Universities and Conferences</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Delivered invited lectures on "Self-Supervised Learning" and "AI Safety" at 10+ institutions.</li>
            <li style={listItemStyles}>Presented at major conferences including NeurIPS, ICML, and ICLR.</li>
          </ul>
        </div>
      </div>

      {/* Technical Skills */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Technical Skills</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Programming Languages:</strong> Python (Expert), C++ (Advanced), Julia (Intermediate), R (Intermediate)</li>
          <li style={listItemStyles}><strong>Deep Learning Frameworks:</strong> PyTorch (Expert), TensorFlow (Advanced), JAX (Advanced), Keras (Advanced)</li>
          <li style={listItemStyles}><strong>ML Libraries:</strong> Transformers, Ray, MLflow, Weights & Biases, Optuna, Scikit-learn</li>
          <li style={listItemStyles}><strong>Cloud Platforms:</strong> Google Cloud Platform (Expert), AWS (Advanced), Azure (Intermediate)</li>
          <li style={listItemStyles}><strong>Development Tools:</strong> Docker, Kubernetes, Git, Linux, VS Code, Jupyter</li>
          <li style={listItemStyles}><strong>Specialized Tools:</strong> CUDA, OpenMP, MPI, Slurm, Apache Spark</li>
        </ul>
      </div>

      {/* Service & Leadership */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Service & Leadership</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Program Committee Member:</strong> NeurIPS (2020-Present), ICML (2021-Present), ICLR (2022-Present), AAAI (2023-Present)</li>
          <li style={listItemStyles}><strong>Editorial Board:</strong> Journal of Machine Learning Research (2022-Present), IEEE Transactions on Pattern Analysis and Machine Intelligence (2023-Present)</li>
          <li style={listItemStyles}><strong>Conference Organization:</strong> Workshop Co-Chair, NeurIPS 2023; Area Chair, ICML 2023</li>
          <li style={listItemStyles}><strong>Reviewer:</strong> Nature Machine Intelligence, Science, Nature, IEEE TPAMI, IJCV</li>
          <li style={listItemStyles}><strong>Mentorship:</strong> Google AI Mentorship Program (2022-Present), Stanford Women in AI (2021-2022)</li>
          <li style={listItemStyles}><strong>Diversity & Inclusion:</strong> Co-founder, Women in AI Research (WAIAR) organization</li>
        </ul>
      </div>

      {/* Awards & Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Awards & Honors</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Google Research Excellence Award</strong> (2023) - Recognition for outstanding contributions to AI research</li>
          <li style={listItemStyles}><strong>Outstanding Paper Award, NeurIPS 2022</strong> - For work on self-supervised learning</li>
          <li style={listItemStyles}><strong>Microsoft Research PhD Fellowship</strong> (2020-2022) - Highly competitive fellowship for Ph.D. students</li>
          <li style={listItemStyles}><strong>Stanford Graduate Fellowship</strong> (2018-2021) - Full tuition and stipend for doctoral studies</li>
          <li style={listItemStyles}><strong>MIT Presidential Scholar</strong> (2012-2016) - Recognition for academic excellence</li>
          <li style={listItemStyles}><strong>Phi Beta Kappa</strong> (2015) - Inducted as junior for academic excellence</li>
        </ul>
      </div>

      {/* Professional Memberships */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Professional Memberships</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Association for Computing Machinery (ACM)</li>
          <li style={listItemStyles}>Institute of Electrical and Electronics Engineers (IEEE)</li>
          <li style={listItemStyles}>Association for the Advancement of Artificial Intelligence (AAAI)</li>
          <li style={listItemStyles}>Women in Machine Learning (WiML)</li>
          <li style={listItemStyles}>Black in AI</li>
        </ul>
      </div>
    </div>
  );
};

export default AcademicTemplate3;