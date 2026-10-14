// scripts/pages/chapter5_to_8.cjs
// Chapters 5 to 8 (Pages 38 to 44 of 44)

function getChapters5To8Pages() {
  const pages = [];

  // Page 38 of 44: Chapter 5 TESTING | 5.1 Testing Methodology & Environment
  pages.push(`
    <div class="a4-page" id="page-38">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 5</h1>
        <h2 class="chapter-subtitle">TESTING</h2>

        <h3 class="section-title">5.1 Testing Methodology and Environment</h3>
        <p>
          The <strong>Kadjai Travels</strong> vehicle and customer management system was rigorously verified using black-box functional testing, 
          white-box integration testing, and automated security penetration checks. Test environments encompassed local developer containers, 
          Node.js test runners, and the production cloud deployment infrastructure.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 8px 0 4px 0; color: #0f172a;">Table 5.1.1: Testing Environment Specifications</h4>
        <table class="academic-table">
          <thead>
            <tr>
              <th style="width: 30%;">Item</th>
              <th style="width: 70%;">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operating Systems</td>
              <td>Windows 11 Professional & Ubuntu Linux 22.04 LTS</td>
            </tr>
            <tr>
              <td>Web Browsers</td>
              <td>Google Chrome 128+, Microsoft Edge 128+, Mozilla Firefox 130+, Mobile Safari iOS 17+</td>
            </tr>
            <tr>
              <td>Frontend Engine</td>
              <td>React 18.3, Vite 5.4, Tailwind CSS 3.4, Lucide React</td>
            </tr>
            <tr>
              <td>Backend Framework</td>
              <td>Node.js 20 LTS, Express 4.19, JSON Web Token (jsonwebtoken 9.0)</td>
            </tr>
            <tr>
              <td>Database Tier</td>
              <td>SQLite 3 Relational Database Engine (better-sqlite3 with WAL mode)</td>
            </tr>
            <tr>
              <td>Testing Frameworks</td>
              <td>Node.js native test runner (node:test) and automated curl API verification scripts</td>
            </tr>
            <tr>
              <td>Cloud Deployment</td>
              <td>Vercel Global Edge CDN (Frontend) & Node.js Application Host</td>
            </tr>
            <tr>
              <td>Testing Devices</td>
              <td>Desktop Counter (1920x1080), Tablet (768x1024), Mobile Viewports (375x667, 390x844)</td>
            </tr>
            <tr>
              <td>Security Testing</td>
              <td>JWT expiry validation, role authorization guards, rate-limit brute-force protection, SQL injection guards</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 38 of 44</span>
      </div>
    </div>
  `);

  // Page 39 of 44: 5.2 Unit, Integration and Security Testing
  pages.push(`
    <div class="a4-page" id="page-39">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">5.2 Unit, Integration and Security Testing</h3>
        <p>
          A multi-tiered quality assurance strategy was implemented to guarantee mathematical precision, data persistence integrity, 
          and system security:
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 8px 0 2px 0; color: #0f172a;">1. Unit Testing:</h4>
        <p>
          Verified isolated business logic modules, including the core fare calculation engine (<code>calculateTripFare</code>), 
          daily calendar quota enforcement (300 km/day minimum on round trips), driver overnight Bata additions, Fastag toll rounding, 
          and closing odometer billable mileage calculation. Deterministic tests ensured zero floating-point arithmetic errors.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 8px 0 2px 0; color: #0f172a;">2. Integration Testing:</h4>
        <p>
          Verified end-to-end operational data flows connecting the React frontend to Express REST endpoints and the SQLite database. 
          Tested the complete booking lifecycle: customer reservation enquiry submission, collision-resistant reference generation, 
          fleet vehicle assignment, driver allocation, and status advancement through to official duty slip archiving.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 8px 0 2px 0; color: #0f172a;">3. Security and Authorization Testing:</h4>
        <p>
          Tested unauthenticated access attempts against protected administrative endpoints (<code>/api/admin/**</code> and <code>/api/duty-slips</code>) 
          to confirm HTTP 401 Unauthorized and HTTP 403 Forbidden enforcement. Tested tampered JWT tokens with modified signatures and expired timestamps 
          to ensure immediate rejection. Verified customer phone verification guards on duty slip retrievals.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 8px 0 2px 0; color: #0f172a;">4. Robustness & Exception Handling Testing:</h4>
        <p>
          Simulated network latency, invalid parameter payloads, malformed phone strings, and concurrent SQLite reads to confirm structured 
          JSON error response envelopes, zero crash restarts, and shielding of internal database file paths.
        </p>
      </div>
      <div class="page-footer">
        <span>Page 39 of 44</span>
      </div>
    </div>
  `);

  // Page 40 of 44: 5.3 Master Test Case Matrix (TC-01 to TC-10)
  pages.push(`
    <div class="a4-page" id="page-40">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">5.3 Master Test Case Matrix</h3>
        <table class="academic-table" style="font-size: 7.8pt; line-height: 1.25;">
          <thead>
            <tr>
              <th style="width: 8%;">ID</th>
              <th style="width: 20%;">Feature</th>
              <th style="width: 22%;">Input / Action</th>
              <th style="width: 25%;">Expected Result</th>
              <th style="width: 20%;">Actual Result</th>
              <th style="width: 5%;">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TC-01</td>
              <td>Zero-Login Tracker</td>
              <td>Ref: KT-2026-0814, Phone: 9876543210</td>
              <td>Returns active trip card with 4-stage progress stepper</td>
              <td>Live stepper rendered with driver & Ertiga plate</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-02</td>
              <td>Unknown Booking Query</td>
              <td>Ref: KT-9999-XXXX</td>
              <td>Returns 404 NOT_FOUND with helpful contact banner</td>
              <td>Displayed customer help desk call banner</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-03</td>
              <td>Admin Login</td>
              <td>Valid email & BCrypt password</td>
              <td>HTTP 200 with JWT Bearer token & Admin role claims</td>
              <td>Token saved; navigated to Command Center</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-04</td>
              <td>Invalid Login</td>
              <td>Incorrect password</td>
              <td>HTTP 401 with 'Bad credentials' error response</td>
              <td>Displayed 'Invalid credentials' notification toast</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-05</td>
              <td>Create Booking Enquiry</td>
              <td>Route: Mumbai to Shirdi, Phone, Ertiga</td>
              <td>New booking generated with status PENDING & reference ID</td>
              <td>Booking persisted with unique KT reference code</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-06</td>
              <td>Fare Calculation (Round Trip)</td>
              <td>2 Days, 400 km entered</td>
              <td>Enforces 600 km quota @ ₹20/km + ₹800 Bata</td>
              <td>Computed exactly ₹12,800 + toll estimates</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-07</td>
              <td>Minimum Daily Quota</td>
              <td>1 Day Round Trip, 120 km</td>
              <td>Enforces 300 km daily minimum instead of 120 km</td>
              <td>Billable km set to 300 km; base fare ₹6,000</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-08</td>
              <td>Update Trip Stage</td>
              <td>Advance to 'In Progress' with start odometer</td>
              <td>Stage persisted; live public tracker reflects change</td>
              <td>Tracker stepper turns active on Stage 3</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-09</td>
              <td>Duty Slip Generation</td>
              <td>Closing KM 42,860, Tolls ₹450</td>
              <td>Subtotal computed; tolls added; slip marked PAID</td>
              <td>Grand total accurate; Invoice marked PAID</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-10</td>
              <td>Role Guard Check</td>
              <td>Customer calls /api/admin/**</td>
              <td>HTTP 401/403 Forbidden returned by Express JWT middleware</td>
              <td>Access blocked; redirected to customer login</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 40 of 44</span>
      </div>
    </div>
  `);

  // Page 41 of 44: 5.3 Master Test Case Matrix (Continued: TC-11 to TC-15)
  pages.push(`
    <div class="a4-page" id="page-41">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">5.3 Master Test Case Matrix (Continued)</h3>
        <table class="academic-table" style="font-size: 7.8pt; line-height: 1.25; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="width: 8%;">ID</th>
              <th style="width: 20%;">Feature</th>
              <th style="width: 22%;">Input / Action</th>
              <th style="width: 25%;">Expected Result</th>
              <th style="width: 20%;">Actual Result</th>
              <th style="width: 5%;">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TC-11</td>
              <td>Customer Duty Slip Lookup</td>
              <td>View past duty slip with phone number</td>
              <td>Displays duty slip matching phone ID with itemized costs</td>
              <td>Rendered verified duty slip and completed run details</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-12</td>
              <td>Airport Transfer Package</td>
              <td>Submit CSMIA Terminal 2 booking</td>
              <td>Creates airport package booking with status PENDING</td>
              <td>Booking saved; confirmed on rider screen</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-13</td>
              <td>Printable Duty Slip View</td>
              <td>Print A4 duty slip button</td>
              <td>Renders compact printable official A4 duty slip layout</td>
              <td>Formatted A4 duty slip displayed in print preview</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-14</td>
              <td>Tampered JWT Token</td>
              <td>Alter signature characters in Bearer token</td>
              <td>HTTP 403 Forbidden; immediate token rejection</td>
              <td>Request blocked; session cleared immediately</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
            <tr>
              <td>TC-15</td>
              <td>Brute-Force Rate Limiting</td>
              <td>15 consecutive failed login attempts</td>
              <td>HTTP 429 Too Many Requests; IP rate-limited for 15 mins</td>
              <td>Login locked; message 'Too many login attempts'</td>
              <td class="center" style="font-weight: 800; color: #15803d;">PASS</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">5.4 Summary of Verification Results</h3>
        <p>
          All fifteen master test cases (TC-01 through TC-15) achieved a <strong>100% PASS rate</strong>. 
          The automated test harness verified that the fare engine correctly handles all edge cases (minimum daily distance quotas, 
          night allowances, Fastag tolls), the SQLite database correctly enforces transaction atomicity during status updates, 
          and the JWT security middleware completely shields owner operations from unauthorized public tampering.
        </p>
      </div>
      <div class="page-footer">
        <span>Page 41 of 44</span>
      </div>
    </div>
  `);

  // Page 42 of 44: Chapter 6 CONCLUSION AND FUTURE SCOPE
  pages.push(`
    <div class="a4-page" id="page-42">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 6</h1>
        <h2 class="chapter-subtitle">CONCLUSION AND FUTURE SCOPE</h2>

        <h3 class="section-title">6.1 Conclusion</h3>
        <p>
          The <strong>Kadjai Travels</strong> tourist vehicle and customer trip management platform provides a modern, cloud-native solution for 
          regional tourist transport and car charter operators. By replacing manual paper registers with automated digital bookings, providing 
          zero-login live vehicle trip tracking, linking physical opening and closing odometer readings directly to trip calculations, and automating 
          official A4 duty slip billing, the system eliminates administrative bottlenecks, prevents Fastag toll disputes, and delivers full pricing 
          transparency to travelers.
        </p>
        <p>
          Developed with a responsive <strong>React 18</strong> and <strong>Tailwind CSS</strong> frontend, a secure <strong>Node.js and Express REST API</strong> 
          backend, and local persistence on an embedded <strong>SQLite database</strong> configured with Write-Ahead Logging (WAL) and foreign key integrity, 
          the platform offers exceptional reliability, enterprise-grade security, and high performance across mobile, tablet, and desktop travel desk environments.
        </p>

        <h3 class="section-title">6.2 Future Scope</h3>
        <ul class="academic-list">
          <li><strong>Automated WhatsApp Notifications:</strong> Integrate the WhatsApp Business Cloud API to automatically dispatch live booking confirmations, driver contact cards, and downloadable PDF duty slips directly to customer mobile phones.</li>
          <li><strong>Direct Fastag RFID Gateway:</strong> Connect directly to NETC Fastag APIs to automatically pull live highway toll plaza transaction logs into the trip duty slip in real time.</li>
          <li><strong>Driver Native Mobile Application:</strong> Develop a dedicated React Native mobile app for commercial drivers featuring 1-tap odometer photo capture, offline GPS checkpoint logging, and digital customer signature pads.</li>
          <li><strong>Multi-Vehicle Fleet Scheduling:</strong> Extend the database model to support multi-vehicle fleet operations with automated preventive maintenance schedules, tyre rotation logs, and insurance renewal alerts.</li>
          <li><strong>Integrated Payment Gateway:</strong> Integrate UPI Deep-Linking (Razorpay / Cashfree) for instant zero-fee customer payment settlements and digital receipt dispatch.</li>
          <li><strong>OBD-II Telemetry Interface:</strong> Integrate Bluetooth OBD-II vehicle diagnostic scanners to automatically ingest real-time odometer readings and engine telemetry directly from the vehicle CAN bus.</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 42 of 44</span>
      </div>
    </div>
  `);

  // Page 43 of 44: Chapter 7 UNDERTAKING
  pages.push(`
    <div class="a4-page" id="page-43">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body" style="padding: 10mm 10mm 15mm 10mm;">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 7</h1>
        <h2 class="chapter-subtitle">UNDERTAKING</h2>

        <p style="font-size: 11pt; line-height: 1.8; margin-bottom: 16px;">
          I, <strong>Yash Ramasre Bhagat</strong>, a candidate for the degree of <strong>Bachelor of Science in Computer Science</strong>, 
          hereby undertake that:
        </p>

        <ol class="academic-list" style="font-size: 10.5pt; line-height: 1.8; margin-left: 20px; margin-bottom: 24px;">
          <li style="margin-bottom: 12px;">The project work presented in <strong>“Kadjai Travels: Tourist Vehicle & Customer Trip Management System”</strong> is my original work, carried out under academic supervision.</li>
          <li style="margin-bottom: 12px;">The source code, database structure, system design, UML diagrams, and related documentation were developed specifically for this project.</li>
          <li style="margin-bottom: 12px;">Proper acknowledgement has been given for all third-party libraries, frameworks, tools, and technologies used in the project, including Node.js, Express, React 18, Vite 5, Tailwind CSS, SQLite 3, JWT, BCrypt, and Vercel, along with all references and resources used.</li>
        </ol>

        <div style="margin-top: 45mm; font-family: 'Plus Jakarta Sans', sans-serif;">
          <p style="font-size: 11pt; margin-bottom: 6px;"><strong>Date:</strong> _____ / ___ / 2026</p>
          <p style="font-size: 11pt; margin-bottom: 30mm;"><strong>Place:</strong> Mumbai</p>
          <div style="border-top: 1.2pt solid #0f172a; width: 220px; margin-bottom: 4px;"></div>
          <p style="font-size: 11pt; font-weight: 800; color: #0f172a;">Signature Of the Student</p>
          <p style="font-size: 10pt; color: #475569;">Yash Ramasre Bhagat (Roll No.: T072)</p>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 43 of 44</span>
      </div>
    </div>
  `);

  // Page 44 of 44: Chapter 8 BIBLIOGRAPHY AND REFERENCES
  pages.push(`
    <div class="a4-page" id="page-44">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 8</h1>
        <h2 class="chapter-subtitle">BIBLIOGRAPHY AND REFERENCES</h2>

        <ul class="academic-list" style="font-size: 9pt; line-height: 1.5; margin-left: 20px;">
          <li style="margin-bottom: 8px;">
            <strong>Node.js Documentation:</strong> Building Scalable Network Applications with Node.js LTS Runtime, OpenJS Foundation.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://nodejs.org/docs/latest-v20.x/api/</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Express Framework Documentation:</strong> Fast, Unopinionated, Minimalist Web Framework for Node.js, Express Technical Committee.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://expressjs.com/en/4x/api.html</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>React Framework Documentation:</strong> React 18 Single Page Applications & Functional Hooks Architecture, Meta Open Source.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://react.dev</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>SQLite Global Database Group:</strong> SQLite 3 In-Process Relational Database Engine & Write-Ahead Logging (WAL) Architecture, D. Richard Hipp et al.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://www.sqlite.org/docs.html</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Tailwind CSS Documentation:</strong> Utility-First CSS Framework for Rapid UI Development, Tailwind Labs Inc.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://tailwindcss.com/docs</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Auth0 & JJWT Documentation:</strong> JSON Web Tokens (JWT) Architecture (RFC 7519) & HMAC-SHA256 Stateless Token Specification.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://jwt.io/introduction</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Vite Bundler Documentation:</strong> Next Generation Frontend Tooling with Lightning-Fast Hot Module Replacement (HMR), Evan You & Vite Contributors.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://vitejs.dev/guide/</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Vercel Cloud Platform:</strong> Deploying Modern Single Page Applications on Edge CDN Infrastructure, Vercel Inc.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://vercel.com/docs</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>Motor Vehicles Act & Tourist Permit Regulations:</strong> Ministry of Road Transport and Highways (MoRTH), Government of India.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://morth.nic.in/motor-vehicles-act-1988</span>
          </li>
          <li style="margin-bottom: 8px;">
            <strong>GitHub Documentation:</strong> Git Version Control & Team Repository Management, GitHub Inc.<br>
            <span style="color: #0284c7; font-family: 'JetBrains Mono', monospace; font-size: 8pt;">https://docs.github.com/</span>
          </li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 44 of 44</span>
      </div>
    </div>
  `);

  return pages;
}

module.exports = { getChapters5To8Pages };
