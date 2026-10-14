// scripts/pages/chapter1.cjs
// Chapter 1: PRELIMINARY DESIGN (Pages 1 to 6 of 44)

function getChapter1Pages() {
  const pages = [];

  // Page 1 of 44: 1.1 Introduction & 1.2 Objectives
  pages.push(`
    <div class="a4-page" id="page-1">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 1</h1>
        <h2 class="chapter-subtitle">PRELIMINARY DESIGN</h2>

        <h3 class="section-title">1.1 Introduction</h3>
        <p>
          <strong>Kadjai Travels</strong> is a modern, enterprise-grade tourist vehicle and customer trip management web platform engineered to modernize tourist transport, intercity cab operations, and private vehicle charter services. Traditional regional travel desks and tourist cab operators operate almost entirely on manual paper booking registers, handwritten cost estimates, unrecorded odometer logs, and post-trip Fastag toll disputes. This leads to customer anxiety over trip pricing, disputed return mileage allowances, lack of driver arrival visibility, and lost customer retention due to the absence of a centralized digital reservation and billing record.
        </p>
        <p>
          The system provides a cloud-native 3-tier architecture with <strong>Zero-Login Live Vehicle Tracking</strong> (allowing travelers to check real-time trip status, allocated driver details, and vehicle license plate using only their booking reference ID and phone number), digitized fleet dispatch workflows, automated multi-package fare estimation, and official A4 duty slip generation. The application is built with a responsive <strong>React 18 and Tailwind CSS</strong> frontend, a robust <strong>Node.js and Express REST API</strong> backend, and an embedded <strong>SQLite database</strong> configured with Write-Ahead Logging (WAL) mode. Security is enforced through stateless JWT authentication, BCrypt password hashing, and role-based access control.
        </p>

        <h3 class="section-title">1.2 Objectives</h3>
        <ul class="academic-list">
          <li><strong>Digital Booking Lifecycle Management:</strong> Digitize passenger intake, travel dates, pickup/drop destinations, driver allocation, and operational trip status progression (Pending, Confirmed, In Progress, Completed).</li>
          <li><strong>Zero-Login Live Vehicle Tracking:</strong> Empower passengers to view real-time trip status, assigned commercial driver credentials, and vehicle registration details without mandatory account creation.</li>
          <li><strong>Transparent Multi-Package Fare Engine:</strong> Automate verified tariff calculations across Outstation Round Trips (₹20/km with 300 km/day minimum quota), Outstation One-Way drops, Local City Rentals (8h/80km packages), and Airport Transfers.</li>
          <li><strong>Automated Duty Slip & Odometer Billing:</strong> Auto-calculate billable kilometers from starting and closing odometer readings, incorporating Fastag toll charges, parking fees, and driver overnight allowances (Bata).</li>
          <li><strong>Executive Fleet Management Dashboard:</strong> Provide travel proprietors with real-time analytics covering total bookings, active road trips, fleet readiness, daily gross revenue, and pending customer duty slips.</li>
          <li><strong>Customer Digital Trip History:</strong> Allow customers to access and download verified A4 duty slip invoices, payment confirmations, and historical trip logs using verified phone lookup.</li>
          <li><strong>Public Travel Booking Wizard:</strong> Intuitive 3-step online reservation form allowing prospective travelers to request journeys, select preferred vehicle configurations, and receive immediate fare estimates.</li>
          <li><strong>Role-Based Security & Endpoint Guards:</strong> Strict authorization separating Fleet Administrator (ROLE_ADMIN) command privileges from unauthenticated public guest travelers.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 1 of 44</span>
      </div>
    </div>
  `);

  // Page 2 of 44: 1.3 Scope and Limitations
  pages.push(`
    <div class="a4-page" id="page-2">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">1.3 Scope and Limitations of the Project</h3>
        <p>
          The <strong>Kadjai Travels</strong> platform is designed to establish an end-to-end digital lifecycle for tourist transport operations, bridging the communication and operational gap between passengers, commercial drivers, and travel proprietors. Defining a precise operational boundary ensures focused implementation, robust stability, and predictable production deployments.
        </p>

        <h3 class="section-title">A. Functional Scope (Included Modules):</h3>
        <ul class="academic-list">
          <li><strong>Zero-Login Live Vehicle Tracker:</strong> Enables any traveler to track live trip progression, assigned commercial driver, and vehicle license plate using only their booking reference ID and phone number, completely removing login friction.</li>
          <li><strong>Digital Booking & Dispatch Lifecycle:</strong> Digitizes customer intake, vehicle availability verification, driver allocation, and status transitions (Enquiry Received, Confirmed, Dispatched, Trip In Progress, Completed).</li>
          <li><strong>Dynamic Fare Estimation Engine:</strong> Enforces verified commercial travel pricing across Outstation Round Trips (₹20/km, 300 km/day minimum), Outstation One-Way drops, Local City Rentals (8h/80km package), and Airport Transfers to CSMIA T1/T2.</li>
          <li><strong>Automated Duty Slip & Odometer Billing:</strong> Captures physical opening and closing odometer readings, calculates billable kilometers against daily minimum thresholds, and generates official A4 printable duty slips with Fastag toll, parking, and driver allowance breakdowns.</li>
          <li><strong>Executive Fleet Analytics:</strong> Provides travel proprietors with live operational KPIs, including active road trips, driver duty schedules, gross revenue totals, and pending customer settlements.</li>
        </ul>

        <h3 class="section-title">B. Project Limitations (Boundary Constraints):</h3>
        <ul class="academic-list">
          <li><strong>Primary Dedicated Fleet Scope:</strong> The operational implementation is optimized for the business's verified tourist vehicle fleet (featuring the 6+1 AC Luxury Maruti Suzuki Ertiga) and does not currently manage massive cross-state multi-hub corporate bus depots.</li>
          <li><strong>Payment Processing Architecture:</strong> Payment settlement currently registers verified transaction confirmation modes (Cash, UPI QR, and Card) and prepares digital tax duty slips, avoiding third-party escrow lock-in.</li>
          <li><strong>Cellular SMS & GPS Simulation:</strong> Real-time journey milestones stream via zero-login web sockets and responsive URLs; live coordinates are simulated via discrete route checkpoints without demanding expensive proprietary in-vehicle OBD GPS black-boxes.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 2 of 44</span>
      </div>
    </div>
  `);

  // Page 3 of 44: 1.4 Hardware & Software Requirements Specification
  pages.push(`
    <div class="a4-page" id="page-3">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">1.4 Hardware and Software Requirements Specification</h3>
        <p>
          The system is designed with a lightweight, cloud-native footprint, allowing travel desk staff and dispatchers to operate the application on budget-friendly desktop PCs, tablets, or mobile phones, while leveraging scalable server infrastructure for backend REST APIs and relational persistence.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 6px 0 3px 0; color: #0f172a;">Table 1.4.1: Hardware Requirements Specification</h4>
        <table class="academic-table">
          <thead>
            <tr>
              <th style="width: 28%;">Component</th>
              <th style="width: 36%;">Minimum Requirement</th>
              <th style="width: 36%;">Recommended Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Processor (CPU)</td>
              <td>Dual Core Intel Core i3 / AMD Ryzen 3 (2.0 GHz)</td>
              <td>Quad Core Intel Core i5 / AMD Ryzen 5 (3.0 GHz+)</td>
            </tr>
            <tr>
              <td>Memory (RAM)</td>
              <td>4 GB DDR4 RAM for client dispatch terminals</td>
              <td>8 GB – 16 GB DDR4/DDR5 for server execution and caching</td>
            </tr>
            <tr>
              <td>Hard Disk / Storage</td>
              <td>128 GB SATA SSD (at least 15 GB free space)</td>
              <td>256 GB NVMe M.2 SSD for rapid asset caching and database I/O</td>
            </tr>
            <tr>
              <td>Display Resolution</td>
              <td>1366 x 768 standard desktop / 768 x 1024 tablet</td>
              <td>1920 x 1080 Full HD IPS display for fleet analytics</td>
            </tr>
            <tr>
              <td>Network Connectivity</td>
              <td>Broadband internet (minimum 5 Mbps)</td>
              <td>Stable high-speed broadband (25 Mbps+ with 4G/5G failover)</td>
            </tr>
            <tr>
              <td>Client Peripherals</td>
              <td>Standard keyboard, mouse, smartphone screen</td>
              <td>Standard A4 laser printer for official duty slips</td>
            </tr>
          </tbody>
        </table>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 6px 0 3px 0; color: #0f172a;">Table 1.4.2: Software Requirements Specification</h4>
        <table class="academic-table">
          <thead>
            <tr>
              <th style="width: 25%;">Layer / Environment</th>
              <th style="width: 40%;">Technology / Software Specification</th>
              <th style="width: 35%;">Version / Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operating System</td>
              <td>Microsoft Windows 11 / 10 Pro or Ubuntu Linux 22.04 LTS</td>
              <td>Host OS for local development and cloud execution</td>
            </tr>
            <tr>
              <td>Backend Runtime</td>
              <td>Node.js 20 LTS (Long Term Support) runtime environment</td>
              <td>V8 JavaScript engine providing asynchronous non-blocking I/O</td>
            </tr>
            <tr>
              <td>Backend Framework</td>
              <td>Express.js Web Application Framework</td>
              <td>Version 4.19+ for building robust stateless REST API endpoints</td>
            </tr>
            <tr>
              <td>Security Middleware</td>
              <td>JSON Web Token (jsonwebtoken) & BCrypt.js</td>
              <td>Enforces stateless JWT authentication and salted password hashing</td>
            </tr>
            <tr>
              <td>Database Tier</td>
              <td>SQLite 3 Relational Database Engine</td>
              <td>Configured with Write-Ahead Logging (WAL) and ACID transactions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 3 of 44</span>
      </div>
    </div>
  `);

  // Page 4 of 44: Software Req cont., 1.5 Stakeholders & 1.6 Comparative Study
  pages.push(`
    <div class="a4-page" id="page-4">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <table class="academic-table" style="margin-top: 0; margin-bottom: 8px;">
          <thead>
            <tr>
              <th style="width: 25%;">Layer / Environment</th>
              <th style="width: 40%;">Technology / Software Specification</th>
              <th style="width: 35%;">Version / Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Frontend Engine</td>
              <td>React 18 Single Page Application with ES Modules</td>
              <td>Provides declarative UI state management and component reusability</td>
            </tr>
            <tr>
              <td>Build Tool & Bundler</td>
              <td>Vite 5 Bundler and Development Server</td>
              <td>Delivers lightning-fast Hot Module Replacement (HMR) and tree-shaking</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">1.5 Stakeholders</h3>
        <table class="academic-table" style="margin-bottom: 8px;">
          <thead>
            <tr>
              <th style="width: 30%;">Stakeholder</th>
              <th style="width: 70%;">Role and Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Technical Team</td>
              <td>Develop, maintain, secure, and deploy the React frontend, Express API, and SQLite database. Ensure system uptime and security.</td>
            </tr>
            <tr>
              <td>Fleet Drivers / Field Staff</td>
              <td>Operate tourist vehicles, report opening and closing odometer readings, record toll receipts, and update trip execution status.</td>
            </tr>
            <tr>
              <td>End Users (Travelers / Passengers)</td>
              <td>Calculate trip estimates, request bookings, track live vehicle status via booking reference ID, and download official duty slips.</td>
            </tr>
            <tr>
              <td>Fleet Owner / Client (Ramasre Bhagat)</td>
              <td>Supervise daily travel operations, allocate drivers, approve bookings, track gross revenue, and settle completed customer bills.</td>
            </tr>
            <tr>
              <td>System Architect & Developer (Yash Bhagat)</td>
              <td>Design domain models, implement REST endpoints, configure SQLite schemas, build responsive UI components, and author documentation.</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">1.6 System in use (Comparative Study)</h3>
        <table class="academic-table" style="margin-bottom: 4px;">
          <thead>
            <tr>
              <th style="width: 22%;">Feature</th>
              <th style="width: 26%;">Traditional Travel Agents</th>
              <th style="width: 26%;">Existing Aggregators (Ola/Uber)</th>
              <th style="width: 26%;">Kadjai Travels (Proposed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Booking Management</td>
              <td>Manual paper diaries and phone coordination</td>
              <td>Algorithmic instant dispatch without fixed vehicle guarantee</td>
              <td>Cloud-native digital booking desk with dedicated Ertiga fleet allocation</td>
            </tr>
            <tr>
              <td>Vehicle Repair / Ride Tracking</td>
              <td>Uncertain phone calls to driver and counter visits</td>
              <td>Mandatory app download and constant phone GPS drainage</td>
              <td>Instant Zero-Login live tracking by booking reference ID and phone</td>
            </tr>
            <tr>
              <td>Fare Transparency & Tolls</td>
              <td>Verbal estimates; post-trip toll and Bata disputes</td>
              <td>Dynamic surge pricing with hidden toll adjustments</td>
              <td>Upfront transparent tariffs with itemized Fastag and driver Bata calculations</td>
            </tr>
            <tr>
              <td>Duty Slip & Invoicing</td>
              <td>Handwritten carbon slips with disputed meter readings</td>
              <td>Generic PDF receipts without physical odometer verification</td>
              <td>Automated A4 duty slips recording starting and closing odometer readings</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 4 of 44</span>
      </div>
    </div>
  `);

  // Page 5 of 44: Comparative Study cont. & 1.7 Technology Stack
  pages.push(`
    <div class="a4-page" id="page-5">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">1.6 System in use (Comparative Study - Continued)</h3>
        <table class="academic-table" style="margin-bottom: 8px;">
          <thead>
            <tr>
              <th style="width: 22%;">Feature</th>
              <th style="width: 26%;">Traditional Travel Agents</th>
              <th style="width: 26%;">Existing Aggregators</th>
              <th style="width: 26%;">Kadjai Travels (Proposed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Customer History</td>
              <td>Lost physical records; no maintenance log</td>
              <td>Scattered in-app ride logs without business duty slips</td>
              <td>Centralized digital customer portal with complete historical duty slips</td>
            </tr>
            <tr>
              <td>Authentication & Security</td>
              <td>No security controls; open physical ledger access</td>
              <td>Complex OTP/OAuth with mandatory passenger accounts</td>
              <td>Stateless JWT token authentication for owner; zero-friction public lookup</td>
            </tr>
            <tr>
              <td>Database Tier</td>
              <td>Physical paper files and notebooks</td>
              <td>Proprietary closed-source distributed databases</td>
              <td>Relational SQLite engine with WAL mode and ACID transactional safety</td>
            </tr>
            <tr>
              <td>Fleet & Driver Allocation</td>
              <td>Ad-hoc verbal instructions to drivers</td>
              <td>Automated blind allocation to nearest driver</td>
              <td>Owner-controlled allocation ensuring verified Ertiga luxury vehicle readiness</td>
            </tr>
            <tr>
              <td>Advance Booking</td>
              <td>Verbal promises prone to overbooking</td>
              <td>Short-notice dispatch often cancelled by drivers</td>
              <td>Scheduled outstation and airport bookings confirmed with reference IDs</td>
            </tr>
            <tr>
              <td>Accessibility</td>
              <td>Accessible only physically inside travel office</td>
              <td>Restricted to mobile native application apps</td>
              <td>Fully cloud-accessible on mobile, tablet, and desktop web browsers</td>
            </tr>
            <tr>
              <td>Security Controls</td>
              <td>None; prone to loss and ledger tampering</td>
              <td>App permissions tracking location 24/7</td>
              <td>HTTPS, CORS allowlist, rate limiting, and zero exposure of sensitive data</td>
            </tr>
            <tr>
              <td>Overall Benefit</td>
              <td>Slow, unorganized, and prone to revenue leakage</td>
              <td>High commission cuts (25-30%) hurting operators</td>
              <td>Direct-to-proprietor digital platform with zero third-party commission</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">1.7 Technology Stack</h3>
        <table class="academic-table" style="margin-bottom: 4px;">
          <thead>
            <tr>
              <th style="width: 32%;">Layer</th>
              <th style="width: 68%;">Technology Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Frontend Framework</td>
              <td>React 18 Single Page Application with JSX & Hooks architecture</td>
            </tr>
            <tr>
              <td>Build Tool & Bundler</td>
              <td>Vite 5 (Lightning-fast HMR and optimized production tree-shaking)</td>
            </tr>
            <tr>
              <td>Styling & Design System</td>
              <td>Tailwind CSS with responsive mobile-first typography and custom color tokens</td>
            </tr>
            <tr>
              <td>Client Routing & Icons</td>
              <td>Hash/History Navigation with Lucide React 0.440 modern vector icons</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 5 of 44</span>
      </div>
    </div>
  `);

  // Page 6 of 44: Technology Stack (Continued) & Architecture Rationale
  pages.push(`
    <div class="a4-page" id="page-6">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">1.7 Technology Stack (Continued)</h3>
        <table class="academic-table" style="margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="width: 32%;">Layer</th>
              <th style="width: 68%;">Technology Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data Visualization</td>
              <td>Custom responsive SVG chart components for monthly booking trends and revenue</td>
            </tr>
            <tr>
              <td>Backend Application Server</td>
              <td>Node.js 20 LTS with Express 4 RESTful API framework</td>
            </tr>
            <tr>
              <td>Security & Auth</td>
              <td>Stateless JSON Web Tokens (jsonwebtoken) with BCrypt.js password hashing</td>
            </tr>
            <tr>
              <td>Data Access / Persistence</td>
              <td>SQLite 3 with better-sqlite3 / sqlite3 driver configured with Write-Ahead Logging (WAL)</td>
            </tr>
            <tr>
              <td>Document Engine</td>
              <td>Printable vector A4 HTML/CSS duty slip engine with browser print styling</td>
            </tr>
            <tr>
              <td>Testing Framework</td>
              <td>Node.js native test runner and Vitest for automated integration and fare math tests</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">1.8 Architectural Rationale & Design Philosophy</h3>
        <p>
          The technology choices for Kadjai Travels were driven by the real-world operational requirements of a tourist car rental business:
        </p>
        <ul class="academic-list">
          <li><strong>Zero-Friction Customer Experience:</strong> Requiring passenger sign-ups before allowing fare estimates or trip tracking creates high drop-off rates. Implementing <em>Zero-Login Vehicle Tracking</em> using booking reference IDs ensures immediate accessibility on any mobile device.</li>
          <li><strong>Lightweight Single-Server Architecture:</strong> Unlike bloated enterprise microservices requiring expensive cloud cluster orchestration, an Express and SQLite architecture provides sub-millisecond local query latencies, zero external database maintenance costs, and robust ACID compliance suitable for small travel enterprises.</li>
          <li><strong>Precision Decimal Fare Calculations:</strong> Transport tariffs involve strict per-kilometer rates, driver overnight Bata, and minimum daily distance quotas. The fare calculator engine is designed with deterministic, decimal-safe integer arithmetic to eliminate floating-point rounding errors.</li>
          <li><strong>Standardized A4 Printable Output:</strong> Commercial drivers and business clients require physical proof of vehicle dispatch. The duty slip generation module generates pixel-perfect A4 printable documents directly conforming to Indian Motor Vehicles Act standards.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 6 of 44</span>
      </div>
    </div>
  `);

  return pages;
}

module.exports = { getChapter1Pages };
