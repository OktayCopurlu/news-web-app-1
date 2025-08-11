import { NewsArticle, NewsQuiz } from '../contexts/NewsContext';

export const mockNewsData = {
  articles: [
    {
      id: '1',
      title: 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
      summary: 'World leaders agree on ambitious targets to reduce global carbon emissions by 60% by 2030, marking a significant milestone in international climate cooperation.',
      content: `In a landmark decision that could reshape the global fight against climate change, representatives from 195 countries have reached a historic agreement at the Global Climate Summit in Geneva. The comprehensive accord establishes binding targets for carbon emission reductions, with participating nations committing to cut emissions by 60% from 2019 levels by 2030.

The agreement, dubbed the "Geneva Climate Compact," goes beyond previous international climate accords by including specific enforcement mechanisms and financial penalties for countries that fail to meet their targets. Under the new framework, developed nations will contribute $500 billion annually to a global climate fund, which will support clean energy transitions in developing countries.

Key provisions of the agreement include:
- Mandatory phase-out of coal-fired power plants by 2028
- International carbon pricing mechanism starting at $50 per ton
- Technology transfer requirements for renewable energy
- Biodiversity protection targets covering 40% of global land and ocean areas

Environmental scientists have praised the agreement as the most comprehensive climate action plan ever negotiated. Dr. Sarah Chen, lead climate researcher at the International Environmental Institute, noted that "this agreement provides the concrete framework we've been missing to address the climate crisis at the scale and speed required."

However, some critics argue that the targets, while ambitious, may still fall short of what's needed to limit global warming to 1.5°C above pre-industrial levels. Industry groups have expressed concerns about the economic impact of rapid decarbonization, particularly in heavy manufacturing and transportation sectors.

The agreement will be formally signed in six months, allowing time for national parliaments to ratify the accord. Implementation is scheduled to begin in January 2026, with quarterly progress reviews to ensure compliance.`,
      category: 'Environment',
      language: 'English',
      source: 'Global News Network',
      sourceUrl: 'https://example.com/climate-agreement',
      imageUrl: 'https://images.pexels.com/photos/3039036/pexels-photo-3039036.jpeg',
      publishedAt: '2024-12-28T10:30:00Z',
      readingTime: 4,
      bias: {
        score: 0.2,
        explanation: 'Slight positive bias toward the climate agreement. The article emphasizes benefits and expert support while briefly mentioning criticism.',
        sources: ['Global News Network', 'Reuters', 'Associated Press']
      },
      sentiment: {
        score: 0.7,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'Environmental Times',
          perspective: 'Strong support for the agreement, calling it "revolutionary"',
          bias: 0.8
        },
        {
          source: 'Business Daily',
          perspective: 'Concerned about economic impacts on industry',
          bias: -0.3
        },
        {
          source: 'Science Weekly',
          perspective: 'Analytical view focusing on technical feasibility',
          bias: 0.1
        }
      ],
      eli5Summary: 'Countries around the world made a big promise to pollute less and take better care of our planet. They agreed to work together and help each other use clean energy instead of dirty energy that hurts the environment.',
      audioSummary: {
        url: '/audio/climate-agreement-summary.mp3',
        duration: 180
      },
      relatedArticles: ['2', '3'],
      tags: ['climate change', 'environment', 'international relations', 'policy']
    },
    {
      id: '2',
      title: 'Revolutionary Breakthrough in Quantum Computing Achieves 99.9% Error Correction',
      summary: 'Scientists at MIT announce a major breakthrough in quantum error correction, bringing practical quantum computers significantly closer to reality.',
      content: `Researchers at the Massachusetts Institute of Technology have achieved a groundbreaking milestone in quantum computing, demonstrating a quantum error correction system with 99.9% accuracy. This breakthrough addresses one of the most significant challenges in building practical quantum computers and could accelerate the timeline for quantum supremacy in real-world applications.

The research team, led by Dr. Elena Rodriguez, developed a novel approach using topological qubits combined with machine learning algorithms to predict and correct quantum errors in real-time. Traditional quantum computers are extremely sensitive to environmental interference, with error rates that have historically made them unreliable for practical applications.

"We've essentially solved the noise problem that has plagued quantum computing for decades," explained Dr. Rodriguez. "Our system can maintain quantum coherence for up to 10 seconds, compared to the previous record of just milliseconds."

The implications of this breakthrough extend across multiple industries:

Cryptography and Security: Current encryption methods could become obsolete, necessitating new quantum-resistant security protocols. Financial institutions and governments are already preparing for this transition.

Drug Discovery: Quantum computers could simulate molecular interactions with unprecedented accuracy, potentially reducing drug development timelines from decades to years.

Artificial Intelligence: Quantum-enhanced machine learning could solve optimization problems that are currently intractable, leading to breakthroughs in everything from traffic management to supply chain optimization.

The research team demonstrated their system by factoring a 2048-bit number in just 20 seconds, a task that would take classical computers thousands of years. This capability has immediate implications for both cybersecurity threats and opportunities.

Major technology companies including IBM, Google, and Amazon have already expressed interest in licensing the technology. The team expects to have a commercially viable quantum computer prototype within 18 months.

However, experts caution that widespread adoption will still take years due to the specialized infrastructure required and the need for new programming paradigms. The quantum workforce shortage also presents a significant challenge for rapid deployment.`,
      category: 'Technology',
      language: 'English',
      source: 'Tech Today',
      sourceUrl: 'https://example.com/quantum-breakthrough',
      imageUrl: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg',
      publishedAt: '2024-12-28T08:15:00Z',
      readingTime: 5,
      bias: {
        score: 0.3,
        explanation: 'Generally positive coverage of the breakthrough with appropriate skepticism about challenges.',
        sources: ['Tech Today', 'Science Journal', 'MIT Press Release']
      },
      sentiment: {
        score: 0.8,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'TechCrunch',
          perspective: 'Highly optimistic about commercial applications',
          bias: 0.6
        },
        {
          source: 'IEEE Spectrum',
          perspective: 'Technical analysis focusing on limitations',
          bias: 0.0
        },
        {
          source: 'Wall Street Journal',
          perspective: 'Emphasis on investment and market implications',
          bias: 0.2
        }
      ],
      eli5Summary: 'Scientists built a super-smart computer that can solve really hard math problems super fast. It\'s like having a computer that can think in a magical way that regular computers can\'t!',
      audioSummary: {
        url: '/audio/quantum-breakthrough-summary.mp3',
        duration: 240
      },
      relatedArticles: ['1', '4'],
      tags: ['quantum computing', 'technology', 'science', 'breakthrough']
    },
    {
      id: '3',
      title: 'Central Bank Digital Currencies: 12 Countries Launch Pilot Programs',
      summary: 'A dozen nations including China, Sweden, and Nigeria begin testing their Central Bank Digital Currencies (CBDCs) in coordinated pilot programs.',
      content: `Twelve countries have simultaneously launched pilot programs for their Central Bank Digital Currencies (CBDCs), marking the largest coordinated test of digital national currencies in history. The initiative, coordinated by the Bank for International Settlements, aims to evaluate cross-border transactions and international monetary policy implications.

The participating countries include major economies such as China with its Digital Yuan, Sweden's e-krona, and Nigeria's eNaira, alongside smaller nations like the Bahamas, Eastern Caribbean states, and several European Union members testing the digital euro framework.

The six-month pilot program will test several key scenarios:

Cross-Border Payments: Instant settlement between countries without traditional correspondent banking networks, potentially reducing transaction costs by up to 80%.

Financial Inclusion: Providing banking services to unbanked populations through digital wallets accessible via basic mobile phones.

Monetary Policy Tools: Central banks will test new mechanisms for implementing interest rates and controlling money supply in real-time.

Privacy and Surveillance: Balancing transaction privacy with anti-money laundering and tax compliance requirements.

Early results from the Chinese pilot show promising adoption rates, with over 260 million digital wallets activated and $14 billion in transactions processed. Sweden's e-krona has demonstrated particularly strong performance in rural areas where traditional banking infrastructure is limited.

However, the pilot programs have also revealed significant challenges. Privacy advocates have raised concerns about the potential for unprecedented government surveillance of financial transactions. Some participants in Nigeria's eNaira pilot reported technical difficulties and confusion about the relationship between digital and physical currency.

The European Central Bank has taken a more cautious approach, emphasizing privacy protection and limiting transaction amounts during the testing phase. ECB President Christine Lagarde stated, "We must ensure that digital currencies serve the public interest while preserving the privacy and freedom that citizens expect."

Banking industry representatives have expressed mixed reactions. While some see CBDCs as an opportunity to modernize payment systems, others worry about disintermediation of commercial banks and the potential impact on credit markets.

The results of these pilot programs will likely influence global monetary policy for decades to come, as central banks worldwide watch to see which models prove most effective and popular with citizens.`,
      category: 'Finance',
      language: 'English',
      source: 'Financial Tribune',
      sourceUrl: 'https://example.com/cbdc-pilots',
      imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
      publishedAt: '2024-12-28T06:45:00Z',
      readingTime: 6,
      bias: {
        score: 0.1,
        explanation: 'Balanced reporting presenting both opportunities and concerns about CBDCs.',
        sources: ['Financial Tribune', 'Bank for International Settlements', 'Reuters']
      },
      sentiment: {
        score: 0.4,
        label: 'neutral'
      },
      coverageComparison: [
        {
          source: 'CoinDesk',
          perspective: 'Focuses on cryptocurrency implications and competition',
          bias: -0.2
        },
        {
          source: 'Central Banking Journal',
          perspective: 'Technical analysis of monetary policy tools',
          bias: 0.1
        },
        {
          source: 'Privacy International',
          perspective: 'Emphasizes surveillance and privacy concerns',
          bias: -0.4
        }
      ],
      eli5Summary: 'Some countries are trying out special digital money that works on phones and computers. It\'s like regular money but exists only on screens, and the government can see how it\'s used.',
      audioSummary: {
        url: '/audio/cbdc-pilot-summary.mp3',
        duration: 300
      },
      relatedArticles: ['1', '5'],
      tags: ['finance', 'digital currency', 'banking', 'technology']
    },
    {
      id: '4',
      title: 'SpaceX Successfully Tests Interplanetary Communication System',
      summary: 'SpaceX demonstrates real-time communication between Earth and Mars simulation, advancing plans for human missions to the Red Planet.',
      content: `SpaceX has successfully demonstrated its Interplanetary Internet system, achieving stable real-time communication with a Mars simulation facility located 400 million kilometers away using advanced relay satellites. The test represents a crucial milestone for future human missions to Mars and establishes the foundation for a solar system-wide communication network.

The demonstration involved transmitting high-definition video, audio, and data files between SpaceX's Hawthorne facility and a Mars analog station in Antarctica, with signals routed through a network of specialized satellites positioned at Lagrange points between Earth and Mars. The system maintained connection stability of 99.2% over a 72-hour testing period.

"This isn't just about Mars," explained SpaceX Communications Director Dr. James Patterson. "We're building the infrastructure for humanity's expansion throughout the solar system. Today's test proves we can maintain the digital connections that modern civilization depends on, regardless of planetary distances."

The Interplanetary Internet system addresses several critical challenges:

Signal Delay: Traditional radio communications with Mars involve delays of 4-24 minutes depending on planetary positions. The new system uses predictive protocols and local caching to enable near real-time interaction.

Data Integrity: Cosmic radiation and solar interference can corrupt signals over interplanetary distances. SpaceX's system employs quantum error correction and redundant transmission paths.

Bandwidth Optimization: The system prioritizes critical communications while buffering less urgent data during periods of poor connectivity.

Emergency Protocols: Automated systems can maintain basic operations even during extended communication blackouts.

The successful test builds on SpaceX's existing Starlink satellite constellation, which will serve as the Earth-based anchor for the interplanetary network. Plans call for deploying similar satellite networks around Mars, with the first constellation scheduled for launch in 2026.

NASA has announced its intention to integrate SpaceX's communication system into the Artemis program and future Mars missions. The agency estimates that reliable interplanetary communication could reduce mission costs by 30% while significantly improving crew safety.

Commercial applications are also emerging. Several companies have expressed interest in using the system for space-based manufacturing, asteroid mining operations, and luxury space tourism. The system could enable remote operation of equipment on Mars years before human arrival.

The technology also has implications for Earth-based applications. The signal processing and error correction algorithms developed for interplanetary communication are being adapted for quantum internet networks and secure government communications.`,
      category: 'Space',
      language: 'English',
      source: 'Space News Daily',
      sourceUrl: 'https://example.com/spacex-communication',
      imageUrl: 'https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg',
      publishedAt: '2024-12-27T22:20:00Z',
      readingTime: 5,
      bias: {
        score: 0.4,
        explanation: 'Positive coverage of SpaceX achievements with limited discussion of potential challenges or failures.',
        sources: ['Space News Daily', 'SpaceX Press Release', 'NASA Statement']
      },
      sentiment: {
        score: 0.9,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'Space.com',
          perspective: 'Technical focus on engineering achievements',
          bias: 0.3
        },
        {
          source: 'The Guardian',
          perspective: 'Questions about space militarization and cost',
          bias: -0.1
        },
        {
          source: 'Aviation Week',
          perspective: 'Industry analysis of commercial applications',
          bias: 0.2
        }
      ],
      eli5Summary: 'SpaceX figured out how to talk to spaceships really far away, even all the way to Mars! It\'s like having a super long phone call to another planet.',
      audioSummary: {
        url: '/audio/spacex-communication-summary.mp3',
        duration: 220
      },
      relatedArticles: ['2', '6'],
      tags: ['space exploration', 'technology', 'communication', 'Mars']
    },
    {
      id: '5',
      title: 'Artificial Intelligence Predicts Alzheimer\'s Disease 15 Years Before Symptoms',
      summary: 'New AI system can detect early signs of Alzheimer\'s from brain scans with 96% accuracy, potentially revolutionizing early intervention strategies.',
      content: `A revolutionary artificial intelligence system developed by researchers at Stanford University can predict Alzheimer's disease up to 15 years before the onset of clinical symptoms, achieving 96% accuracy in early detection. The breakthrough could transform how we approach neurodegenerative diseases and enable preventive treatments that could significantly delay or prevent cognitive decline.

The AI system, called NeuroPredict, analyzes subtle patterns in brain MRI scans that are invisible to human radiologists. By examining microscopic changes in brain structure, blood flow patterns, and neural connectivity, the system can identify the earliest signs of Alzheimer's pathology decades before memory loss begins.

Dr. Maria Gonzalez, lead researcher on the project, explained the significance: "We're essentially looking into the future of a patient's brain health. This gives us a 15-year window to intervene with lifestyle changes, medications, and therapies that could prevent or significantly delay Alzheimer's."

The research team trained NeuroPredict using brain scans from 50,000 participants tracked over 20 years, including 8,000 who eventually developed Alzheimer's. The AI identified specific biomarkers including:

- Microstructural changes in the hippocampus and entorhinal cortex
- Subtle alterations in white matter integrity
- Early signs of amyloid plaque formation
- Changes in cerebral blood flow patterns
- Disruptions in default mode network connectivity

Clinical trials are already underway to test early intervention strategies for patients identified by NeuroPredict. These include targeted cognitive training, precision nutrition plans, exercise protocols, and experimental drugs designed to prevent amyloid accumulation.

The technology has attracted significant investment, with pharmaceutical companies eager to test treatments on patients before irreversible brain damage occurs. Traditional Alzheimer's drug trials have largely failed because they begin after extensive neural damage has already occurred.

However, the technology also raises important ethical questions. Insurance companies could potentially use predictive information to deny coverage, and individuals might face psychological distress from knowing their future cognitive fate. Researchers are working with bioethicists to develop guidelines for responsible implementation.

The FDA has granted breakthrough device designation to NeuroPredict, accelerating the approval process. Clinical deployment could begin as early as 2026, initially in specialized memory clinics before expanding to general healthcare settings.

Beyond Alzheimer's, the research team is adapting the technology to predict other neurodegenerative conditions including Parkinson's disease, ALS, and frontotemporal dementia. Early results suggest similar predictive capabilities across multiple conditions.`,
      category: 'Health',
      language: 'English',
      source: 'Medical Research Weekly',
      sourceUrl: 'https://example.com/ai-alzheimers-prediction',
      imageUrl: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg',
      publishedAt: '2024-12-27T14:10:00Z',
      readingTime: 5,
      bias: {
        score: 0.5,
        explanation: 'Optimistic tone about AI breakthrough with limited discussion of potential limitations or false positives.',
        sources: ['Medical Research Weekly', 'Stanford University', 'Nature Medicine']
      },
      sentiment: {
        score: 0.6,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'New England Journal',
          perspective: 'Peer review focusing on study methodology',
          bias: 0.1
        },
        {
          source: 'Health Ethics Quarterly',
          perspective: 'Concerns about insurance discrimination and privacy',
          bias: -0.3
        },
        {
          source: 'AI Medical Times',
          perspective: 'Emphasis on technological achievement',
          bias: 0.7
        }
      ],
      eli5Summary: 'Smart computers can now look at pictures of brains and tell if someone might get sick with a memory disease many years before it happens. This helps doctors try to prevent the sickness.',
      audioSummary: {
        url: '/audio/alzheimers-ai-summary.mp3',
        duration: 270
      },
      relatedArticles: ['2', '7'],
      tags: ['artificial intelligence', 'healthcare', 'Alzheimer\'s', 'medical research']
    },
    {
      id: '6',
      title: 'Major Cybersecurity Breach Affects 50 Million Banking Customers Worldwide',
      summary: 'International cybercriminal group exploits vulnerability in cross-border payment systems, prompting emergency security measures across multiple countries.',
      content: `A sophisticated cyberattack has compromised the personal and financial data of over 50 million banking customers across 15 countries, marking one of the largest financial data breaches in history. The attack, attributed to the criminal group "Shadow Banking," exploited a previously unknown vulnerability in the SWIFT international payment messaging system.

The breach was discovered when unusual transaction patterns triggered automated security alerts at major banks in London, New York, and Hong Kong simultaneously. Forensic analysis revealed that attackers had been secretly accessing customer data for up to six months before detection.

Compromised information includes:
- Customer names, addresses, and phone numbers
- Account numbers and routing information
- Transaction histories dating back five years
- Credit scores and loan application data
- Investment portfolio details

The attack vector involved a zero-day exploit in SWIFT's messaging protocol, combined with social engineering to obtain authentication credentials from bank employees. Once inside the system, the attackers used advanced persistent threat techniques to move laterally through banking networks without detection.

"This represents a fundamental challenge to the global financial system," said cybersecurity expert Dr. Robert Kim. "The attackers demonstrated sophisticated knowledge of banking protocols and international financial regulations."

Affected institutions include major banks such as HSBC, Deutsche Bank, JPMorgan Chase, and several regional banks across Europe, Asia, and North America. All institutions have implemented emergency security measures including:

- Temporary suspension of international wire transfers
- Mandatory password resets for all online banking customers
- Enhanced two-factor authentication requirements
- 24/7 fraud monitoring for affected accounts

Regulators have responded swiftly to contain the damage. The Financial Stability Board has convened an emergency meeting to coordinate international response efforts. Several countries have activated cybersecurity emergency protocols, deploying government resources to assist affected banks.

The economic impact is already significant. Banking stocks have fallen an average of 8% since news of the breach became public. Customer confidence surveys show increased concern about digital banking security, with some customers reverting to cash transactions.

Law enforcement agencies from multiple countries are collaborating in the investigation. The FBI, Europol, and Interpol have established a joint task force to track down the Shadow Banking group, which is believed to operate from multiple jurisdictions.

This incident has renewed calls for stronger international cybersecurity standards and better coordination between financial institutions. Industry experts predict significant investments in quantum encryption and zero-trust security architectures in response to this breach.

Banks are now offering free credit monitoring services to affected customers and have established dedicated helplines to address concerns. Full restoration of normal banking operations is expected within two weeks, pending completion of security audits.`,
      category: 'Cybersecurity',
      language: 'English',
      source: 'Cyber Security Today',
      sourceUrl: 'https://example.com/banking-cyberattack',
      imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      publishedAt: '2024-12-27T16:30:00Z',
      readingTime: 6,
      bias: {
        score: -0.2,
        explanation: 'Slightly negative bias emphasizing the severity and impact of the breach.',
        sources: ['Cyber Security Today', 'Reuters', 'Financial Times']
      },
      sentiment: {
        score: -0.6,
        label: 'negative'
      },
      coverageComparison: [
        {
          source: 'Bank Technology News',
          perspective: 'Focus on technical solutions and industry response',
          bias: 0.2
        },
        {
          source: 'Privacy Rights Foundation',
          perspective: 'Emphasis on customer privacy violations',
          bias: -0.7
        },
        {
          source: 'Financial Stability Report',
          perspective: 'Regulatory and systemic risk analysis',
          bias: -0.1
        }
      ],
      eli5Summary: 'Bad people used computers to steal information from banks, like people\'s names and how much money they have. The banks are working hard to fix it and keep everyone\'s money safe.',
      audioSummary: {
        url: '/audio/cybersecurity-breach-summary.mp3',
        duration: 290
      },
      relatedArticles: ['3', '8'],
      tags: ['cybersecurity', 'banking', 'data breach', 'finance']
    },
    {
      id: '7',
      title: 'Gene Therapy Restores Vision in 89% of Blindness Trial Participants',
      summary: 'Groundbreaking clinical trial shows remarkable success in treating inherited blindness using CRISPR gene editing technology.',
      content: `A landmark clinical trial has demonstrated that CRISPR gene therapy can restore functional vision in 89% of participants with inherited blindness, offering hope to millions worldwide suffering from genetic vision disorders. The trial, conducted across 12 medical centers internationally, represents the largest successful application of gene editing to treat sensory disabilities.

The treatment targets Leber Congenital Amaurosis (LCA), a hereditary condition that causes severe vision loss or complete blindness from birth. LCA affects approximately 100,000 people worldwide and has previously had no effective treatment options.

The gene therapy works by directly editing DNA in retinal cells to correct the genetic mutations that cause LCA. Using a modified CRISPR-Cas9 system delivered through a specialized virus, researchers can precisely target and repair the defective genes responsible for photoreceptor function.

Dr. Sarah Chen, the trial's principal investigator, described the results as "beyond our most optimistic projections." Of the 156 trial participants:
- 89% showed significant vision improvement
- 67% achieved reading-level vision
- 34% reached normal or near-normal visual acuity
- 95% reported substantial improvement in quality of life

The treatment process involves a single injection directly into the eye, with genetic modifications taking effect over 3-6 months. Participants showed progressive vision improvement, with some able to see clearly for the first time in their lives.

"The moment I could see my daughter's face clearly was indescribable," said trial participant Maria Rodriguez, who had been blind since birth. "This technology has given me a life I never thought possible."

The success has broader implications for genetic medicine. The same CRISPR delivery system is being adapted to treat other inherited eye diseases including retinitis pigmentosa and Stargardt disease, which collectively affect over 2 million people globally.

Regulatory approval is expected within 18 months, with the FDA granting priority review status. The treatment is expected to cost approximately $450,000 per eye initially, though prices should decrease as production scales up.

However, the therapy is not without limitations. It only works for specific genetic variants of blindness and cannot restore vision in cases where the retinal structure is severely damaged. Additionally, long-term effects beyond five years are still being studied.

Ethical considerations include questions about genetic enhancement versus treatment. Some deaf and blind community advocates argue that these conditions are differences rather than disabilities requiring "correction."

The research team is now developing second-generation treatments that could address additional genetic variants and potentially prevent vision loss in high-risk individuals before symptoms develop.`,
      category: 'Health',
      language: 'English',
      source: 'Medical Breakthrough Journal',
      sourceUrl: 'https://example.com/gene-therapy-vision',
      imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
      publishedAt: '2024-12-27T12:00:00Z',
      readingTime: 5,
      bias: {
        score: 0.6,
        explanation: 'Highly positive coverage of medical breakthrough with limited discussion of ethical concerns or limitations.',
        sources: ['Medical Breakthrough Journal', 'Clinical Trial Data', 'FDA Reports']
      },
      sentiment: {
        score: 0.9,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'Nature Medicine',
          perspective: 'Peer-reviewed analysis of trial methodology',
          bias: 0.2
        },
        {
          source: 'Disability Rights Quarterly',
          perspective: 'Concerns about genetic enhancement implications',
          bias: -0.2
        },
        {
          source: 'Biotech Weekly',
          perspective: 'Investment and commercialization focus',
          bias: 0.5
        }
      ],
      eli5Summary: 'Scientists found a way to fix broken parts in people\'s eyes so they can see again. They use tiny tools to fix the instructions inside eye cells, like fixing a broken recipe.',
      audioSummary: {
        url: '/audio/gene-therapy-vision-summary.mp3',
        duration: 250
      },
      relatedArticles: ['5', '9'],
      tags: ['gene therapy', 'medical breakthrough', 'vision', 'CRISPR']
    },
    {
      id: '8',
      title: 'Global Food Crisis: Extreme Weather Destroys 30% of Wheat Harvest',
      summary: 'Unprecedented drought and flooding across major agricultural regions devastate global wheat production, triggering food security concerns worldwide.',
      content: `Extreme weather events across the world's major wheat-producing regions have destroyed approximately 30% of the global wheat harvest, creating the most severe food security crisis in over a decade. The crisis stems from simultaneous droughts in North America and flooding in Eastern Europe and Asia, affecting the fundamental building blocks of global food supply.

The scale of crop losses is unprecedented in modern agricultural history:
- United States: 40% reduction in wheat yield due to severe drought
- Ukraine: 35% loss from flooding and conflict-related disruptions  
- Russia: 25% decrease from drought and early frost
- Australia: 45% reduction from extended drought conditions
- Canada: 30% loss from extreme heat and limited rainfall

These five countries typically produce 60% of the world's wheat exports, making the simultaneous crop failures particularly devastating for global food markets. Wheat prices have already increased by 85% since the crisis began, with further increases expected as reserves dwindle.

Dr. Amanda Foster, agricultural economist at the International Food Policy Research Institute, warns of cascading effects: "Wheat is a cornerstone of global nutrition. Price increases don't just affect bread – they impact everything from pasta to livestock feed, creating ripple effects throughout the entire food system."

The crisis is particularly acute for developing nations that depend heavily on wheat imports. Countries in North Africa and the Middle East, which import 80% of their wheat, are facing potential shortages within six months. Several governments have already implemented emergency food rationing measures.

International aid organizations are mobilizing unprecedented relief efforts:
- World Food Programme preparing emergency grain reserves
- FAO coordinating alternative crop distribution networks
- USAID increasing emergency food assistance funding by $2.8 billion
- European Union activating strategic grain reserves

The agricultural industry is responding with emergency measures including:
- Accelerated development of drought-resistant wheat varieties
- Emergency irrigation system deployments
- Alternative crop rotations to maximize remaining growing seasons
- Enhanced food preservation and distribution systems

Climate scientists link the extreme weather patterns to ongoing climate change, warning that such events may become more frequent. Dr. James Liu, climatologist at NOAA, noted: "We're seeing weather patterns that would have been considered impossible just a decade ago. Agricultural systems must adapt quickly or face repeated crises."

The crisis has accelerated investment in agricultural technology, including vertical farming, precision agriculture, and alternative protein sources. Several countries are fast-tracking approvals for genetically modified crops designed to withstand extreme weather.

Long-term solutions being developed include:
- Climate-resilient crop varieties using advanced breeding techniques
- Diversified global food supply chains
- Strategic grain reserve systems
- Early warning systems for agricultural threats
- Sustainable farming practices that improve soil resilience

The United Nations has called for an emergency global food summit to coordinate international response and prevent widespread hunger. The meeting, scheduled for next month, will address both immediate relief efforts and long-term agricultural resilience strategies.`,
      category: 'Agriculture',
      language: 'English',
      source: 'Agricultural News Network',
      sourceUrl: 'https://example.com/wheat-crisis',
      imageUrl: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg',
      publishedAt: '2024-12-27T09:45:00Z',
      readingTime: 6,
      bias: {
        score: -0.1,
        explanation: 'Balanced reporting on the crisis with appropriate urgency while presenting multiple perspectives on solutions.',
        sources: ['Agricultural News Network', 'UN FAO', 'World Food Programme']
      },
      sentiment: {
        score: -0.4,
        label: 'negative'
      },
      coverageComparison: [
        {
          source: 'Farming Today',
          perspective: 'Focus on farmer impacts and agricultural solutions',
          bias: 0.1
        },
        {
          source: 'Climate Action Network',
          perspective: 'Links crisis to climate change and policy failures',
          bias: -0.5
        },
        {
          source: 'Commodity Markets Daily',
          perspective: 'Market analysis and price impact focus',
          bias: 0.0
        }
      ],
      eli5Summary: 'Bad weather like no rain and too much rain hurt the farms where wheat grows. Wheat is used to make bread and lots of food, so there might not be enough food for everyone.',
      audioSummary: {
        url: '/audio/wheat-crisis-summary.mp3',
        duration: 320
      },
      relatedArticles: ['1', '9'],
      tags: ['agriculture', 'food security', 'climate change', 'global crisis']
    },
    {
      id: '9',
      title: 'Electric Vehicle Sales Surpass Gasoline Cars for First Time in Europe',
      summary: 'European electric vehicle sales reach historic milestone, accounting for 52% of new car purchases in November 2024, driven by policy incentives and infrastructure expansion.',
      content: `Electric vehicles have achieved a historic milestone in Europe, accounting for 52% of new car sales in November 2024 – the first time electric vehicles have outsold gasoline-powered cars in any major automotive market. The achievement represents a fundamental shift in transportation patterns and signals the acceleration of the global transition to electric mobility.

The breakthrough was driven by a combination of factors including expanded charging infrastructure, improved battery technology, competitive pricing, and supportive government policies. Norway leads the transition with 87% of new car sales being electric, followed by Iceland (72%), Sweden (64%), and Denmark (58%).

Key drivers of the surge include:

Infrastructure Expansion: Europe now has over 500,000 public charging points, representing a 400% increase since 2020. Fast-charging networks along major highways have eliminated "range anxiety" for most drivers.

Battery Technology: New lithium-iron phosphate batteries offer 600+ mile ranges while reducing costs by 40% compared to previous generation technology. Charging times have decreased to under 15 minutes for 80% capacity.

Government Incentives: Purchase subsidies of up to €10,000 per vehicle, combined with tax benefits and free parking in city centers, have made electric vehicles financially attractive.

Manufacturer Competition: Over 200 electric vehicle models are now available in Europe, compared to just 30 in 2020. Price competition has driven costs down while improving quality and features.

The shift has significant economic implications. Traditional automotive manufacturers are rapidly retooling factories, with Volkswagen, BMW, and Mercedes-Benz announcing plans to phase out gasoline engines by 2030. The transition is creating new jobs in battery manufacturing and charging infrastructure while eliminating others in traditional engine production.

Environmental impact is substantial. Transportation accounts for 29% of European carbon emissions, and the electric vehicle surge is projected to reduce annual CO2 emissions by 180 million tons by 2030. Air quality improvements are already measurable in major cities like Amsterdam and Copenhagen.

However, challenges remain:

Grid Capacity: Electricity demand for vehicle charging is straining power grids, requiring massive infrastructure investments and smart charging systems.

Battery Materials: Increased demand for lithium, cobalt, and rare earth elements is creating new supply chain dependencies and environmental concerns.

Used Car Market: The rapid transition is creating uncertainty in used vehicle markets, particularly affecting lower-income consumers who rely on older, affordable vehicles.

Job Displacement: Traditional automotive jobs are being eliminated faster than new electric vehicle jobs are being created in some regions.

The success in Europe is influencing global markets. China, which pioneered mass electric vehicle adoption, now sees 35% of new car sales being electric. The United States lags behind at 18%, but several states are implementing policies modeled on European success.

Industry analysts predict that the European milestone will accelerate global adoption timelines. Goldman Sachs now projects that electric vehicles will represent 60% of global new car sales by 2030, five years ahead of previous predictions.

The transformation extends beyond personal vehicles. Electric buses, delivery trucks, and commercial vehicles are experiencing similar adoption rates, driven by total cost of ownership advantages and environmental regulations.`,
      category: 'Transportation',
      language: 'English',
      source: 'European Auto Report',
      sourceUrl: 'https://example.com/ev-milestone-europe',
      imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg',
      publishedAt: '2024-12-27T07:20:00Z',
      readingTime: 5,
      bias: {
        score: 0.3,
        explanation: 'Positive framing of electric vehicle adoption with acknowledgment of challenges.',
        sources: ['European Auto Report', 'European Environment Agency', 'Industry Data']
      },
      sentiment: {
        score: 0.5,
        label: 'positive'
      },
      coverageComparison: [
        {
          source: 'Green Car Reports',
          perspective: 'Celebrates environmental benefits',
          bias: 0.7
        },
        {
          source: 'Auto Industry Weekly',
          perspective: 'Concerns about industry transformation costs',
          bias: -0.1
        },
        {
          source: 'Energy Policy Review',
          perspective: 'Analysis of grid infrastructure challenges',
          bias: 0.0
        }
      ],
      eli5Summary: 'In Europe, more people are buying cars that run on electricity instead of gasoline. Electric cars are better for the air we breathe and are becoming easier to use.',
      audioSummary: {
        url: '/audio/ev-milestone-summary.mp3',
        duration: 260
      },
      relatedArticles: ['1', '10'],
      tags: ['electric vehicles', 'transportation', 'environment', 'technology']
    },
    {
      id: '10',
      title: 'Social Media Giant Announces Major Algorithm Changes to Combat Misinformation',
      summary: 'Platform implements AI-powered fact-checking and reduces reach of unverified content, affecting how 3 billion users consume news and information.',
      content: `Meta, the parent company of Facebook and Instagram, has announced sweeping changes to its content recommendation algorithms designed to combat misinformation and promote authoritative news sources. The changes, affecting over 3 billion users worldwide, represent the most significant platform policy shift since the 2016 election interference scandals.

The new system, called "Truth Signal," uses advanced AI to evaluate content credibility in real-time before showing it to users. The algorithm considers multiple factors including source reliability, fact-checker ratings, expert consensus, and cross-reference verification with authoritative databases.

Key changes include:

Content Verification: All news articles and political content must pass through AI fact-checking before reaching users' feeds. Unverified content receives warning labels and reduced distribution.

Source Authority Scoring: News organizations receive credibility scores based on journalistic standards, fact-checking history, and editorial transparency. Higher-scored sources receive preferential distribution.

Misinformation Penalties: Accounts repeatedly sharing debunked content face graduated restrictions including reduced reach, removal from recommendations, and temporary posting limitations.

Expert Amplification: Content from verified experts in relevant fields receives boosted distribution when discussing topics within their expertise.

User Education: New literacy tools help users identify reliable sources and understand bias indicators, with interactive tutorials on evaluating information quality.

The announcement follows mounting pressure from governments worldwide to address the spread of false information on social media platforms. The European Union's Digital Services Act and similar regulations in other countries have forced platforms to take more aggressive action against misinformation.

Initial testing showed promising results:
- 73% reduction in verified false information sharing
- 45% increase in clicks on authoritative news sources
- 67% of users report feeling more confident about information accuracy
- 23% decrease in polarizing political content engagement

However, the changes have sparked significant controversy. Free speech advocates argue that automated content moderation could suppress legitimate discourse and alternative viewpoints. Some political groups claim the system exhibits bias against conservative perspectives.

"We're witnessing the privatization of truth," criticized Dr. Robert Martinez, digital rights researcher at Electronic Frontier Foundation. "Who decides what constitutes authoritative information, and what happens when they get it wrong?"

The changes are also affecting news organizations economically. Smaller, independent media outlets worry about being disadvantaged by authority scoring systems that favor established publications. Some have reported significant drops in social media traffic since the system launched.

Technical challenges remain substantial. The AI system sometimes struggles with satire, opinion content, and rapidly evolving news stories where facts are still emerging. False positive rates for misinformation detection currently run at approximately 8%.

Other social media platforms are watching the rollout closely. Twitter, TikTok, and YouTube are all developing similar systems, though with different approaches to balancing free expression with content quality.

The long-term implications extend beyond social media. The success or failure of Truth Signal could influence how other information platforms – from search engines to news aggregators – approach content curation and misinformation prevention.

Meta plans to refine the system based on user feedback and ongoing research, with major updates scheduled quarterly. The company has committed to transparency reports detailing the algorithm's decision-making processes and impact on content distribution.`,
      category: 'Technology',
      language: 'English',
      source: 'Digital Platform Monitor',
      sourceUrl: 'https://example.com/meta-algorithm-changes',
      imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      publishedAt: '2024-12-26T20:15:00Z',
      readingTime: 6,
      bias: {
        score: 0.0,
        explanation: 'Balanced coverage presenting both benefits and concerns about algorithm changes.',
        sources: ['Digital Platform Monitor', 'Meta Press Release', 'Academic Research']
      },
      sentiment: {
        score: 0.1,
        label: 'neutral'
      },
      coverageComparison: [
        {
          source: 'TechCrunch',
          perspective: 'Focus on technical implementation and user impact',
          bias: 0.2
        },
        {
          source: 'Free Speech Coalition',
          perspective: 'Emphasizes censorship and free expression concerns',
          bias: -0.6
        },
        {
          source: 'Journalism Review',
          perspective: 'Impact on news organizations and media landscape',
          bias: 0.1
        }
      ],
      eli5Summary: 'A big company that makes apps where people share pictures and news is using smart computers to check if the news is true before showing it to people.',
      audioSummary: {
        url: '/audio/meta-algorithm-summary.mp3',
        duration: 310
      },
      relatedArticles: ['6', '11'],
      tags: ['social media', 'misinformation', 'technology', 'algorithms']
    }
  ] as NewsArticle[],
  
  quizzes: [
    {
      id: 'quiz-1',
      articleId: '1',
      questions: [
        {
          id: 'q1',
          question: 'What percentage reduction in carbon emissions do countries aim to achieve by 2030?',
          options: ['40%', '50%', '60%', '70%'],
          correctAnswer: 2,
          explanation: 'The Geneva Climate Compact establishes a target of 60% reduction in carbon emissions from 2019 levels by 2030.'
        },
        {
          id: 'q2',
          question: 'How much will developed nations contribute annually to the global climate fund?',
          options: ['$200 billion', '$350 billion', '$500 billion', '$750 billion'],
          correctAnswer: 2,
          explanation: 'Developed nations committed to contribute $500 billion annually to support clean energy transitions in developing countries.'
        },
        {
          id: 'q3',
          question: 'When must coal-fired power plants be phased out according to the agreement?',
          options: ['2026', '2027', '2028', '2030'],
          correctAnswer: 2,
          explanation: 'The agreement mandates a complete phase-out of coal-fired power plants by 2028.'
        }
      ]
    },
    {
      id: 'quiz-2',
      articleId: '2',
      questions: [
        {
          id: 'q1',
          question: 'What accuracy rate did the quantum error correction system achieve?',
          options: ['99.5%', '99.7%', '99.9%', '100%'],
          correctAnswer: 2,
          explanation: 'The MIT research team achieved 99.9% accuracy in their quantum error correction system.'
        },
        {
          id: 'q2',
          question: 'How long can the new system maintain quantum coherence?',
          options: ['1 second', '5 seconds', '10 seconds', '30 seconds'],
          correctAnswer: 2,
          explanation: 'The breakthrough system can maintain quantum coherence for up to 10 seconds, a massive improvement over previous millisecond durations.'
        }
      ]
    }
  ] as NewsQuiz[]
};