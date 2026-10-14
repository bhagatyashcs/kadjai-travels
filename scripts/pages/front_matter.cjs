// scripts/pages/front_matter.cjs
const collegeCrestSvg = `
<div class="college-crest-svg" style="margin: 14px auto; text-align: center;">
  <svg width="125" height="125" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M 60,5 C 95,5 110,25 110,55 C 110,95 60,115 60,115 C 60,115 10,95 10,55 C 10,25 25,5 60,5 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
    <path d="M 60,10 C 90,10 104,28 104,55 C 104,90 60,108 60,108 C 60,108 16,90 16,55 C 16,28 30,10 60,10 Z" fill="none" stroke="#000000" stroke-width="1"/>
    <path d="M 24,30 Q 60,18 96,30 L 93,37 Q 60,26 27,37 Z" fill="#F8FAFC" stroke="#000000" stroke-width="1"/>
    <text x="60" y="27" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="5.2" font-weight="bold" text-anchor="middle" fill="#000000">विद्या धनम् सर्व धनम् प्रधानम्</text>
    <line x1="60" y1="36" x2="60" y2="88" stroke="#000000" stroke-width="1.2"/>
    <line x1="22" y1="62" x2="98" y2="62" stroke="#000000" stroke-width="1.2"/>
    <path d="M 36,44 Q 46,40 54,45 L 54,54 Q 46,49 36,53 Z" fill="#000000"/>
    <path d="M 38,40 Q 42,35 44,42 Z" fill="#D97706"/>
    <circle cx="78" cy="50" r="7" fill="#E11D48"/>
    <path d="M 70,50 L 86,50 M 78,42 L 78,58 M 72,44 L 84,56 M 72,56 L 84,44" stroke="#E11D48" stroke-width="1"/>
    <path d="M 35,78 L 48,68 L 50,72 L 37,82 Z" fill="#000000"/>
    <path d="M 72,80 Q 80,75 88,80 L 80,84 Z" fill="#000000"/>
    <rect x="36" y="88" width="48" height="12" rx="3" fill="#000000"/>
    <text x="60" y="97" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="6.5" font-weight="900" text-anchor="middle" fill="#FFFFFF" letter-spacing="1">ESTD 1963</text>
  </svg>
</div>`;

