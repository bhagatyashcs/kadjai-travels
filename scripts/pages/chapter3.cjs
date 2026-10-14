// scripts/pages/chapter3.cjs
// Chapter 3: SYSTEM DESIGN (Pages 12 to 24 of 44)

function getChapter3Pages() {
  const pages = [];

  // Page 12 of 44: 3.1 Use Case Diagram and Specification (Figure 3.1)
  pages.push(`
    <div class="a4-page" id="page-12">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h1 class="chapter-title" style="margin-top: 4px;">Chapter 3</h1>
        <h2 class="chapter-subtitle">SYSTEM DESIGN</h2>

        <h3 class="section-title">3.1 Use Case Diagram and Specification</h3>
        <p>
          Figure 3.1 illustrates the system boundary and interactions between the four key actors: <strong>Guest Traveler</strong>, 
          <strong>Registered Passenger</strong>, <strong>Commercial Driver</strong>, and <strong>Fleet Operations Dispatcher / Proprietor</strong>. 
          Unregistered travelers can calculate transparent fares and track active trip status zero-login. Drivers record physical odometer readings 
          and execute assigned journeys. Fleet dispatchers possess complete administrative control over booking confirmation, vehicle allocation, 
          duty slip generation, and revenue reconciliation.
        </p>

        <!-- Figure 3.1 Use Case Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 310" class="vector-diag" style="height: 102mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- Boundary Box -->
            <rect x="180" y="15" width="290" height="280" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="1.2" stroke-dasharray="4,4"/>
            <text x="325" y="32" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle" fill="#0f172a">Kadjai Travels Platform Boundary</text>

            <!-- Actors -->
            <!-- Passenger -->
            <circle cx="80" cy="85" r="14" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.2"/>
            <line x1="80" y1="99" x2="80" y2="130" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="60" y1="110" x2="100" y2="110" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="80" y1="130" x2="65" y2="155" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="80" y1="130" x2="95" y2="155" stroke="#0f172a" stroke-width="1.5"/>
            <text x="80" y="170" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Passenger</text>

            <!-- Driver -->
            <circle cx="80" cy="215" r="14" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.2"/>
            <line x1="80" y1="229" x2="80" y2="260" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="60" y1="240" x2="100" y2="240" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="80" y1="260" x2="65" y2="285" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="80" y1="260" x2="95" y2="285" stroke="#0f172a" stroke-width="1.5"/>
            <text x="80" y="300" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Chauffeur / Driver</text>

            <!-- Dispatcher -->
            <circle cx="570" cy="135" r="14" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.2"/>
            <line x1="570" y1="149" x2="570" y2="180" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="550" y1="160" x2="590" y2="160" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="570" y1="180" x2="555" y2="205" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="570" y1="180" x2="585" y2="205" stroke="#0f172a" stroke-width="1.5"/>
            <text x="570" y="220" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Fleet Dispatcher</text>

            <!-- Use Cases (Ovals) -->
            <ellipse cx="325" cy="55" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="59" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Calculate Transparent Fares</text>

            <ellipse cx="325" cy="95" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="99" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Submit Online Booking Request</text>

            <ellipse cx="325" cy="135" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="139" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Zero-Login Live Trip Tracking</text>

            <ellipse cx="325" cy="175" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="179" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Record Start & End Odometer</text>

            <ellipse cx="325" cy="215" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="219" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Allocate Driver & Vehicle</text>

            <ellipse cx="325" cy="255" rx="90" ry="15" fill="#ffffff" stroke="#1e293b" stroke-width="1"/>
            <text x="325" y="259" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="600" text-anchor="middle">Print Official A4 Duty Slip</text>

            <!-- Relationship Connectors -->
            <line x1="95" y1="95" x2="235" y2="55" stroke="#64748b" stroke-width="1"/>
            <line x1="95" y1="105" x2="235" y2="95" stroke="#64748b" stroke-width="1"/>
            <line x1="95" y1="115" x2="235" y2="135" stroke="#64748b" stroke-width="1"/>
            <line x1="95" y1="235" x2="235" y2="175" stroke="#64748b" stroke-width="1"/>
            <line x1="550" y1="155" x2="415" y2="175" stroke="#64748b" stroke-width="1"/>
            <line x1="550" y1="165" x2="415" y2="215" stroke="#64748b" stroke-width="1"/>
            <line x1="550" y1="175" x2="415" y2="255" stroke="#64748b" stroke-width="1"/>
          </svg>
          <div class="figure-caption">Figure 3.1 – Use Case diagram</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 12 of 44</span>
      </div>
    </div>
  `);

  // Page 13 of 44: Table 3.1 Use Case Dependency Matrix (UC-01 to UC-08)
  pages.push(`
    <div class="a4-page" id="page-13">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">Table 3.1 – Actor and Use Case Dependency Matrix</h3>
        <table class="academic-table" style="margin-top: 4px; margin-bottom: 6px;">
          <thead>
            <tr>
              <th style="width: 10%;">ID</th>
              <th style="width: 28%;">Use Case</th>
              <th style="width: 24%;">Primary Actor</th>
              <th style="width: 18%;">Secondary Actors</th>
              <th style="width: 20%;">Included / Extended Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UC-01</td>
              <td>Zero-Login Vehicle Tracking</td>
              <td>Guest Passenger / Customer</td>
              <td>SQLite Database</td>
              <td>Includes querying by booking reference and phone, rendering live status stepper.</td>
            </tr>
            <tr>
              <td>UC-02</td>
              <td>Online Travel Booking</td>
              <td>Guest Passenger / Customer</td>
              <td>SQLite Database</td>
              <td>Includes package selection, pickup/drop capture, fare estimate preview, and enquiry confirmation.</td>
            </tr>
            <tr>
              <td>UC-03</td>
              <td>Customer Trip History</td>
              <td>Passenger / Customer</td>
              <td>SQLite Database</td>
              <td>Includes phone lookup, past duty slip viewing, and itemized invoice downloads.</td>
            </tr>
            <tr>
              <td>UC-04</td>
              <td>Admin Authentication</td>
              <td>Fleet Dispatcher / Owner</td>
              <td>JWT, BCrypt</td>
              <td>Includes email/password validation, BCrypt hash comparison, and signed JWT token issuance.</td>
            </tr>
            <tr>
              <td>UC-05</td>
              <td>Create & Confirm Booking</td>
              <td>Fleet Dispatcher / Owner</td>
              <td>Driver, Vehicle</td>
              <td>Includes vehicle readiness check, driver assignment, and status transition to CONFIRMED.</td>
            </tr>
            <tr>
              <td>UC-06</td>
              <td>Record Start Odometer</td>
              <td>Driver / Dispatcher</td>
              <td>Duty Slip Module</td>
              <td>Includes logging initial meter reading and departure timestamp before vehicle roll-out.</td>
            </tr>
            <tr>
              <td>UC-07</td>
              <td>Update Trip Execution Stage</td>
              <td>Driver / Dispatcher</td>
              <td>Live Tracker API</td>
              <td>Includes advancing status from Confirmed to Dispatched, In Progress, and Completed.</td>
            </tr>
            <tr>
              <td>UC-08</td>
              <td>Record Tolls & Expenses</td>
              <td>Driver / Dispatcher</td>
              <td>Expense Ledger</td>
              <td>Includes logging Fastag toll deductions, municipal parking receipts, and driver Bata.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 13 of 44</span>
      </div>
    </div>
  `);

  // Page 14 of 44: Table 3.1 (Continued: UC-09, UC-10) & Actor Narrative
  pages.push(`
    <div class="a4-page" id="page-14">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">Table 3.1 – Actor and Use Case Dependency Matrix (Continued)</h3>
        <table class="academic-table" style="margin-top: 4px; margin-bottom: 10px;">
          <thead>
            <tr>
              <th style="width: 10%;">ID</th>
              <th style="width: 28%;">Use Case</th>
              <th style="width: 24%;">Primary Actor</th>
              <th style="width: 18%;">Secondary Actors</th>
              <th style="width: 20%;">Included / Extended Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UC-09</td>
              <td>Generate A4 Duty Slip</td>
              <td>Fleet Dispatcher / Owner</td>
              <td>Calculation Engine, DB</td>
              <td>Includes computing billable distance (max of actual vs quota), adding tolls, driver Bata, and PDF output.</td>
            </tr>
            <tr>
              <td>UC-10</td>
              <td>View Executive Dashboard</td>
              <td>Fleet Dispatcher / Owner</td>
              <td>Analytics Engine</td>
              <td>Includes gross revenue charts, active fleet duty counts, pending bills, and driver allocations.</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">3.1.2 Actor Specification & System Interaction Narratives</h3>
        <p>
          The system boundary strictly decouples privileged administrative operations from public customer self-service actions:
        </p>
        <ul class="academic-list">
          <li><strong>Guest Passenger / Customer:</strong> An unauthenticated user accessing the public portal. The customer can explore fleet offerings, execute real-time fare calculations, submit booking enquiries, and track existing trips using the booking reference ID and contact phone number.</li>
          <li><strong>Fleet Operations Dispatcher (Admin):</strong> The authenticated business proprietor (Ramasre Bhagat) or dispatch operator. The dispatcher reviews incoming booking requests, checks vehicle availability, assigns dedicated commercial drivers, updates trip stages, and generates legal duty slips upon trip conclusion.</li>
          <li><strong>Commercial Driver:</strong> Field staff operating the tourist vehicle. Drivers report physical opening odometer readings at passenger pickup, log en-route Fastag toll receipts and parking charges, and record closing odometer readings upon drop-off.</li>
          <li><strong>SQLite Database Engine:</strong> The underlying persistence actor responsible for enforcing referential constraints, indexing booking reference codes, maintaining atomic transaction boundaries, and executing concurrent reads with zero lock contention via Write-Ahead Logging (WAL).</li>
        </ul>
      </div>
      <div class="page-footer">
        <span>Page 14 of 44</span>
      </div>
    </div>
  `);

  // Page 15 of 44: 3.2 System Flowchart 1 (Figure 3.2.1)
  pages.push(`
    <div class="a4-page" id="page-15">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.2 System Flowchart (Customer Enquiry & Booking Initiation)</h3>
        <p>
          Figure 3.2.1 illustrates the customer intake, travel package selection, distance computation, upfront toll and driver Bata aggregation, 
          and digital booking reference issuance.
        </p>

        <!-- Figure 3.2.1 Flowchart Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 500 350" class="vector-diag" style="height: 115mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <rect x="170" y="10" width="160" height="26" rx="13" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
            <text x="250" y="27" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Customer Arrives on Portal</text>

            <line x1="250" y1="36" x2="250" y2="55" stroke="#0f172a" stroke-width="1"/>

            <rect x="150" y="55" width="200" height="30" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="74" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Select Journey Type & Enter Destinations</text>

            <line x1="250" y1="85" x2="250" y2="105" stroke="#0f172a" stroke-width="1"/>

            <!-- Decision -->
            <polygon points="250,105 325,135 250,165 175,135" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
            <text x="250" y="138" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Trip Category?</text>

            <!-- Branches -->
            <line x1="175" y1="135" x2="90" y2="135" stroke="#0f172a" stroke-width="1"/>
            <line x1="90" y1="135" x2="90" y2="175" stroke="#0f172a" stroke-width="1"/>
            <rect x="20" y="175" width="140" height="30" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="90" y="190" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Local (8h/80km: ₹2,200)</text>
            <text x="90" y="200" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Extra KM @ ₹15/km</text>

            <line x1="250" y1="165" x2="250" y2="175" stroke="#0f172a" stroke-width="1"/>
            <rect x="180" y="175" width="140" height="30" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="190" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">One-Way Drop</text>
            <text x="250" y="200" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Point-to-Point @ ₹20/km</text>

            <line x1="325" y1="135" x2="410" y2="135" stroke="#0f172a" stroke-width="1"/>
            <line x1="410" y1="135" x2="410" y2="175" stroke="#0f172a" stroke-width="1"/>
            <rect x="340" y="175" width="140" height="30" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="410" y="190" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Round Trip Outstation</text>
            <text x="410" y="200" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Min 300km/d @ ₹20/km</text>

            <!-- Convergence -->
            <line x1="90" y1="205" x2="90" y2="230" stroke="#0f172a" stroke-width="1"/>
            <line x1="410" y1="205" x2="410" y2="230" stroke="#0f172a" stroke-width="1"/>
            <line x1="90" y1="230" x2="410" y2="230" stroke="#0f172a" stroke-width="1"/>
            <line x1="250" y1="205" x2="250" y2="245" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="245" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="262" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Compute Base Fare + Fastag Tolls + Driver Bata</text>

            <line x1="250" y1="273" x2="250" y2="290" stroke="#0f172a" stroke-width="1"/>

            <rect x="150" y="290" width="200" height="28" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.2"/>
            <text x="250" y="307" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Issue Booking Ref ID (KT-2026-XXXX)</text>
          </svg>
          <div class="figure-caption">Figure 3.2.1 – System flowchart (Customer Enquiry & Booking Initiation)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 15 of 44</span>
      </div>
    </div>
  `);

  // Page 16 of 44: 3.2 System Flowchart 2 (Figure 3.2.2)
  pages.push(`
    <div class="a4-page" id="page-16">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.2 System Flowchart (Vehicle Dispatch & Driver Allocation)</h3>
        <p>
          Figure 3.2.2 details the operational review of incoming booking requests, tourist vehicle readiness checks, driver roster allocation, 
          and journey confirmation dispatch.
        </p>

        <!-- Figure 3.2.2 Flowchart Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 500 350" class="vector-diag" style="height: 115mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <rect x="160" y="10" width="180" height="26" rx="13" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
            <text x="250" y="27" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Receive Pending Booking Request</text>

            <line x1="250" y1="36" x2="250" y2="55" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="55" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="72" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Owner Reviews Route & Travel Dates</text>

            <line x1="250" y1="83" x2="250" y2="105" stroke="#0f172a" stroke-width="1"/>

            <polygon points="250,105 330,135 250,165 170,135" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
            <text x="250" y="138" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Ertiga Available?</text>

            <!-- No Branch -->
            <line x1="330" y1="135" x2="410" y2="135" stroke="#0f172a" stroke-width="1"/>
            <line x1="410" y1="135" x2="410" y2="175" stroke="#0f172a" stroke-width="1"/>
            <rect x="340" y="175" width="140" height="28" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
            <text x="410" y="192" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Notify Overlap / Alternative</text>

            <!-- Yes Branch -->
            <line x1="250" y1="165" x2="250" y2="195" stroke="#0f172a" stroke-width="1"/>
            <text x="260" y="180" font-size="8" font-weight="bold">Yes</text>

            <rect x="150" y="195" width="200" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="212" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Assign Commercial Driver & Vehicle Plate</text>

            <line x1="250" y1="223" x2="250" y2="245" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="245" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="262" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Update Status: CONFIRMED in SQLite</text>

            <line x1="250" y1="273" x2="250" y2="295" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="295" width="220" height="28" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.2"/>
            <text x="250" y="312" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Dispatch Notification & Trip Manifest</text>
          </svg>
          <div class="figure-caption">Figure 3.2.2 – System flowchart (Vehicle Dispatch & Driver Allocation)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 16 of 44</span>
      </div>
    </div>
  `);

  // Page 17 of 44: 3.2 System Flowchart 3 (Figure 3.2.3)
  pages.push(`
    <div class="a4-page" id="page-17">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.2 System Flowchart (Trip Execution, Odometer Meter & Toll Tracking)</h3>
        <p>
          Figure 3.2.3 shows the physical trip execution workflow, opening odometer reading capture, en-route Fastag toll logging, 
          and closing odometer reading registration upon passenger drop-off.
        </p>

        <!-- Figure 3.2.3 Flowchart Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 500 350" class="vector-diag" style="height: 115mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <rect x="150" y="10" width="200" height="26" rx="13" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
            <text x="250" y="27" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Driver Reports at Pickup Location</text>

            <line x1="250" y1="36" x2="250" y2="55" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="55" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="72" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Log Opening Odometer (Start KM) & Time</text>

            <line x1="250" y1="83" x2="250" y2="105" stroke="#0f172a" stroke-width="1"/>

            <rect x="150" y="105" width="200" height="28" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
            <text x="250" y="122" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Trip In Progress (Live Stepper: Active)</text>

            <line x1="250" y1="133" x2="250" y2="155" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="155" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="172" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Record En-Route Fastag Tolls & Parking</text>

            <line x1="250" y1="183" x2="250" y2="205" stroke="#0f172a" stroke-width="1"/>

            <rect x="150" y="205" width="200" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="222" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Passenger Arrives at Destination Drop</text>

            <line x1="250" y1="233" x2="250" y2="255" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="255" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="272" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Log Closing Odometer (End KM) & Time</text>

            <line x1="250" y1="283" x2="250" y2="305" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="305" width="220" height="28" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.2"/>
            <text x="250" y="322" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Calculate Billable KM = (End KM - Start KM)</text>
          </svg>
          <div class="figure-caption">Figure 3.2.3 – System flowchart (Trip Execution, Odometer Meter & Toll Tracking)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 17 of 44</span>
      </div>
    </div>
  `);

  // Page 18 of 44: 3.2 System Flowchart 4 (Figure 3.2.4)
  pages.push(`
    <div class="a4-page" id="page-18">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.2 System Flowchart (Trip Completion, Duty Slip Generation & Billing Handover)</h3>
        <p>
          Figure 3.2.4 illustrates the concluding phase: daily minimum quota verification, final billing computation (base fare, driver Bata, Fastag toll receipts), 
          official printable A4 duty slip generation, and payment settlement.
        </p>

        <!-- Figure 3.2.4 Flowchart Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 500 350" class="vector-diag" style="height: 115mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <rect x="150" y="10" width="200" height="26" rx="13" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
            <text x="250" y="27" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Total Distance Computed</text>

            <line x1="250" y1="36" x2="250" y2="55" stroke="#0f172a" stroke-width="1"/>

            <rect x="130" y="55" width="240" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="72" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Enforce Package Quota (Max of Actual vs Min KM)</text>

            <line x1="250" y1="83" x2="250" y2="105" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="105" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="122" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Aggregate Tolls + Parking + Driver Bata</text>

            <line x1="250" y1="133" x2="250" y2="155" stroke="#0f172a" stroke-width="1"/>

            <rect x="140" y="155" width="220" height="28" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="172" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">Generate Official A4 Printable Duty Slip</text>

            <line x1="250" y1="183" x2="250" y2="205" stroke="#0f172a" stroke-width="1"/>

            <polygon points="250,205 330,235 250,265 170,235" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
            <text x="250" y="238" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Payment Completed?</text>

            <!-- No Branch -->
            <line x1="170" y1="235" x2="90" y2="235" stroke="#0f172a" stroke-width="1"/>
            <line x1="90" y1="235" x2="90" y2="275" stroke="#0f172a" stroke-width="1"/>
            <rect x="20" y="275" width="140" height="28" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
            <text x="90" y="292" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Mark PENDING Settlement</text>

            <!-- Yes Branch -->
            <line x1="250" y1="265" x2="250" y2="295" stroke="#0f172a" stroke-width="1"/>
            <text x="260" y="280" font-size="8" font-weight="bold">Yes</text>

            <rect x="150" y="295" width="200" height="28" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.2"/>
            <text x="250" y="312" font-family="'Plus Jakarta Sans'" font-size="8" font-weight="700" text-anchor="middle">Mark PAID & Archive in SQLite Ledger</text>
          </svg>
          <div class="figure-caption">Figure 3.2.4 – System flowchart (GST 18% Invoicing & Gate Pass Handover)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 18 of 44</span>
      </div>
    </div>
  `);

  // Page 19 of 44: 3.3 Sequence Diagram 1 (Figure 3.3.1)
  pages.push(`
    <div class="a4-page" id="page-19">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.3 Sequence Diagram (Zero-Login Live Vehicle Tracking)</h3>
        <p>
          Figure 3.3.1 illustrates the asynchronous sequence of public tracking calls. The unauthenticated traveler submits their booking reference 
          code <code>KT-2026-0814</code> and contact phone number. The frontend routes the request to <code>BookingController</code>, which queries the database, 
          formats the active trip status, vehicle registration, and driver details, and returns the response in real time.
        </p>

        <!-- Figure 3.3.1 Sequence Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 300" class="vector-diag" style="height: 100mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- Lifeline Headers -->
            <rect x="40" y="20" width="110" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="95" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Customer / Traveler</text>

            <rect x="230" y="20" width="110" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="285" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Web Portal (SPA)</text>

            <rect x="420" y="20" width="100" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="470" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Express REST API</text>

            <rect x="550" y="20" width="80" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="590" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">SQLite DB</text>

            <!-- Vertical Lifelines -->
            <line x1="95" y1="46" x2="95" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="285" y1="46" x2="285" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="470" y1="46" x2="470" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="590" y1="46" x2="590" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>

            <!-- Message 1 -->
            <line x1="95" y1="75" x2="285" y2="75" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="280,72 285,75 280,78" fill="#0f172a"/>
            <text x="190" y="68" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">1. Enters Ref ID & Phone</text>

            <!-- Message 2 -->
            <line x1="285" y1="110" x2="470" y2="110" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="465,107 470,110 465,113" fill="#0f172a"/>
            <text x="375" y="103" font-family="'JetBrains Mono'" font-size="7.5" text-anchor="middle">GET /api/public/tracking?ref=...&phone=...</text>

            <!-- Message 3 -->
            <line x1="470" y1="145" x2="590" y2="145" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="585,142 590,145 585,148" fill="#0f172a"/>
            <text x="530" y="138" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">3. Query Booking & Duty</text>

            <!-- Message 4 -->
            <line x1="590" y1="180" x2="470" y2="180" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="4,3"/>
            <polygon points="475,177 470,180 475,183" fill="#0284c7"/>
            <text x="530" y="173" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">4. Return Record & Driver</text>

            <!-- Message 5 -->
            <line x1="470" y1="215" x2="285" y2="215" stroke="#16a34a" stroke-width="1.2" stroke-dasharray="4,3"/>
            <polygon points="290,212 285,215 290,218" fill="#16a34a"/>
            <text x="375" y="208" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">5. 200 OK (Trip Stage, Ertiga Details, Driver)</text>

            <!-- Message 6 -->
            <line x1="285" y1="250" x2="95" y2="250" stroke="#16a34a" stroke-width="1.2"/>
            <polygon points="100,247 95,250 100,253" fill="#16a34a"/>
            <text x="190" y="243" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">6. Render 4-Stage Live Progress Bar</text>
          </svg>
          <div class="figure-caption">Figure 3.3.1 – Sequence Diagram (Zero-Login Live Vehicle Tracking)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 19 of 44</span>
      </div>
    </div>
  `);

  // Page 20 of 44: 3.3 Sequence Diagram 2 (Figure 3.3.2)
  pages.push(`
    <div class="a4-page" id="page-20">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.3 Sequence Diagram (Trip Booking, Odometer Logging & Duty Slip Generation)</h3>
        <p>
          Figure 3.3.2 traces the transactional workflow between Driver, Fleet Operations Dispatcher, Express REST Controllers, FareEngine, 
          and the SQLite database. Odometer readings and en-route expenses are persisted atomically to prevent billing discrepancies.
        </p>

        <!-- Figure 3.3.2 Sequence Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 300" class="vector-diag" style="height: 100mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <rect x="40" y="20" width="100" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="90" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Lead Driver</text>

            <rect x="200" y="20" width="110" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="255" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Fleet Dispatcher</text>

            <rect x="380" y="20" width="110" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="435" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">Express Backend</text>

            <rect x="540" y="20" width="90" height="26" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <text x="585" y="37" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="700" text-anchor="middle">SQLite Database</text>

            <line x1="90" y1="46" x2="90" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="255" y1="46" x2="255" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="435" y1="46" x2="435" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>
            <line x1="585" y1="46" x2="585" y2="280" stroke="#94a3b8" stroke-dasharray="3,3"/>

            <line x1="90" y1="75" x2="255" y2="75" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="250,72 255,75 250,78" fill="#0f172a"/>
            <text x="172" y="68" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">1. Reports Start KM (e.g. 42,150)</text>

            <line x1="255" y1="110" x2="435" y2="110" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="430,107 435,110 430,113" fill="#0f172a"/>
            <text x="345" y="103" font-family="'JetBrains Mono'" font-size="7.5" text-anchor="middle">PUT /api/bookings/:id/start-trip</text>

            <line x1="435" y1="145" x2="585" y2="145" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="580,142 585,145 580,148" fill="#0f172a"/>
            <text x="510" y="138" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Update Status: IN_PROGRESS</text>

            <line x1="90" y1="180" x2="255" y2="180" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="250,177 255,180 250,183" fill="#0f172a"/>
            <text x="172" y="173" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Reports Closing KM (e.g. 42,860) & Tolls</text>

            <line x1="255" y1="215" x2="435" y2="215" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="430,212 435,215 430,218" fill="#0f172a"/>
            <text x="345" y="208" font-family="'JetBrains Mono'" font-size="7.5" text-anchor="middle">POST /api/duty-slips/generate (End KM, Tolls)</text>

            <line x1="435" y1="250" x2="585" y2="250" stroke="#16a34a" stroke-width="1.2"/>
            <polygon points="580,247 585,250 580,253" fill="#16a34a"/>
            <text x="510" y="243" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Compute Billable KM & Save Duty Slip</text>
          </svg>
          <div class="figure-caption">Figure 3.3.2 – Sequence Diagram (Job Card Creation & Inventory Allocation)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 20 of 44</span>
      </div>
    </div>
  `);

  // Page 21 of 44: 3.4 Entity-Relationship (ER) Diagram 1 (Figure 3.4.1)
  pages.push(`
    <div class="a4-page" id="page-21">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.4 Entity-Relationship (ER) Diagram (Enterprise Domain Entities)</h3>
        <p>
          The relational database schema is modeled in Third Normal Form (3NF). Figure 3.4.1 illustrates the enterprise domain entities 
          (<code>USERS</code>, <code>VEHICLES</code>, <code>BOOKINGS</code>, <code>DUTY_SLIPS</code>, <code>ROUTE_TARIFFS</code>), 
          enforcing referential integrity via foreign key constraints.
        </p>

        <!-- Figure 3.4.1 ER Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 310" class="vector-diag" style="height: 102mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- USERS -->
            <rect x="30" y="20" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="30" y="20" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="110" y="35" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle">USERS</text>
            <text x="38" y="54" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="38" y="66" font-family="'JetBrains Mono'" font-size="7.5">   | full_name : TEXT</text>
            <text x="38" y="78" font-family="'JetBrains Mono'" font-size="7.5">UK | email : TEXT</text>
            <text x="38" y="90" font-family="'JetBrains Mono'" font-size="7.5">   | password_hash : TEXT</text>
            <text x="38" y="102" font-family="'JetBrains Mono'" font-size="7.5">   | role : TEXT (ADMIN)</text>

            <!-- VEHICLES -->
            <rect x="460" y="20" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="460" y="20" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="540" y="35" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle">VEHICLES</text>
            <text x="468" y="54" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="468" y="66" font-family="'JetBrains Mono'" font-size="7.5">UK | plate_no : TEXT</text>
            <text x="468" y="78" font-family="'JetBrains Mono'" font-size="7.5">   | model : TEXT (Ertiga)</text>
            <text x="468" y="90" font-family="'JetBrains Mono'" font-size="7.5">   | capacity : INTEGER (6+1)</text>
            <text x="468" y="102" font-family="'JetBrains Mono'" font-size="7.5">   | is_active : BOOLEAN</text>

            <!-- BOOKINGS -->
            <rect x="230" y="70" width="190" height="135" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="70" width="190" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="85" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle">BOOKINGS</text>
            <text x="238" y="104" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="238" y="116" font-family="'JetBrains Mono'" font-size="7.5">UK | booking_ref : TEXT</text>
            <text x="238" y="128" font-family="'JetBrains Mono'" font-size="7.5">   | customer_name : TEXT</text>
            <text x="238" y="140" font-family="'JetBrains Mono'" font-size="7.5">   | customer_phone : TEXT</text>
            <text x="238" y="152" font-family="'JetBrains Mono'" font-size="7.5">FK | vehicle_id : INTEGER</text>
            <text x="238" y="164" font-family="'JetBrains Mono'" font-size="7.5">   | trip_type : TEXT</text>
            <text x="238" y="176" font-family="'JetBrains Mono'" font-size="7.5">   | estimated_fare : REAL</text>
            <text x="238" y="188" font-family="'JetBrains Mono'" font-size="7.5">   | status : TEXT</text>

            <!-- DUTY_SLIPS -->
            <rect x="230" y="220" width="190" height="85" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="220" width="190" height="20" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="234" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle">DUTY_SLIPS</text>
            <text x="238" y="252" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="238" y="264" font-family="'JetBrains Mono'" font-size="7.5">FK | booking_id : INTEGER</text>
            <text x="238" y="276" font-family="'JetBrains Mono'" font-size="7.5">   | start_km, end_km : INT</text>
            <text x="238" y="288" font-family="'JetBrains Mono'" font-size="7.5">   | total_amount : REAL</text>

            <!-- Relationships -->
            <line x1="190" y1="95" x2="230" y2="115" stroke="#0f172a" stroke-width="1.2"/>
            <text x="205" y="100" font-size="8">1..*</text>
            <line x1="460" y1="95" x2="420" y2="115" stroke="#0f172a" stroke-width="1.2"/>
            <text x="435" y="100" font-size="8">1..*</text>
            <line x1="325" y1="205" x2="325" y2="220" stroke="#0f172a" stroke-width="1.2"/>
            <text x="330" y="215" font-size="8">1..1</text>
          </svg>
          <div class="figure-caption">Figure 3.4.1 – (ER) Diagram (Enterprise Domain Entities)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 21 of 44</span>
      </div>
    </div>
  `);

  // Page 22 of 44: 3.4 Entity-Relationship (ER) Diagram 2 (Figure 3.4.2)
  pages.push(`
    <div class="a4-page" id="page-22">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.4 Entity-Relationship (ER) Diagram (Workshop Operations & Spares Ledger)</h3>
        <p>
          Figure 3.4.2 highlights the operational core linking Bookings, Duty Slips, and the central Expense & Tariff Store. 
          Each line item captures Fastag toll receipts, parking fees, and driver allowances to ensure historical billing accuracy even if future 
          tariff structures change.
        </p>

        <!-- Figure 3.4.2 ER Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 310" class="vector-diag" style="height: 102mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- BOOKINGS -->
            <rect x="40" y="25" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="40" y="25" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="120" y="40" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle">BOOKINGS</text>
            <text x="48" y="58" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="48" y="70" font-family="'JetBrains Mono'" font-size="7.5">UK | booking_ref : TEXT</text>
            <text x="48" y="82" font-family="'JetBrains Mono'" font-size="7.5">   | pickup_location : TEXT</text>
            <text x="48" y="94" font-family="'JetBrains Mono'" font-size="7.5">   | drop_location : TEXT</text>
            <text x="48" y="106" font-family="'JetBrains Mono'" font-size="7.5">   | trip_status : TEXT</text>

            <!-- ROUTE_TARIFFS -->
            <rect x="450" y="25" width="160" height="110" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="450" y="25" width="160" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="530" y="40" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle">ROUTE_TARIFFS</text>
            <text x="458" y="58" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="458" y="70" font-family="'JetBrains Mono'" font-size="7.5">   | trip_type : TEXT</text>
            <text x="458" y="82" font-family="'JetBrains Mono'" font-size="7.5">   | rate_per_km : REAL</text>
            <text x="458" y="94" font-family="'JetBrains Mono'" font-size="7.5">   | min_km_day : INTEGER</text>
            <text x="458" y="106" font-family="'JetBrains Mono'" font-size="7.5">   | driver_bata : REAL</text>

            <!-- DUTY_SLIPS (CENTER HUB) -->
            <rect x="230" y="100" width="190" height="120" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="100" width="190" height="22" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="115" font-family="'Plus Jakarta Sans'" font-size="9.5" font-weight="800" text-anchor="middle">DUTY_SLIPS</text>
            <text x="238" y="134" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="238" y="146" font-family="'JetBrains Mono'" font-size="7.5">FK | booking_id : INTEGER</text>
            <text x="238" y="158" font-family="'JetBrains Mono'" font-size="7.5">   | start_km, end_km : INT</text>
            <text x="238" y="170" font-family="'JetBrains Mono'" font-size="7.5">   | billable_km : INTEGER</text>
            <text x="238" y="182" font-family="'JetBrains Mono'" font-size="7.5">   | toll_charges : REAL</text>
            <text x="238" y="194" font-family="'JetBrains Mono'" font-size="7.5">   | grand_total : REAL</text>
            <text x="238" y="206" font-family="'JetBrains Mono'" font-size="7.5">   | payment_status : TEXT</text>

            <!-- TRIP_EXPENSES -->
            <rect x="230" y="235" width="190" height="65" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
            <rect x="230" y="235" width="190" height="18" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.2"/>
            <text x="325" y="248" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="800" text-anchor="middle">TRIP_EXPENSES</text>
            <text x="238" y="264" font-family="'JetBrains Mono'" font-size="7.5">PK | id : INTEGER</text>
            <text x="238" y="276" font-family="'JetBrains Mono'" font-size="7.5">FK | duty_slip_id : INTEGER</text>
            <text x="238" y="288" font-family="'JetBrains Mono'" font-size="7.5">   | category : TEXT, amount : REAL</text>

            <!-- Relational Connectors -->
            <line x1="200" y1="80" x2="230" y2="120" stroke="#0f172a" stroke-width="1.2"/>
            <text x="210" y="95" font-size="8">1..1</text>
            <line x1="450" y1="80" x2="420" y2="120" stroke="#0f172a" stroke-width="1.2"/>
            <text x="430" y="95" font-size="8">applied_to</text>
            <line x1="325" y1="220" x2="325" y2="235" stroke="#0f172a" stroke-width="1.2"/>
            <text x="330" y="230" font-size="8">1..*</text>
          </svg>
          <div class="figure-caption">Figure 3.4.2 – (ER) Diagram (Workshop Operations & Spares Ledger)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 22 of 44</span>
      </div>
    </div>
  `);

  // Page 23 of 44: 3.5 Deployment Diagram (Figure 3.5)
  pages.push(`
    <div class="a4-page" id="page-23">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.5 Deployment Diagram (Cloud Multi-Tier Topology)</h3>
        <p>
          Figure 3.5 illustrates the production multi-cloud deployment topology. Client browsers interact with the React Single Page Application 
          delivered via Vercel Edge CDN nodes. API calls are securely routed to the Express application container on Render, which connects to the 
          embedded SQLite database over encrypted HTTPS/TLS.
        </p>

        <!-- Figure 3.5 Deployment Diagram Vector SVG -->
        <div class="figure-container">
          <svg viewBox="0 0 650 300" class="vector-diag" style="height: 100mm;">
            <rect width="100%" height="100%" fill="#ffffff"/>
            
            <!-- Tier 1: Client Browser -->
            <rect x="180" y="15" width="290" height="60" rx="6" fill="#f8fafc" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="325" y="32" font-family="'Plus Jakarta Sans'" font-size="9" font-weight="800" text-anchor="middle" fill="#1e40af">Client Presentation Layer (Browser / Mobile)</text>
            <rect x="200" y="42" width="250" height="22" rx="3" fill="#ffffff" stroke="#cbd5e1"/>
            <text x="325" y="56" font-family="'Plus Jakarta Sans'" font-size="8" text-anchor="middle">User Web Browser (Chrome, Safari, Edge)</text>

            <!-- Connector Down -->
            <line x1="325" y1="75" x2="325" y2="105" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="322,100 325,105 328,100" fill="#0f172a"/>
            <text x="335" y="93" font-family="'Plus Jakarta Sans'" font-size="7.5" fill="#475569">HTTPS / TLS 1.3 (Port 443)</text>

            <!-- Tier 2: Application Server & CDN -->
            <rect x="60" y="105" width="230" height="85" rx="6" fill="#f8fafc" stroke="#0d9488" stroke-width="1.2"/>
            <text x="175" y="122" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="800" text-anchor="middle" fill="#0f766e">Edge CDN (Vercel Global)</text>
            <rect x="75" y="132" width="200" height="48" rx="3" fill="#ffffff" stroke="#cbd5e1"/>
            <text x="175" y="148" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">React 18 + Vite Production Bundle</text>
            <text x="175" y="162" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Tailwind CSS & Static Assets</text>

            <rect x="360" y="105" width="230" height="85" rx="6" fill="#f8fafc" stroke="#eab308" stroke-width="1.2"/>
            <text x="475" y="122" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="800" text-anchor="middle" fill="#a16207">Application Server (Node.js/Express)</text>
            <rect x="375" y="132" width="200" height="48" rx="3" fill="#ffffff" stroke="#cbd5e1"/>
            <text x="475" y="148" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">Express 4.19 REST API Server</text>
            <text x="475" y="162" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">JWT Security & CORS Middleware</text>

            <!-- Connector Down to DB -->
            <line x1="475" y1="190" x2="475" y2="215" stroke="#0f172a" stroke-width="1.2"/>
            <polygon points="472,210 475,215 478,210" fill="#0f172a"/>

            <!-- Tier 3: Database Engine -->
            <rect x="360" y="215" width="230" height="70" rx="6" fill="#f8fafc" stroke="#6366f1" stroke-width="1.2"/>
            <text x="475" y="232" font-family="'Plus Jakarta Sans'" font-size="8.5" font-weight="800" text-anchor="middle" fill="#4338ca">Database Storage Engine (SQLite 3)</text>
            <rect x="375" y="242" width="200" height="34" rx="3" fill="#ffffff" stroke="#cbd5e1"/>
            <text x="475" y="256" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">better-sqlite3 / sqlite3 WAL Mode</text>
            <text x="475" y="268" font-family="'Plus Jakarta Sans'" font-size="7.5" text-anchor="middle">ACID Transactions & Foreign Key Integrity</text>
          </svg>
          <div class="figure-caption">Figure 3.5 – Deployment Diagram (Cloud Multi-Tier Topology)</div>
        </div>
      </div>
      <div class="page-footer">
        <span>Page 23 of 44</span>
      </div>
    </div>
  `);

  // Page 24 of 44: 3.6 Security & Data Flow Architecture (Table 3.6.1)
  pages.push(`
    <div class="a4-page" id="page-24">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        <h3 class="section-title" style="margin-top: 2px;">3.6 Security & Data Flow Architecture</h3>
        <p>
          The <strong>Kadjai Travels</strong> system incorporates multi-layered defense-in-depth principles across transport, authentication, 
          authorization, and data storage layers to safeguard customer information, trip logs, and business financial metrics.
        </p>

        <h4 style="font-size: 9pt; font-weight: 700; margin: 4px 0 2px 0;">A. Stateless JWT Authentication & RBAC Flow:</h4>
        <p>
          Upon successful user credential verification against BCrypt password hashes, the authentication service generates a cryptographically 
          signed JSON Web Token (JWT) using the HMAC-SHA256 algorithm. The token encapsulates claims including user email, issued timestamp, 
          expiration time (24-hour TTL), and user roles (ROLE_ADMIN or ROLE_CUSTOMER). Each subsequent client HTTP request transmits this token 
          in the Authorization Bearer header. The Express <code>authenticateToken</code> middleware intercepts and validates the token signature 
          before delegating to the endpoint.
        </p>

        <h4 style="font-size: 9pt; font-weight: 700; margin: 4px 0 2px 0;">B. Database Connection Pooling & Transport Encryption:</h4>
        <p>
          All client-to-server and server-to-database communication channels are strictly encrypted using TLS 1.3 / HTTPS. The backend leverages 
          the SQLite database engine configured with Write-Ahead Logging (WAL) mode, maintaining optimal concurrency thresholds and avoiding 
          database lock timeouts to resist denial-of-service attempts.
        </p>

        <h4 style="font-size: 9.5pt; font-weight: 700; margin: 6px 0 3px 0; color: #0f172a;">Table 3.6.1: Enterprise Security Dimension Matrix</h4>
        <table class="academic-table" style="margin-bottom: 4px;">
          <thead>
            <tr>
              <th style="width: 25%;">Security Dimension</th>
              <th style="width: 40%;">Implementation Mechanism</th>
              <th style="width: 35%;">Security Objective</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Credential Protection</td>
              <td>BCrypt Hashing (Cost factor 10 with salt)</td>
              <td>Prevents credential extraction even in database dumps</td>
            </tr>
            <tr>
              <td>Session Management</td>
              <td>Stateless JWT Bearer Token (HMAC-SHA256)</td>
              <td>Eliminates server session state; resists CSRF attacks</td>
            </tr>
            <tr>
              <td>Network Transport</td>
              <td>Enforced HTTPS / TLS 1.3 Encryption</td>
              <td>Prevents eavesdropping and man-in-the-middle sniffing</td>
            </tr>
            <tr>
              <td>CORS Policy</td>
              <td>Restricted Allowed Origins (Vercel & Localhost)</td>
              <td>Blocks unauthorized cross-domain API invocation</td>
            </tr>
            <tr>
              <td>Input Sanitization</td>
              <td>Server-Side Validation (schema checks, regex)</td>
              <td>Prevents SQL injection, XSS, and buffer overflows</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <span>Page 24 of 44</span>
      </div>
    </div>
  `);

  return pages;
}

module.exports = { getChapter3Pages };
