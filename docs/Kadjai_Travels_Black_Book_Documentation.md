# A PROJECT REPORT ON
# KADJAI TRAVELS — TOURIST VEHICLE MANAGEMENT & CUSTOMER BOOKING SYSTEM (TVMS)

**Submitted by:**  
Mr. Yash Ramasre Bhagat  
(Roll No: T072)  

*In partial fulfilment for the award of the degree of*  
**BACHELOR OF SCIENCE IN COMPUTER SCIENCE**  
*(Semester V / Academic Year 2026–2027)*  

**Under the Guidance of:**  
Prof. Jyoti Chauhan  
*Department of Computer Science*  

**Institution:**  
SHETH L.U.J. COLLEGE OF ARTS & SIR M.V. COLLEGE OF SCIENCE & COMMERCE  
*Laxmi Sadan, Dr. Radhakrishnan Marg, Andheri (East), Mumbai – 400 069*  
*Affiliated to the University of Mumbai*  

---

## DECLARATION

I, **Yash Ramasre Bhagat**, hereby declare that the project entitled **“Kadjai Travels: Tourist Vehicle Management & Customer Booking System”** submitted in partial fulfilment for the award of Bachelor of Science in Computer Science during the academic year 2026–2027 is my original work and the project has not formed the basis for the award of any degree, associateship, fellowship or any other similar titles.

**Signature of the Student:** __________________________  
**Place:** Mumbai  
**Date:** _____ / _____ / 2026  

---

## ACADEMIC INTEGRITY & ORIGINALITY DECLARATION

This project documentation and software codebase represent original engineering work conducted by the student developer under departmental faculty guidance.
- All external dependencies, open-source modules, algorithms, and technical references have been appropriately acknowledged and cited.
- The business logic, system workflows, database schemas, and user interfaces were authored specifically for Kadjai Travels.
- Institutional similarity scanning is conducted by the College Library / Project Examination Committee in accordance with University of Mumbai guidelines (permissible similarity limit &le; 10%).
- Formal evaluation, verification, and degree endorsement are subject to the official viva-voce and departmental project review.

---

## PREFACE

Tourist vehicle charters and intercity cab services in Mumbai and Western Maharashtra have historically operated through informal phone negotiations, handwritten paper trip sheets, unrecorded odometer logs, and post-trip Fastag toll disputes. Passengers often face a lack of upfront transparency regarding distance calculation basis, driver overnight allowances (Bata), and return mileage policies. For a fleet proprietor, scheduling driver assignments, verifying opening and closing odometer readings, and generating clean tax invoices across scattered ledgers is inefficient and prone to revenue leakage.

The **Kadjai Travels** project bridges this operational gap through a modern, cloud-native digital vehicle management and customer booking web platform. The platform provides customers with an interactive, transparent portal to calculate exact fares (enforcing verified rates of ₹20/km outstation with 300 km/day calendar minimums, ₹15/km local city rentals, and mandatory Fastag toll calculation), schedule journeys, and perform **Zero-Login Trip Tracking** using only their Booking Reference ID.

Simultaneously, the platform equips fleet dispatchers with an executive **Tourist Vehicle Management System (TVMS)** to track active bookings, manage the dedicated Maruti Suzuki Ertiga (6+1 AC Luxury) fleet, record opening and closing odometer readings, and print official A4 duty slips with itemized cost breakdowns.

This report documents the system analysis, requirements, system design, database structure, architecture, implementation, testing, deployment, and conclusion of the Kadjai Travels platform.

---

## ACKNOWLEDGEMENT

I express my sincere gratitude to my project guide, **Prof. Jyoti Chauhan**, for her valuable guidance, continuous encouragement, and technical insights throughout the conceptualization, system modeling, and development of this project.

I am thankful to the Head of the Department of Computer Science and the respected faculty members of **Sheth L.U.J. College of Arts & Sir M.V. College of Science & Commerce** for providing the academic environment, laboratory facilities, and resources required to successfully complete this work.

I would like to extend my heartfelt thanks to **Kadjai Travels Mumbai** for providing the opportunity to study tourist car rental operations as a real-world enterprise project, sharing realistic workflow constraints, Fastag toll structures, and driver duty slip logistics that shaped the system.

I also acknowledge the open-source software community behind React 19, Vite, Tailwind CSS, Lucide React, and Node.js whose robust frameworks enabled the rapid development and verification of this modern web application.

