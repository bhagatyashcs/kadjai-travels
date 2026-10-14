// scripts/pages/chapter2.cjs
// Chapter 2: SYSTEM ANALYSIS (Pages 7 to 11 of 44)

function getChapter2Pages() {
  const pages = [];

  // Page 7 of 44: 2.1 Work Breakdown Structure (WBS)
  pages.push(`
    <div class="a4-page" id="page-7">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 2</h1>
        <h2 class="chapter-subtitle">SYSTEM ANALYSIS</h2>

        <h3 class="section-title">2.1 Work Breakdown Structure (WBS)</h3>
        <p>
          The development of the <strong>Kadjai Travels</strong> tourist vehicle and customer trip management platform is organized into six structured engineering phases:
        </p>

        <ul class="academic-list">
          <li><strong>1. Requirements and System Planning:</strong> Field research in regional tourist car hubs and intercity cab terminals (Dadar, Borivali, CSMIA T2); stakeholder interviews with fleet operators, drivers, and travelers; analysis of common job card and Fastag toll bottlenecks; preparation of the Software Requirements Specification (SRS); determination of functional and non-functional requirements.</li>
          <li><strong>2. System Architecture & Relational Database Design:</strong> Formulation of the 3-tier system architecture; ER modeling for 6 core entities (Users, Vehicles, Bookings, Duty Slips, Route Tariffs, Trip Expenses); schema normalization to Third Normal Form (3NF); database schema indexing and foreign key referential integrity constraints.</li>
          <li><strong>3. Backend REST API Development:</strong> Implementation of Node.js and Express REST controllers; stateless JWT Bearer token authentication with BCrypt password hashing; service logic for Zero-Login trip tracking, decimal-safe fare estimation, and automated duty slip generation; database seeding with mock demonstration data.</li>
          <li><strong>4. Frontend Web Application Development:</strong> Creation of React 18 Single Page Application with Tailwind CSS; development of Zero-Login Live Vehicle Tracker, Owner Dispatch Command Center, Active Bookings Queue, Dynamic Fare Calculator, and A4 Duty Slip Generator.</li>
          <li><strong>5. Cloud Deployment & Production Hardening:</strong> Multi-tier bundling with Vite 5; environment configuration with strict CORS allowlist and rate limiting; deployment of frontend on Vercel Edge CDN; configuration of server environment.</li>
          <li><strong>6. Testing, Quality Assurance & Documentation:</strong> Unit and integration testing; master test case execution across all features (TC-01 to TC-15); validation of security access controls; generation of UML diagrams, user guides, and comprehensive academic project documentation.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 7 of 44</span>
      </div>
    </div>
  `);

  // Page 8 of 44: 2.2 Functional and Non-Functional SRS (Part 1)
  pages.push(`
    <div class="a4-page" id="page-8">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">2.2 Functional and Non-Functional Requirements (SRS)</h3>
        <p>
          A rigorous Software Requirements Specification establishes the precise capabilities and behavioral guarantees demanded of the 
          Kadjai Travels platform. Requirements are categorized into Functional Requirements (system features) and Non-Functional Requirements (quality attributes).
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 6px 0 3px 0; color: #0f172a;">Table 2.2.1: Functional Requirements Specification</h4>
        <table class="academic-table" style="margin-bottom: 8px;">
          <thead>
            <tr>
              <th style="width: 14%;">Req ID</th>
              <th style="width: 46%;">Requirement Description</th>
              <th style="width: 18%;">Category</th>
              <th style="width: 22%;">Target User / Entity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FR-01</td>
              <td>Zero-Login Vehicle Tracking: Search active booking by reference ID and phone number without login.</td>
              <td>Core Feature</td>
              <td>Guest Passenger / Customer</td>
            </tr>
            <tr>
              <td>FR-02</td>
              <td>Digital Booking Lifecycle: Create, review, confirm, assign driver, advance trip stages (4 stages).</td>
              <td>Travel Desk Flow</td>
              <td>Travel Admin / Dispatcher</td>
            </tr>
            <tr>
              <td>FR-03</td>
              <td>Dynamic Fare Calculation: Auto-calculate transparent fares based on package type, kilometers, and daily minimums.</td>
              <td>Fare Engine</td>
              <td>Customer / Dispatcher</td>
            </tr>
            <tr>
              <td>FR-04</td>
              <td>Fastag Toll & Expense Ledger: Record en-route highway toll charges and municipal parking expenses.</td>
              <td>Billing</td>
              <td>Driver / Admin</td>
            </tr>
            <tr>
              <td>FR-05</td>
              <td>Automated Duty Slip Billing: Compute billable mileage from odometer readings with driver Bata and tolls.</td>
              <td>Invoicing</td>
              <td>Billing Desk / Customer</td>
            </tr>
            <tr>
              <td>FR-06</td>
              <td>Customer Digital Portal: Retrieve historical trip sheets and verified A4 receipts via phone lookup.</td>
              <td>Self-Service</td>
              <td>Registered / Guest Rider</td>
            </tr>
            <tr>
              <td>FR-07</td>
              <td>Online Reservation Wizard: Multi-step booking form allowing customers to select vehicle, dates, and packages.</td>
              <td>Booking</td>
              <td>Prospective Traveler</td>
            </tr>
            <tr>
              <td>FR-08</td>
              <td>Role-Based Access Control: Enforce strict authorization boundaries (ADMIN and Public Customer).</td>
              <td>Security</td>
              <td>JWT / Express Middleware</td>
            </tr>
          </tbody>
        </table>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 6px 0 3px 0; color: #0f172a;">Table 2.2.2: Non-Functional Requirements Specification</h4>
        <table class="academic-table">
          <thead>
            <tr>
              <th style="width: 15%;">NFR ID</th>
              <th style="width: 30%;">Quality Attribute</th>
              <th style="width: 55%;">Specification & Metric Guarantee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NFR-01</td>
              <td>Performance & Latency</td>
              <td>API endpoints must deliver 95th percentile response times below 200 ms under standard dispatch load.</td>
            </tr>
            <tr>
              <td>NFR-02</td>
              <td>Security & Data Protection</td>
              <td>Passwords hashed using BCrypt (salt rounds 10); JWT tokens signed via HMAC-SHA256 with configurable TTL.</td>
            </tr>
            <tr>
              <td>NFR-03</td>
              <td>Availability & Reliability</td>
              <td>Local server and cloud deployment must maintain 99.9% uptime with graceful error recovery.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 8 of 44</span>
      </div>
    </div>
  `);

  // Page 9 of 44: 2.2 NFRs (Cont.) & 2.3 Gantt Chart & Schedule Intro
  pages.push(`
    <div class="a4-page" id="page-9">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <table class="academic-table" style="margin-top: 2px; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="width: 15%;">NFR ID</th>
              <th style="width: 30%;">Quality Attribute</th>
              <th style="width: 55%;">Specification & Metric Guarantee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NFR-04</td>
              <td>Data Integrity & ACID</td>
              <td>All booking status updates and duty slip calculations must execute within atomic database transactions.</td>
            </tr>
            <tr>
              <td>NFR-05</td>
              <td>Responsive Usability</td>
              <td>UI must seamlessly adapt across mobile viewports (375px), workshop tablets (768px), and counter monitors (1920px).</td>
            </tr>
            <tr>
              <td>NFR-06</td>
              <td>Maintainability & Modularity</td>
              <td>Codebase must adhere to 3-tier layering with strict decoupling between UI controllers, services, and repositories.</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">2.3 Gantt Chart and Schedule</h3>
        <p>
          The project development lifecycle spanned 10 weeks, following an agile milestone schedule from requirements gathering to testing and deployment.
        </p>
        <p>
          To ensure timely execution and rigorous quality control, the project followed an iterative development model. Key phases were planned with overlapping review checkpoints:
        </p>
        <ul class="academic-list">
          <li><strong>Phase 1 (Weeks 1 – 2):</strong> Domain immersion in tourist transport hubs, stakeholder analysis with proprietor Ramasre Bhagat, and preparation of the SRS.</li>
          <li><strong>Phase 2 (Weeks 3 – 5):</strong> System modeling, UML diagramming (Use Case, Sequence, Class, Activity), and relational database ER design.</li>
          <li><strong>Phase 3 (Weeks 6 – 8):</strong> Implementation of Express REST controllers, fare calculation algorithms, JWT security middleware, and SQLite schema.</li>
          <li><strong>Phase 4 (Weeks 9 – 10):</strong> React Single Page Application development, UI component styling with Tailwind CSS, and Zero-Login tracker integration.</li>
          <li><strong>Phase 5 (Week 10):</strong> Security hardening, automated unit and integration testing (TC-01 to TC-15), and academic documentation.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 9 of 44</span>
      </div>
    </div>
  `);

  // Page 10 of 44: Figure 2.1 Gantt Chart SVG & Milestone Table
  pages.push(`
    <div class="a4-page" id="page-10">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">Figure 2.1 – Project Development Gantt Chart & Schedule</h3>

        <!-- Figure 2.1 Gantt Chart Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 200" class="vector-diag" style="height: 68mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            <!-- Time Grid Header -->
            <rect x="130" y="8" width="500" height="20" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
            <text x="180" y="22" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" fill="#475569" text-anchor="middle">Weeks 1-2</text>
            <text x="280" y="22" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" fill="#475569" text-anchor="middle">Weeks 3-5</text>
            <text x="390" y="22" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" fill="#475569" text-anchor="middle">Weeks 6-8</text>
            <text x="500" y="22" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" fill="#475569" text-anchor="middle">Weeks 9-10</text>
            <text x="590" y="22" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" fill="#475569" text-anchor="middle">Week 10 (QA)</text>

            <!-- Vertical grid dividers -->
            <line x1="230" y1="28" x2="230" y2="185" stroke="#e2e8f0" stroke-width="0.8"/>
            <line x1="335" y1="28" x2="335" y2="185" stroke="#e2e8f0" stroke-width="0.8"/>
            <line x1="445" y1="28" x2="445" y2="185" stroke="#e2e8f0" stroke-width="0.8"/>
            <line x1="555" y1="28" x2="555" y2="185" stroke="#e2e8f0" stroke-width="0.8"/>

            <!-- Task 1 -->
            <text x="15" y="48" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" fill="#0f172a">1. Requirements & Planning</text>
            <rect x="130" y="36" width="100" height="18" rx="3" fill="#0284c7"/>
            <text x="180" y="49" font-family="'Plus Jakarta Sans'" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">SRS & Rules</text>

            <!-- Task 2 -->
            <text x="15" y="78" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" fill="#0f172a">2. System & DB Design</text>
            <rect x="230" y="66" width="105" height="18" rx="3" fill="#0d9488"/>
            <text x="282" y="79" font-family="'Plus Jakarta Sans'" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">UML & ER Models</text>

            <!-- Task 3 -->
            <text x="15" y="108" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" fill="#0f172a">3. Backend REST APIs</text>
            <rect x="335" y="96" width="110" height="18" rx="3" fill="#eab308"/>
            <text x="390" y="109" font-family="'Plus Jakarta Sans'" font-size="7.5" font-weight="700" fill="#0f172a" text-anchor="middle">Express & SQLite</text>

            <!-- Task 4 -->
            <text x="15" y="138" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" fill="#0f172a">4. Frontend Web App</text>
            <rect x="445" y="126" width="110" height="18" rx="3" fill="#10b981"/>
            <text x="500" y="139" font-family="'Plus Jakarta Sans'" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">React & Tailwind</text>

            <!-- Task 5 -->
            <text x="15" y="168" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" fill="#0f172a">5. Testing & Cloud QA</text>
            <rect x="555" y="156" width="75" height="18" rx="3" fill="#6366f1"/>
            <text x="592" y="169" font-family="'Plus Jakarta Sans'" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">TC-01..15</text>
          </svg>
          <div class="figure-caption">Figure 2.1 – Project Development Gantt Chart & Schedule</div>
        </div>

        <table class="academic-table" style="margin-top: 6px;">
          <thead>
            <tr>
              <th style="width: 25%;">Phase / Milestone</th>
              <th style="width: 30%;">Time Period</th>
              <th style="width: 45%;">Key Deliverables</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Phase 1: Requirements</td>
              <td>Weeks 1 – 2 (Aug 01 – Aug 14)</td>
              <td>Stakeholder interviews, SRS document, technology stack selection.</td>
            </tr>
            <tr>
              <td>Phase 2: System Design</td>
              <td>Weeks 3 – 5 (Aug 15 – Sep 06)</td>
              <td>ER diagrams, UML class and sequence models, UI wireframes.</td>
            </tr>
            <tr>
              <td>Phase 3: Backend APIs</td>
              <td>Weeks 6 – 8 (Sep 07 – Sep 28)</td>
              <td>Express REST endpoints, SQLite tables, JWT security filters.</td>
            </tr>
            <tr>
              <td>Phase 4: Frontend App</td>
              <td>Weeks 9 – 10 (Sep 29 – Oct 05)</td>
              <td>React SPA, Admin dashboard, Public tracker, responsive styling.</td>
            </tr>
            <tr>
              <td>Phase 5: Cloud & QA</td>
              <td>Week 10 (Oct 05 – Oct 08)</td>
              <td>Integration testing, security audit, final report documentation.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 10 of 44</span>
      </div>
    </div>
  `);

  // Page 11 of 44: 2.4 Domain Class Diagram
  pages.push(`
    <div class="a4-page" id="page-11">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">2.4 Domain Class Diagram</h3>
        <p>
          The analysis model identifies six core domain classes: <code>User</code>, <code>Vehicle</code>, <code>Booking</code>, <code>DutySlip</code>, 
          <code>RouteTariff</code>, and <code>TripExpense</code>. The User entity models system actors (Admin and Passenger). A User creates Bookings for travel. 
          A Vehicle (Maruti Suzuki Ertiga 6+1 AC Luxury) is assigned to Bookings. Each Booking generates an official DutySlip with opening and closing odometer readings, 
          and aggregates en-route TripExpenses (Fastag tolls and parking).
        </p>

        <!-- Figure 2.2 Domain Class Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 300" class="vector-diag" style="height: 100mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- Class: Booking -->
            <rect x="230" y="15" width="190" height="145" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="15" width="190" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="30" font-family="'Plus Jakarta Sans'" font-size="10" font-weight="800" text-anchor="middle">Booking</text>
            <text x="238" y="50" font-family="'JetBrains Mono'" font-size="7.5">- String bookingReference</text>
            <text x="238" y="62" font-family="'JetBrains Mono'" font-size="7.5">- String customerName, phone</text>
            <text x="238" y="74" font-family="'JetBrains Mono'" font-size="7.5">- String tripType</text>
            <text x="238" y="86" font-family="'JetBrains Mono'" font-size="7.5">- Double estimatedFare</text>
            <text x="238" y="98" font-family="'JetBrains Mono'" font-size="7.5">- String status (CONFIRMED)</text>
            <line x1="230" y1="106" x2="420" y2="106" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="238" y="118" font-family="'JetBrains Mono'" font-size="7.5">+ calculateFare()</text>
            <text x="238" y="130" font-family="'JetBrains Mono'" font-size="7.5">+ allocateVehicle(vehicleId)</text>
            <text x="238" y="142" font-family="'JetBrains Mono'" font-size="7.5">+ updateStatus(newStatus)</text>

            <!-- Class: Vehicle -->
            <rect x="30" y="30" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="30" y="30" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="110" y="45" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle">Vehicle</text>
            <text x="38" y="64" font-family="'JetBrains Mono'" font-size="7.5">- String registrationNumber</text>
            <text x="38" y="76" font-family="'JetBrains Mono'" font-size="7.5">- String brand, model (Ertiga)</text>
            <text x="38" y="88" font-family="'JetBrains Mono'" font-size="7.5">- Integer seatingCapacity (6+1)</text>
            <text x="38" y="100" font-family="'JetBrains Mono'" font-size="7.5">- Boolean isActive</text>
            <line x1="30" y1="108" x2="190" y2="108" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="38" y="122" font-family="'JetBrains Mono'" font-size="7.5">+ checkAvailability()</text>

            <!-- Class: User (Customer / Admin) -->
            <rect x="460" y="30" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="460" y="30" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="540" y="45" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle">User</text>
            <text x="468" y="64" font-family="'JetBrains Mono'" font-size="7.5">- Long id</text>
            <text x="468" y="76" font-family="'JetBrains Mono'" font-size="7.5">- String fullName, email</text>
            <text x="468" y="88" font-family="'JetBrains Mono'" font-size="7.5">- String role (ROLE_ADMIN)</text>
            <text x="468" y="100" font-family="'JetBrains Mono'" font-size="7.5">- String phone</text>
            <line x1="460" y1="108" x2="620" y2="108" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="468" y="122" font-family="'JetBrains Mono'" font-size="7.5">+ authenticate(password)</text>

            <!-- Class: DutySlip -->
            <rect x="230" y="195" width="190" height="95" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="195" width="190" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="210" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle">DutySlip</text>
            <text x="238" y="230" font-family="'JetBrains Mono'" font-size="7.5">- String dutySlipNumber</text>
            <text x="238" y="242" font-family="'JetBrains Mono'" font-size="7.5">- Integer startKm, endKm, totalKm</text>
            <text x="238" y="254" font-family="'JetBrains Mono'" font-size="7.5">- Double tollCharges, driverBata</text>
            <line x1="230" y1="262" x2="420" y2="262" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="238" y="276" font-family="'JetBrains Mono'" font-size="7.5">+ generateA4DutySlip()</text>

            <!-- Relationships Lines -->
            <line x1="190" y1="85" x2="230" y2="85" stroke="#0f172a" stroke-width="1.2"/>
            <text x="205" y="80" font-size="8">1..*</text>
            <line x1="420" y1="85" x2="460" y2="85" stroke="#0f172a" stroke-width="1.2"/>
            <text x="435" y="80" font-size="8">1..*</text>
            <line x1="325" y1="160" x2="325" y2="195" stroke="#0f172a" stroke-width="1.2"/>
            <text x="330" y="180" font-size="8">1..1</text>
          </svg>
          <div class="figure-caption">Figure 2.2 – Domain Class Diagram</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 11 of 44</span>
      </div>
    </div>
  `);

  return pages;
}

module.exports = { getChapter2Pages };
