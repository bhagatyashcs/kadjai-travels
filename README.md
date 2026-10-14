# Kadjai Travels — Premium Tourist Car & Operations Management System

> Dedicated Outstation & Airport Tourist Cab Services from Mumbai  
> **Brand Base:** Mumbai, Maharashtra • **Contact:** kadjaitravels@gmail.com • **Helpline:** +91 86898 04096 • **WhatsApp:** 918689804096

---

## 🌟 Overview & Architecture

**Kadjai Travels** is an end-to-end tourist vehicle operations and customer booking web application built with **React 19**, **Vite**, and **Tailwind CSS**. It provides a customer-facing travel portal with transparent fare calculations and an operational Tourist Vehicle Management System (TVMS) for dispatchers.

The application features:
1. **Public Travel Agency Website**: Modern, high-converting travel website with transparent route estimates, exclusive vehicle showcase (Maruti Suzuki Ertiga 6+1 AC Luxury), 3-step interactive booking engine, WhatsApp inquiry triggers, and self-service trip tracking.
2. **Operations & Dispatch Desk (TVMS)**: Operations dashboard for dispatchers to manage bookings across lifecycles, assign vehicles & drivers, record opening/closing odometer readings, calculate transparent fares with minimum daily KM rules, and print official A4 duty slips.

---

## 🚗 Core Modules & Features

### 1. Customer Booking & Rebuilt Fare Calculator
- **Trip Categories**:
  - **Round Trip Outstation**: ₹20 / KM with standard 300 KM / day minimum quota.
  - **One-Way Outstation**: Direct point-to-point drop calculating only one-way distance without charging return mileage.
  - **Local City Rental**: Mumbai in-city packages (8h / 80km at ₹2,200; 12h / 120km at ₹3,200; extra km at ₹15/km).
  - **Airport Transfer**: Doorstep transfers connecting to Mumbai CSMIA Airport (Terminals 1 & 2).
- **Mandatory Surcharges Calculated Upfront**:
  - Highway Fastag toll charges based on route.
  - Destination municipal parking and airport parking slip charges.
  - Outstation driver daily allowance (Bata) of ₹400 / day.
  - Night driving allowance of ₹300 for journeys between 10:00 PM and 06:00 AM.
- **Self-Service Trip Tracking**: Look up trip status by reference code (`KAD-YYYY-XXX`) to review assigned driver, vehicle number, and duty slip invoice.

### 2. Fleet Focus: Maruti Suzuki Ertiga (6+1 AC Luxury)
- 6 passengers + 1 driver capacity.
- Chilled dual air-conditioning (roof-mounted ceiling vents for all rows).
- Heavy-duty overhead roof luggage carrier with waterproof cover.
- Reclining middle and rear seats for highway comfort.

### 3. Bookings & Operations Lifecycle Manager
- **Status Lifecycle Workflow**:
  - `Pending` (New web enquiry awaiting driver/vehicle allocation)
  - `Confirmed` (Vehicle & driver allocated, schedule set)
  - `In Progress` (Live on road with recorded opening odometer reading)
  - `Completed` (Trip finished, closing odometer recorded, bill settled)
- **Odometer Duty Slip Tracking**:
  - Start KM recorded at passenger pickup.
  - End KM recorded at journey completion.
  - Computes billable KM: $\max(\text{Total Actual KM}, \text{Days} \times \text{Min. Daily KM})$.
- **Printable A4 Duty Slip**: Clean printable trip duty slip with Kadjai Travels letterhead, odometer log, driver signature line, and customer acknowledgment.
- **Export**: Instant CSV trip sheet download for spreadsheets and accounting.

---

## 🛠️ Tech Stack & Scripts

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Deep Midnight Navy & Gold Palette
- **Icons**: Lucide React
- **Unit Testing**: Node.js built-in test runner (`node --test`)
- **Storage**: Browser `localStorage` with reactive cross-component synchronization

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start local development server
npm run dev

# 4. Production build
npm run build
```