Finally, I express my deepest appreciation to my parents and friends for their enduring support, patience, and motivation.

---

## ABSTRACT

Tourist vehicle charters and garage dispatch services in India are often constrained by manual paperwork, untracked vehicle mileage, lack of live ride visibility, and disputed post-trip tolls, making it challenging for customers to obtain upfront certainty regarding travel costs. This project presents **Kadjai Travels: Tourist Vehicle Management & Customer Booking System (TVMS)**, a cloud-native full-stack web platform engineered to provide an organized, transparent, and automated digital ecosystem for tourist cab operators and travelers.

The platform empowers passengers with an effortless 3-step booking wizard supporting outstation round trips (₹20/km with a 300 km/day minimum quota), point-to-point one-way drops, Mumbai local city rentals (8h/80km package at ₹2,200), and Chhatrapati Shivaji Maharaj International Airport (CSMIA T1 & T2) transfers. Highway Fastag tolls, municipal parking, driver allowances (Bata at ₹400/day), and night travel charges (₹300 between 10 PM and 6 AM) are automatically calculated upfront. A Zero-Login self-service tracking interface allows riders to monitor their assigned driver, vehicle number plate, and duty slip status in real time.

For fleet operators, an executive dispatch command center facilitates trip lifecycle transitions (Pending $\to$ Confirmed $\to$ In Progress $\to$ Completed), opening and closing odometer logging, driver roster tracking, and instant generation of official printable A4 duty slips.

Developed with a responsive React 19 frontend, Tailwind CSS, and a decimal-safe computational engine tested via Node.js test runner, the system guarantees 100% calculation integrity, zero surge manipulation, and high operational efficiency.

---

## INDEX

| Sr. No. | Chapter / Particulars | Page Range |
|---|---|---|
| **1** | **PRELIMINARY DESIGN** | **1–5** |
| 1.1 | Introduction & Objectives | 1 |
| 1.2 | Scope and Limitations of the Project | 2 |
| 1.3 | Hardware and Software Requirements Specification | 3 |
| 1.4 | Stakeholders & Comparative Study (Part 1) | 4 |
| 1.5 | Comparative Study (Part 2) & Technology Stack | 5 |
| **2** | **SYSTEM ANALYSIS** | **6–9** |
| 2.1 | Work Breakdown Structure (WBS) | 6 |
| 2.2 | Functional and Non-Functional SRS | 7–8 |
| 2.3 | Gantt Chart and Milestone Schedule | 9 |
| 2.4 | Domain Class Diagram | 9 |
| **3** | **SYSTEM DESIGN** | **10–23** |
| 3.1 | Use Case Diagram & Actor Specifications | 10–12 |
| 3.2 | System Flowcharts (4 Workflow Diagrams) | 13–16 |
| 3.3 | Sequence Diagrams (2 Interaction Diagrams) | 17–18 |
| 3.4 | Entity-Relationship (ER) Models (2 Full Schemas) | 19–20 |
| 3.5 | Cloud Deployment & Security Architecture | 21–23 |
| **4** | **SYSTEM DESCRIPTION** | **24–37** |
| 4.1 | Database Schema Data Dictionaries (Tables 4.1.1 – 4.1.6) | 24–26 |
| 4.2 | Core Module Architecture (10 Modules) | 27–28 |
| 4.3 | Runtime System Screenshots (Figures 4.1 – 4.5) | 29–31 |
| 4.4 | Source Code Implementation (10 Core Code Modules) | 32–37 |
| **5** | **TESTING** | **38–41** |
| 5.1 | Testing Methodology & Environment | 38 |
| 5.2 | Unit, Integration and Security Testing | 39 |
| 5.3 | Master Test Case Matrix (TC-01 to TC-15) | 40–41 |
| **6** | **CONCLUSION AND FUTURE SCOPE** | **42** |
| **7** | **UNDERTAKING** | **43** |
| **8** | **BIBLIOGRAPHY AND REFERENCES** | **44** |

---

# Chapter 1: PRELIMINARY DESIGN

### 1.1 Introduction
**KADJAI TRAVELS** is a modern, enterprise-grade tourist vehicle fleet operations and customer booking web platform engineered to modernize tourist cab operations across Mumbai, Maharashtra, and outstation destinations. Traditional neighborhood tourist vehicle operators manage bookings through handwritten paper trip sheets, verbal telephone cost quotes, untracked odometer logs, and manual toll receipts. This causes customer anxiety over hidden surge pricing, arbitrary driver allowances, and disputed return mileage, while fleet operators suffer from uncoordinated driver allocation and delayed invoicing.