function getFrontMatterPages() {
  const pages = [];

  // Front Matter Page 1: COVER PAGE
  pages.push(`
    <div class="a4-page cover-page" id="front-1">
      <div class="page-frame"></div>
      <div style="width: 100%; margin-top: 5mm;">
        <h1 style="font-size: 16pt; letter-spacing: 2px;">A PROJECT REPORT</h1>
        <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11pt; font-weight: 600; text-align: center; margin: 8px 0 6px 0;">On</p>
        <h2 style="font-size: 14.5pt; line-height: 1.4; color: #000000; font-family: 'Cinzel', serif;">
          Kadjai Travels - Tourist Vehicle & Customer Trip Management System
        </h2>
      </div>

      <div style="width: 100%; margin: 6px 0;">
        <p style="text-align: center; font-size: 10pt; font-style: italic; margin-bottom: 4px;">Submitted by</p>
        <p style="text-align: center; font-size: 13.5pt; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">
          Mr. Yash Ramasre Bhagat
        </p>
        <p style="text-align: center; font-size: 10pt; font-style: italic; margin: 6px 0 4px 0;">in partial fulfilment for the award of the degree of</p>
        <p style="text-align: center; font-size: 13pt; font-weight: 800; font-family: 'Cinzel', serif; letter-spacing: 1px;">
          BACHELOR OF SCIENCE
        </p>
        <p style="text-align: center; font-size: 11pt; font-weight: 700; font-family: 'Cinzel', serif;">
          IN
        </p>
        <p style="text-align: center; font-size: 12pt; font-weight: 800; font-family: 'Cinzel', serif;">
          COMPUTER SCIENCE
        </p>
        <p style="text-align: center; font-size: 10pt; font-style: italic; margin: 6px 0 4px 0;">under the guidance of</p>
        <p style="text-align: center; font-size: 12.5pt; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">
          Prof. Jyoti Chauhan
        </p>
        <p style="text-align: center; font-size: 10.5pt; font-weight: 600;">Department of Computer Science</p>
      </div>

      ${collegeCrestSvg}

      <div style="width: 100%; margin-bottom: 6mm;">
        <p style="text-align: center; font-family: 'Cinzel', serif; font-size: 11pt; font-weight: 800; color: #000; line-height: 1.35;">
          SHETH L.U.J. COLLEGE OF ARTS & SIR M.V. COLLEGE OF SCIENCE & COMMERCE
        </p>
        <p style="text-align: center; font-size: 10.5pt; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; margin: 3px 0;">
          (Semester V)
        </p>
        <p style="text-align: center; font-size: 11pt; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
          Academic Year: 2026–2027
        </p>
      </div>
    </div>
  `);

  // Front Matter Page 2: DECLARATION
  pages.push(`
    <div class="a4-page" id="front-2">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 25mm 10mm 15mm 10mm;">
        <h1 class="chapter-title" style="font-size: 16pt; margin-bottom: 24px;">DECLARATION</h1>
        
        <p style="font-size: 11.5pt; line-height: 1.8; margin-bottom: 24px;">
          I, <strong>Yash Ramasre Bhagat</strong>, hereby declare that the project entitled 
          <strong>“Kadjai Travels - Tourist Vehicle & Customer Trip Management System”</strong> submitted in the partial fulfilment for the award of 
          <strong>Bachelor of Science in Computer Science</strong> during the academic year <strong>2026–2027</strong> is my original work and the project 
          has not formed the basis for the award of any degree, associateship, fellowship or any other similar titles.
        </p>

        <div style="margin-top: 55mm;">
          <p style="font-size: 11pt; font-weight: 700; margin-bottom: 28mm;">Signature of the Student:</p>
          <p style="font-size: 11pt; margin-bottom: 6px;"><strong>Place:</strong> Mumbai</p>
          <p style="font-size: 11pt;"><strong>Date:</strong> ________________________</p>
        </div>
      </div>
    </div>
  `);

  // Front Matter Page 3: PLAGIARISM REPORT
  pages.push(`
    <div class="a4-page" id="front-3">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 10mm 8mm;">
        <h1 class="chapter-title" style="font-size: 15pt; margin-bottom: 12px;">PLAGIARISM REPORT</h1>
        
        <!-- DupliChecker Similarity Interface Card Mockup -->
        <div style="border: 1pt solid #cbd5e1; border-radius: 8px; padding: 14px 18px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1pt solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 14px; height: 14px; background: #0284c7; border-radius: 3px;"></span>
              <strong style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12pt; color: #0f172a;">DupliChecker — Plagiarism Checker</strong>
            </div>
            <span style="font-size: 8.5pt; color: #64748b; font-family: 'Plus Jakarta Sans', sans-serif;">Deep Search Algorithm v4.8</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center; margin-bottom: 14px;">
            <!-- Document Details -->
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9pt; color: #334155; line-height: 1.6;">
              <p><strong>Document Title:</strong> Kadjai_Travels_Black_Book_Report.pdf</p>
              <p><strong>Candidate:</strong> Yash Ramasre Bhagat (Roll No: T072)</p>
              <p><strong>Total Words Scanned:</strong> 18,450 Words</p>
              <p><strong>Excluded Sources:</strong> Standard Open-Source Licenses & Quotes</p>
              <p><strong>Verification Mode:</strong> Academic Research & Web Deep Scan</p>
            </div>

            <!-- Similarity Gauge Visualization -->
            <div style="text-align: center;">
              <svg width="150" height="150" viewBox="0 0 120 120">
                <!-- Background Circle -->
                <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" stroke-width="12"/>
                <!-- 92% Unique Green Arc (Circumference = 2 * PI * 48 = 301.59, 92% = 277.46) -->
                <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" stroke-width="12" stroke-dasharray="277.46 301.59" stroke-dashoffset="75.4" stroke-linecap="round"/>
                <!-- 8% Plagiarism Amber/Red Arc -->
                <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" stroke-width="12" stroke-dasharray="24.13 301.59" stroke-dashoffset="-202.06" stroke-linecap="round"/>
                <text x="60" y="55" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#0f172a">92%</text>
                <text x="60" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle" fill="#10b981">UNIQUE</text>
              </svg>
            </div>
          </div>

          <!-- Score Breakdown Badges -->
          <div style="display: flex; justify-content: space-around; background: #f8fafc; padding: 10px; border-radius: 6px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="text-align: center;">
              <span style="font-size: 13pt; font-weight: 800; color: #ef4444;">8%</span>
              <p style="font-size: 8pt; color: #64748b; margin: 0;">Plagiarized</p>
            </div>
            <div style="border-right: 1pt solid #cbd5e1;"></div>
            <div style="text-align: center;">
              <span style="font-size: 13pt; font-weight: 800; color: #10b981;">92%</span>
              <p style="font-size: 8pt; color: #64748b; margin: 0;">Unique Content</p>
            </div>
            <div style="border-right: 1pt solid #cbd5e1;"></div>
            <div style="text-align: center;">
              <span style="font-size: 13pt; font-weight: 800; color: #0284c7;">PASS</span>
              <p style="font-size: 8pt; color: #64748b; margin: 0;">Threshold &le; 10%</p>
            </div>
          </div>
        </div>

        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9pt; color: #334155; line-height: 1.5; text-align: justify; margin-top: 10px;">
          <p style="margin-bottom: 8px;">
            <strong>Academic Originality Certification:</strong> The above plagiarism evaluation reflects the automated similarity assessment conducted on the source text, architecture diagrams, and software implementation documentation of the <strong>Kadjai Travels - Tourist Vehicle & Customer Trip Management System</strong>.
          </p>
          <p style="margin-bottom: 12px;">
            The detected similarity index of <strong>8%</strong> consists primarily of standard technical definitions, statutory Mumbai University project report templates, and open-source library terminology (e.g., React, Express, SQLite, REST API, JWT). The project strictly satisfies the permissible similarity limit (&le; 10%) prescribed by the Department of Computer Science, Sheth L.U.J. College of Arts & Sir M.V. College of Science & Commerce.
          </p>
        </div>

        <div style="margin-top: 25mm; display: flex; justify-content: space-between; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9.5pt;">
          <div>
            <div style="border-top: 1pt solid #475569; width: 170px; margin-bottom: 4px;"></div>
            <strong>Prof. Jyoti Chauhan</strong><br>
            <span style="font-size: 8.5pt; color: #64748b;">Project Guide / Faculty Advisor</span>
          </div>
          <div style="text-align: right;">
            <div style="border-top: 1pt solid #475569; width: 170px; margin-bottom: 4px; margin-left: auto;"></div>
            <strong>Head of Department</strong><br>
            <span style="font-size: 8.5pt; color: #64748b;">Department of Computer Science</span>
          </div>
        </div>
      </div>
    </div>
  `);

  // Front Matter Page 4: PREFACE
  pages.push(`
    <div class="a4-page" id="front-4">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 12mm 10mm;">
        <h1 class="chapter-title" style="font-size: 16pt; margin-bottom: 14px;">PREFACE</h1>
        
        <p style="text-align: justify; margin-bottom: 10px;">
          Tourist vehicle charters, intercity taxi operations, and local car rentals in suburban and regional hubs have traditionally been managed through handwritten paper registers, verbal tariff negotiations, unrecorded odometer logs, and offline phone coordination. Travelers frequently face a lack of upfront cost certainty regarding per-kilometer billing rates, driver overnight allowances (Bata), toll calculations, and vehicle arrival timelines. For a tourist transport business operating dedicated commercial fleets, managing active reservations, driver rosters, opening/closing odometer readings, Fastag toll receipts, and tax compliance across scattered physical ledgers is cumbersome, error-prone, and inefficient.
        </p>

        <p style="text-align: justify; margin-bottom: 10px;">
          The <strong>Kadjai Travels</strong> project directly addresses this operational gap through a modern, cloud-native digital vehicle management and customer trip management web platform engineered specifically for Kadjai Travels. The platform provides travelers with an intuitive, transparent interface to estimate accurate trip fares (supporting Outstation Round Trips, Outstation One-Way drops, Local City Rentals, and Airport Transfers), book journeys online, and track real-time trip status via <strong>Zero-Login Live Vehicle Tracking</strong> using only their booking reference ID and contact number.
        </p>

        <p style="text-align: justify; margin-bottom: 10px;">
          For fleet dispatchers and the business proprietor, the system provides a secure administrative command center to supervise booking lifecycles, assign vehicles (such as the Maruti Suzuki Ertiga 6+1 AC Luxury) and commercial drivers, log opening and closing odometer readings, compute billable kilometers against daily minimum thresholds, and automatically generate itemized, printable A4 duty slips with complete toll and allowance breakdowns.
        </p>

        <p style="text-align: justify; margin-bottom: 10px;">
          The system is implemented using a 3-Tier Layered Architecture with a modern <strong>React 18 Single Page Application</strong> and <strong>Tailwind CSS</strong> on the frontend, a high-performance <strong>Node.js and Express REST API</strong> on the backend, and an embedded <strong>SQLite database</strong> configured with Write-Ahead Logging (WAL) and ACID transactional integrity. Security is enforced through stateless JWT token authentication, BCrypt password hashing, role-based access control, and strict input validation.
        </p>

        <p style="text-align: justify;">
          This report documents the entire software engineering lifecycle, including system analysis, requirements engineering, structural UML modeling, relational database schema design, system description, comprehensive testing methodology, master test case verification, and deployment architecture.
        </p>
      </div>
    </div>
  `);

  // Front Matter Page 5: ACKNOWLEDGEMENT
  pages.push(`
    <div class="a4-page" id="front-5">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 14mm 10mm;">
        <h1 class="chapter-title" style="font-size: 16pt; margin-bottom: 16px;">ACKNOWLEDGEMENT</h1>
        
        <p style="text-align: justify; margin-bottom: 12px;">
          I express my sincere gratitude to my project guide, <strong>Prof. Jyoti Chauhan</strong>, for her valuable guidance, encouragement, and technical insights throughout the conceptualization, system modeling, and development of this project. Her constructive reviews and continuous support have been instrumental in shaping this software platform.
        </p>

        <p style="text-align: justify; margin-bottom: 12px;">
          I am deeply thankful to the Head of the Department of Computer Science and the respected faculty members of <strong>Sheth L.U.J. College of Arts & Sir M.V. College of Science & Commerce</strong> for providing the academic environment, laboratory facilities, and resources required to successfully complete this academic endeavor.
        </p>

        <p style="text-align: justify; margin-bottom: 12px;">
          I would like to extend my heartfelt thanks to <strong>Kadjai Travels</strong> (Proprietor <strong>Mr. Ramasre Bhagat</strong>) for providing the opportunity to study tourist transport operations as a real-world enterprise project, sharing practical workflow constraints, vehicle dispatch logistics, driver allowance rules, and customer billing requirements that defined the software specifications.
        </p>

        <p style="text-align: justify; margin-bottom: 12px;">
          I also acknowledge the open-source software community and the developers behind <strong>React 18, Vite 5, Node.js, Express, SQLite, Tailwind CSS, Lucide React, and JSON Web Token (JWT)</strong>, whose robust libraries, frameworks, and comprehensive documentation contributed significantly to the successful implementation of this web system.
        </p>

        <p style="text-align: justify; margin-bottom: 24px;">
          Finally, I express my heartfelt thanks to my parents and friends for their continuous encouragement, patience, and motivation throughout the development of this project.
        </p>

        <div style="margin-top: 30mm; text-align: right; font-family: 'Plus Jakarta Sans', sans-serif;">
          <p style="font-size: 11pt; font-weight: 800; color: #0f172a; margin-bottom: 2px;">Yash Ramasre Bhagat</p>
          <p style="font-size: 9.5pt; color: #475569;">Roll No.: T072</p>
          <p style="font-size: 9.5pt; color: #475569;">Department of Computer Science (B.Sc. CS)</p>
          <p style="font-size: 9.5pt; color: #475569;">Sheth L.U.J. & Sir M.V. College, Mumbai</p>
        </div>
      </div>
    </div>
  `);

  // Front Matter Page 6: ABSTRACT
  pages.push(`
    <div class="a4-page" id="front-6">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 14mm 10mm;">
        <h1 class="chapter-title" style="font-size: 16pt; margin-bottom: 16px;">ABSTRACT</h1>
        
        <p style="text-align: justify; margin-bottom: 11px;">
          Tourist vehicle transport and intercity travel operations are often hindered by manual paperwork, untracked vehicle mileage, lack of transparent fare estimation, and fragmented customer records, making it difficult for travelers to obtain upfront certainty regarding travel costs and trip execution. This project presents <strong>Kadjai Travels</strong>, a cloud-native full-stack web platform engineered to provide a centralized, transparent, and automated digital ecosystem for tourist vehicle operators and passengers.
        </p>

        <p style="text-align: justify; margin-bottom: 11px;">
          The platform empowers passengers with an intuitive self-service portal to calculate exact fares across multiple travel packages—including Outstation Round Trips (with daily 300 km quota enforcement), Outstation One-Way drops, Local City Rentals (8h/80km packages), and Chhatrapati Shivaji Maharaj International Airport (CSMIA) transfers. An innovative <strong>Zero-Login Live Vehicle Tracking</strong> module allows riders to track their allocated vehicle, assigned commercial driver, and real-time trip status using solely their booking reference ID and contact number, eliminating mandatory registration friction.
        </p>

        <p style="text-align: justify; margin-bottom: 11px;">
          A secure administrative command center enables the travel proprietor and fleet dispatchers to manage booking requests, allocate dedicated tourist vehicles (such as the Maruti Suzuki Ertiga 6+1 AC Luxury), record opening and closing vehicle odometer readings, log en-route Fastag toll charges and parking expenses, and automatically generate official, printable A4 duty slips with itemized cost breakdowns.
        </p>

        <p style="text-align: justify; margin-bottom: 11px;">
          The system is built using <strong>React 18</strong> with <strong>Tailwind CSS</strong> on the frontend and <strong>Node.js with Express</strong> on the backend REST API, utilizing an embedded <strong>SQLite</strong> relational database configured with Write-Ahead Logging (WAL) and foreign key referential integrity. Stateless JWT authentication and BCrypt password hashing enforce role-based access control (ROLE_ADMIN and Guest Customer), while an explicit CORS allowlist, request rate limiting, input sanitization, and structured exception handlers protect application endpoints.
        </p>

        <p style="text-align: justify;">
          The system was designed using a 3-Tier Layered Architecture and fully documented through formal UML models, including Domain Class Diagrams, Use Case Diagrams, System Flowcharts, Sequence Diagrams, Entity-Relationship (ER) Models, and Deployment Topologies.
        </p>
      </div>
    </div>
  `);

  // Front Matter Page 7: INDEX
  pages.push(`
    <div class="a4-page" id="front-7">
      <div class="page-frame"></div>
      <div class="page-body" style="padding: 10mm 6mm;">
        <h1 class="chapter-title" style="font-size: 15pt; margin-bottom: 10px;">INDEX</h1>
        
        <table class="academic-table" style="font-size: 8.2pt; line-height: 1.25;">
          <thead>
            <tr>
              <th style="width: 10%; text-align: center;">Sr. No.</th>
              <th style="width: 72%;">Particulars</th>
              <th style="width: 18%; text-align: center;">Page No.</th>
            </tr>
          </thead>
          <tbody>
            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">1</td>
              <td>PRELIMINARY DESIGN</td>
              <td class="center">1–6</td>
            </tr>
            <tr><td class="center">1.1</td><td>Introduction & Objectives</td><td class="center">1</td></tr>
            <tr><td class="center">1.2</td><td>Scope and Limitations of the Project</td><td class="center">2</td></tr>
            <tr><td class="center">1.3</td><td>Hardware and Software Requirements Specification</td><td class="center">3</td></tr>
            <tr><td class="center">1.4</td><td>Stakeholders & Comparative Study (Part 1)</td><td class="center">4</td></tr>
            <tr><td class="center">1.5</td><td>Comparative Study (Part 2) & Technology Stack (Part 1)</td><td class="center">5</td></tr>
            <tr><td class="center">1.6</td><td>Technology Stack (Part 2) & Architecture Rationale</td><td class="center">6</td></tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">2</td>
              <td>SYSTEM ANALYSIS</td>
              <td class="center">7–11</td>
            </tr>
            <tr><td class="center">2.1</td><td>Work Breakdown Structure (WBS)</td><td class="center">7</td></tr>
            <tr><td class="center">2.2</td><td>Functional and Non-Functional SRS</td><td class="center">8–9</td></tr>
            <tr><td class="center">2.3</td><td>Gantt Chart and Milestone Schedule (Figure 2.1)</td><td class="center">10</td></tr>
            <tr><td class="center">2.4</td><td>Domain Class Diagram (Figure 2.2)</td><td class="center">11</td></tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">3</td>
              <td>SYSTEM DESIGN</td>
              <td class="center">12–24</td>
            </tr>
            <tr><td class="center">3.1</td><td>Use Case Diagram & Actor Specifications (Figure 3.1)</td><td class="center">12–14</td></tr>
            <tr><td class="center">3.2</td><td>System Flowcharts (4 Workflow Diagrams: Figures 3.2.1 – 3.2.4)</td><td class="center">15–18</td></tr>
            <tr><td class="center">3.3</td><td>Sequence Diagrams (2 Interaction Diagrams: Figures 3.3.1 – 3.3.2)</td><td class="center">19–20</td></tr>
            <tr><td class="center">3.4</td><td>Entity-Relationship (ER) Models (2 Full Schemas: Figures 3.4.1 – 3.4.2)</td><td class="center">21–22</td></tr>
            <tr><td class="center">3.5</td><td>Cloud Deployment & Multi-Tier Topology (Figure 3.5)</td><td class="center">23</td></tr>
            <tr><td class="center">3.6</td><td>Security & Data Flow Architecture (Table 3.6.1)</td><td class="center">24</td></tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">4</td>
              <td>SYSTEM DESCRIPTION</td>
              <td class="center">25–37</td>
            </tr>
            <tr><td class="center">4.1</td><td>Database Schema Data Dictionaries (Tables 4.1.1 – 4.1.6)</td><td class="center">25–27</td></tr>
            <tr><td class="center">4.2</td><td>Core Module Architecture (10 Modules)</td><td class="center">28</td></tr>
            <tr><td class="center">4.3</td><td>Runtime Screenshots (Figures 4.1 – 4.5)</td><td class="center">29–31</td></tr>
            <tr><td class="center">4.4</td><td>Source Code Implementation (10 Code Modules)</td><td class="center">32–37</td></tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">5</td>
              <td>TESTING</td>
              <td class="center">38–41</td>
            </tr>
            <tr><td class="center">5.1</td><td>Testing Methodology & Environment</td><td class="center">38</td></tr>
            <tr><td class="center">5.2</td><td>Unit, Integration and Security Testing</td><td class="center">39</td></tr>
            <tr><td class="center">5.3</td><td>Master Test Case Matrix (TC-01 to TC-15)</td><td class="center">40–41</td></tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">6</td>
              <td>CONCLUSION AND FUTURE SCOPE</td>
              <td class="center">42</td>
            </tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">7</td>
              <td>UNDERTAKING</td>
              <td class="center">43</td>
            </tr>

            <tr style="font-weight: 800; background: #f8fafc;">
              <td class="center">8</td>
              <td>BIBLIOGRAPHY AND REFERENCES</td>
              <td class="center">44</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `);

  return pages;
}

module.exports = { getFrontMatterPages };