The system provides a cloud-native 3-tier architecture with Zero-Login Live Vehicle & Trip Tracking (allowing passengers to check real-time driver allocation, vehicle plate numbers, and duty slip status using only their reference ID), an itemized transparent fare calculator, and an executive fleet management command center. The application is built using a responsive React 19 and Tailwind CSS frontend, a decimal-safe fare calculation engine, and a scalable database schema supporting full odometer tracking and instant printable A4 duty slip generation.

### 1.2 Objectives
- **Transparent Upfront Fare Computation:** Calculate outstation round trips at ₹20/km with standard 300 km/day calendar quotas, point-to-point one-way drops, Mumbai local rentals (8h/80km package at ₹2,200), and CSMIA airport transfers with mandatory Fastag tolls itemized upfront.
- **Zero-Login Live Trip Tracking:** Empower passengers to look up their assigned commercial driver, allocated car number plate, and trip status using their booking reference without mandatory account creation.
- **Strict Odometer Duty Slip Tracking:** Record starting odometer readings with customer verification at departure, and closing odometer readings upon arrival to compute accurate billable mileage.
- **Dedicated Fleet Focus:** Specialize in the Maruti Suzuki Ertiga (6+1 AC Luxury) with roof luggage rack, ensuring consistent passenger comfort, chilled dual AC, and predictable luggage accommodations.
- **Executive Dispatch Command Center:** Provide fleet managers with live operational KPIs covering active trips, confirmed schedules, driver duty sheets, and revenue receivables.
- **Automated Duty Slip & Bill Generation:** Instantly render print-ready A4 official duty slips and invoices complete with Kadjai Travels letterhead, odometer log, driver signature line, and customer acknowledgment.

### 1.3 Scope and Limitations
**A. Functional Scope (Included Modules):**
1. *Zero-Login Live Vehicle & Trip Tracker:* Enables passengers to track live trip progression, assigned driver credentials, and vehicle registration numbers using only their booking reference code (`KAD-YYYY-XXX`).
2. *4-Category Fare Estimation Engine:* Automatically derives billable mileage, base distance fare, driver daily allowances (Bata at ₹400/day), route-specific Fastag toll charges, municipal parking fees, and night driving allowances (₹300 between 10 PM and 6 AM).
3. *Digital Trip Lifecycle Management:* Manages five distinct operational milestones: `Pending` $\to$ `Confirmed` $\to$ `In Progress` $\to$ `Completed`.
4. *Printable A4 Duty Slip & Invoice Engine:* Generates official printable travel duty slips recording vehicle plate numbers, opening and closing odometers, itemized billing lines, and dual signature blocks.
5. *Fleet & Driver Roster Directory:* Tracks commercial badges, driving licenses, mobile contacts, vehicle fitness dates, and active road duty assignments.

**B. Project Limitations (Boundary Constraints):**
1. *Single Fleet Class Focus:* The operational release specializes in the Maruti Suzuki Ertiga (6+1 AC Luxury) and does not manage multi-axle luxury tourist coaches or heavy buses.
2. *Direct Payment Confirmation:* Payment settlement registers verified transaction modes (Cash, UPI QR, Bank Transfer) and computes balances due, but does not integrate third-party banking escrow gateways.
3. *Telematics Hardware Simulation:* Starting and closing odometer readings are verified and entered by counter dispatchers and drivers; direct OBD-II IoT hardware bus streaming is slated for future telematics integration.

### 1.4 Hardware & Software Requirements Specification

#### Table 1.4.1: Hardware Requirements Specification
| Component | Minimum Requirement | Recommended Specification |
|---|---|---|
| Processor (CPU) | Dual Core Intel Core i3 / AMD Ryzen 3 (2.0 GHz) | Quad Core Intel Core i5 / AMD Ryzen 5 (3.0 GHz+) |
| Memory (RAM) | 4 GB DDR4 RAM for counter client terminals | 8 GB – 16 GB DDR4/DDR5 for rapid bundling and development |
| Hard Disk / Storage | 256 GB SATA SSD (at least 20 GB free space) | 512 GB NVMe M.2 SSD for rapid asset caching and builds |
| Display Resolution | 1366 x 768 standard desktop / 768 x 1024 tablet | 1920 x 1080 Full HD IPS display for dispatch analytics |
| Network Connectivity | Broadband internet (minimum 10 Mbps) | Stable broadband (50 Mbps+ with Wi-Fi 6) |
| Client Peripherals | Standard keyboard, mouse | Laser printer for A4 Duty Slip & Invoice printing |

#### Table 1.4.2: Software Requirements Specification
| Layer / Environment | Technology / Software Specification | Version / Purpose |
|---|---|---|
| Operating System | Microsoft Windows 11 / 10 Pro or Ubuntu Linux 22.04 LTS | Host OS for local development and build execution |
| Frontend Engine | React 19 Single Page Application with JSX & Hooks | Version 19.2 for reactive UI state and performance |
| Build Tool & Bundler | Vite 8 Bundler and Node.js 24 LTS runtime | Version 8.3 for sub-second HMR and tree-shaking |
| Styling Framework | Tailwind CSS v4 with bespoke Obsidian & Taxi Gold Tokens | Version 4.3 for responsive utility layouts |
| Iconography & Effects | Lucide React Icons & Canvas Confetti | Modern vector UI icons and booking feedback |
| Unit Test Harness | Node.js Built-in Test Runner (`node --test`) | Verifies decimal-safe money arithmetic |

### 1.5 Stakeholders
- **Technical Engineering Team:** Develop, maintain, test, and deploy the React 19 frontend, fare calculation engine, and responsive UI components.
- **Fleet Drivers / Chauffeurs:** Execute journeys, record starting odometer readings with passengers, collect Fastag receipts, and verify closing odometer readings at drop-off.
- **Passengers / Customers:** Calculate transparent fares, submit trip booking inquiries, track assigned car plate and driver zero-login, and receive official duty slip invoices.
- **Fleet Proprietor / Dispatcher:** Oversee daily vehicle allocations, review gross revenue and receivables, dispatch drivers via WhatsApp, and print physical duty slips.
- **System Architect & Developer (Yash Bhagat):** Design domain models, implement decimal-safe fare calculation algorithms, configure Vite bundling, build responsive UI pages, and prepare technical documentation.

### 1.6 Comparative Study
| Feature | Traditional Taxi Operators | Corporate Cab Aggregators | KADJAI TRAVELS (Proposed) |
|---|---|---|---|
| Pricing Transparency | Arbitrary verbal quotes; post-trip toll disputes | Dynamic surge pricing; hidden multipliers | Fixed ₹20/km outstation, ₹15/km local; mandatory Fastag tolls itemized upfront |
| Trip Tracking | Constant phone calls to driver | Mandatory app download & account login | Zero-Login self-service tracking using simple Booking Reference ID |
| Odometer Logging | Handwritten paper slips prone to tampering | GPS distance only; vehicle meter ignored | Official digital start/end odometer logging with physical verification |
| Vehicle Fleet | Uncertain car model on departure day | Random gig vehicles of varying quality | Guaranteed Maruti Suzuki Ertiga (6+1 AC Luxury) with roof luggage rack |
| Duty Slip & Invoice | Incomplete carbon-copy paper slips | Automated generic receipts without meter logs | Official printable A4 duty slip with meter log, driver allowance, and signature lines |
| Driver Allocation | Unverified driver assigned via phone call | Third-party gig drivers | Verified commercial drivers with badges, route experience, and direct helpline |

---

# Chapter 2: SYSTEM ANALYSIS

### 2.1 Work Breakdown Structure (WBS)
1. **Requirements & Domain Analysis:** Field study in Mumbai tourist cab hubs (Dadar, Bandra, Airport T2); Fastag toll analysis; preparation of SRS.
2. **System Architecture & Database Design:** 3-tier layered architecture; ER modeling for 6 core entities; 3NF normalization.
3. **Decimal-Safe Fare Engine & Storage:** `calculateTripFare` engine; automated distance estimation matching Maharashtra routes (Lonavala, Pune, Shirdi, Nashik, Mahabaleshwar, Goa); driver Bata rules.
4. **Frontend SPA Development:** 3-step Booking Wizard, Zero-Login Trip Tracker, Fleet Command Center, Odometer Start/End Modal, and A4 Duty Slip Generator.
5. **Testing & QA Verification:** Execution of 12 master unit tests using Node.js test runner covering edge cases; responsive UI audit.
6. **Production Bundling & Documentation:** Vite minification; comprehensive UML diagrams, flowcharts, data dictionaries, and formal project documentation.

### 2.2 Functional and Non-Functional SRS
*Functional Requirements:*
- `FR-01`: Zero-Login Trip Tracking by Reference ID or Phone.
- `FR-02`: 3-Step Booking Wizard capturing journey parameters.
- `FR-03`: Automated Fare Computation deriving distance, Bata, and Fastag tolls.
- `FR-04`: Night Allowance Detection (₹300 between 10 PM and 6 AM).
- `FR-05`: Odometer Duty Logging for Opening and Closing KM.
- `FR-06`: Fleet & Driver Allocation assigning vehicle plates and licensed drivers.
- `FR-07`: Printable A4 Duty Slip rendering formal tax duty slips.
- `FR-08`: WhatsApp Dispatch Links generating 1-click duty sheets.

*Non-Functional Requirements:*
- `NFR-01`: Decimal-safe calculation accuracy with 0 NaN/Infinity occurrences.
- `NFR-02`: Sub-500ms build execution and under 1.2s page load.
- `NFR-03`: Responsive viewport support across 375px, 768px, and 1920px.
- `NFR-04`: Margin-perfect A4 printing for official duty slips.
- `NFR-05`: Strict customer privacy without public exposure of sensitive tax records.

---

# Chapter 3: SYSTEM DESIGN

### 3.1 Use Case Specifications
- **Actors:** Passenger / Guest Rider, Fleet Chauffeur / Driver, Fleet Operations Dispatcher.
- **Use Cases:** Calculate Transparent Fares, Submit 3-Step Booking Request, Zero-Login Trip Tracking, Record Start & End Odometer, Allocate Driver & Vehicle, Print Official A4 Duty Slip.

### 3.2 System Flowcharts
1. **Customer Booking & Fare Estimation Flowchart:** Validates trip categories, checks minimum distance quotas (300 km/day for outstation), adds Fastag tolls, and issues sequential booking reference ID.
2. **Driver & Vehicle Allocation Flowchart:** Checks Maruti Ertiga fleet status, assigns licensed driver and car plate number, and dispatches duty sheet via WhatsApp.
3. **Trip Execution & Odometer Tracking Flowchart:** Records Opening KM at customer doorstep, transitions status to `In Progress`, executes highway transit, and logs Closing KM upon arrival.
4. **Toll Reconciliation & Duty Slip Flowchart:** Calculates total billable distance, reconciles Fastag tolls, collects balance due, and generates printable A4 duty slip.

### 3.3 Sequence Diagrams
- **Sequence Diagram 1 (Zero-Login Trip Tracking):** Passenger submits `KAD-2026-101` $\to$ Web Client queries store $\to$ extracts driver and vehicle allocation $\to$ renders live status stepper.
- **Sequence Diagram 2 (Odometer Start/End Trip Execution):** Driver reports Start KM (42,320) $\to$ Dispatch locks opening meter $\to$ Journey completes at End KM (42,880) $\to$ Fare engine computes billable distance $\to$ A4 Duty Slip is rendered.

### 3.4 Entity-Relationship (ER) Schema
- `USERS` (1) $\longleftrightarrow$ (M) `BOOKINGS`
- `VEHICLES` (1) $\longleftrightarrow$ (M) `BOOKINGS`
- `DRIVERS` (1) $\longleftrightarrow$ (M) `BOOKINGS`
- `BOOKINGS` (1) $\longleftrightarrow$ (1) `DUTY_SLIPS`

---

# Chapter 4: SYSTEM DESCRIPTION

### 4.1 Database Description Tables
- `USERS`: id (PK), full_name, email, phone, role.
- `VEHICLES`: id (PK), plate_number, model (Maruti Ertiga), seats (7), current_km, status.
- `DRIVERS`: id (PK), name, phone, license_number, badge_number, trips_completed.
- `BOOKINGS`: id (PK, `KAD-YYYY-XXX`), customer_name, customer_phone, trip_type, pickup_location, drop_location, pickup_date, pickup_time, return_date, days_count, vehicle_id, driver_id, start_km, end_km, billable_km, rate_per_km, base_fare, driver_bata_total, toll_charges, parking_charges, night_charges, total_fare, advance_paid, balance_due, status.
- `DUTY_SLIPS`: id (PK), booking_id (FK), billable_km, total_amount, payment_mode.

### 4.2 Core Module Architecture
1. 3-Step Customer Booking Wizard
2. Decimal-Safe Fare Computation Engine
3. Zero-Login Live Vehicle & Trip Tracker
4. Fleet Dispatch Command Center
5. Odometer Duty Slip Tracker
6. Printable A4 Duty Slip & Tax Invoice Generator
7. Vehicle & Driver Roster Module
8. WhatsApp Communication Engine
9. Reactive Storage Synchronization
10. Destination Guide & Inspiration Module

---

# Chapter 5: TESTING

### 5.1 Testing Methodology & Environment
Automated unit tests were executed using Node.js built-in test runner (`node --test src/tests/fareCalculator.test.js`). All 12 unit tests passed cleanly in under 110ms.

### 5.2 Master Test Case Matrix
| ID | Feature | Input / Action | Expected Result | Actual Result | Result |
|---|---|---|---|---|:---:|
| TC-01 | One-Way Outstation | Mumbai to Pune, 155 km | 155 km @ ₹20 + ₹400 bata = ₹4,030 | Total ₹4,030 calculated | **PASS** |
| TC-02 | Round Trip Multi-Day | 2 Days, 500 km route | Enforces min quota 600 km (2x300) = ₹13,940 | Total ₹13,940 calculated | **PASS** |
| TC-03 | Local Rental 8h/80km | Local package, 80 km | Base ₹2,200, driver bata ₹0 | Total ₹2,350 with parking | **PASS** |
| TC-04 | Airport Transfer | CSMIA T2, 45 km | Base ₹1,800 + ₹180 parking + ₹100 toll | Total ₹2,080 calculated | **PASS** |
| TC-05 | Missing Inputs | Empty object `{}` | Fallback to safe defaults, no NaN | Valid number returned | **PASS** |
| TC-06 | Invalid Dates | `null` or invalid strings | Gracefully defaults to 1 day | 1 day returned | **PASS** |
| TC-07 | Return Before Pickup | Return date < Pickup date | Clamped to minimum 1 day duty | 1 day returned | **PASS** |
| TC-08 | Negative Distance | Distance: -50 km | Clamped to minimum quota | Billable KM clamped to 150 km | **PASS** |
| TC-09 | Night Allowance | Pickup time 23:30 | ₹300 night allowance added | ₹300 allowance applied | **PASS** |
| TC-10 | Full Advance Paid | Advance equals Total Fare | Balance due 0, status PAID | Balance 0, status PAID | **PASS** |
| TC-11 | Trip Switching | OneWay $\to$ RoundTrip | Recalculates distinct totals | Distinct totals produced | **PASS** |
| TC-12 | Integer Math | Fractional toll inputs | Rounded integer output | Safe integer output | **PASS** |

---

# Chapter 6: CONCLUSION AND FUTURE SCOPE

### 6.1 Conclusion
The **Kadjai Travels: Tourist Vehicle Management & Customer Booking System** delivers a modern, robust, and transparent digital solution for tourist car rental operations in Mumbai and Western Maharashtra. By eliminating handwritten paperwork, providing Zero-Login trip tracking, calculating upfront Fastag tolls, and automating printable A4 duty slips, the system delivers high operational trust and efficiency.

### 6.2 Future Scope
- **WhatsApp Business Cloud API:** Direct server-to-phone dispatch of PDF duty slips and driver location webhooks.
- **OBD-II IoT Telematics:** Direct hardware streaming of vehicle odometer and engine diagnostics into digital trip cards.
- **Multi-Branch Franchise Architecture:** Extending the data model to support multi-depot tourist fleet operators across India.

---

# Chapter 7: UNDERTAKING

I, **Yash Bhagat**, candidate for Bachelor of Science in Computer Science, hereby undertake that the project work presented in “Kadjai Travels: Tourist Vehicle Management System” is my original work, carried out under academic supervision.

**Date:** _____ / _____ / 2026  
**Place:** Mumbai  
**Signature of the Student:** __________________________  

---

# Chapter 8: BIBLIOGRAPHY AND REFERENCES

1. React Framework Documentation: https://react.dev
2. Vite Bundler & Build Tool: https://vitejs.dev
3. Tailwind CSS Utility Framework: https://tailwindcss.com
4. Node.js Built-in Test Runner: https://nodejs.org/api/test.html
5. PostgreSQL Relational Database Documentation: https://www.postgresql.org/docs/
6. Lucide Icons Documentation: https://lucide.dev
