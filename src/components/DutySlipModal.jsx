import React from 'react';
import { 
  X, 
  Printer, 
  MessageSquare, 
  Share2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';
import { getDutySlipInvoiceMessage, openWhatsApp } from '../utils/whatsapp';

export default function DutySlipModal({
  isOpen,
  onClose,
  booking,
  vehicle,
  driver,
}) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = getDutySlipInvoiceMessage(booking);
    openWhatsApp(booking.customerPhone, text);
  };

  const handleCopyText = () => {
    const text = getDutySlipInvoiceMessage(booking);
    navigator.clipboard.writeText(text);
    alert('Invoice details copied to clipboard!');
  };

  const billableDistance = booking.billableKm || booking.totalKm || booking.estKm || 0;
  const totalKmRun = booking.totalKm !== null && booking.totalKm !== undefined 
    ? booking.totalKm 
    : (booking.endKm && booking.startKm ? booking.endKm - booking.startKm : (booking.estKm || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 print:shadow-none print:border-none print:m-0 print:w-full">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-amber-400">Official Duty Slip & Tax Invoice</span>
            <span className="text-xs text-slate-400 font-mono">({booking.id})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
              title="Print A4 Duty Slip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
              title="Send to Customer WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
              title="Copy text"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DUTY SLIP & INVOICE CONTENT */}
        <div className="p-8 print:p-6 text-xs text-slate-800 font-sans" id="printable-duty-slip">
          
          {/* Company Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950">
                  KADJAI<span className="text-amber-500">TRAVELS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                  Tourist Taxi Service
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Premium Outstation & Airport Tourist Cab Services
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                📍 {COMPANY_INFO.baseLocation || 'Mumbai, Maharashtra'} • 📞 {COMPANY_INFO.displayPhone} • ✉️ {COMPANY_INFO.email}
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-black uppercase tracking-wider text-slate-900">
                DUTY SLIP & BILL
              </div>
              <div className="font-mono text-xs font-bold text-amber-600 mt-1">
                REF: {booking.id}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  booking.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Payment: {booking.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Trip Meta Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Customer Details
              </div>
              <div className="font-bold text-sm text-slate-900">{booking.customerName}</div>
              <div className="text-slate-600 mt-0.5">📞 {booking.customerPhone}</div>
              {booking.customerEmail && <div className="text-slate-500">{booking.customerEmail}</div>}
              <div className="text-slate-600 mt-1 font-medium">
                Passengers: <span className="font-bold">{booking.passengers || 4}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Vehicle & Driver Assigned
              </div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Vehicle:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-amber-700">
                  {booking.vehiclePlateNumber || vehicle?.plateNumber || 'T-Permit Cab'}
                </span>
              </div>
              <div className="text-slate-700 mt-1">
                Model: <span className="font-semibold">{booking.vehicleModelId?.toUpperCase() || 'Ertiga AC'}</span>
              </div>
              <div className="text-slate-700 mt-1">
                Driver: <span className="font-semibold">{booking.driverName || driver?.name || 'Assigned Driver'}</span>
                {booking.driverPhone && <span className="text-slate-500 ml-1">({booking.driverPhone})</span>}
              </div>
            </div>
          </div>

          {/* Journey Route & Dates */}
          <div className="mb-5 bg-white border border-slate-200 rounded-xl p-3.5">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Route Name</span>
                <span className="font-bold text-slate-900 text-sm">{booking.route}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip Category</span>
                <span className="font-semibold text-slate-700">{booking.tripType}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-[11px]">
              <div>
                <span className="text-slate-500 font-medium">📍 Pickup Address: </span>
                <span className="text-slate-800">{booking.pickupLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">🏁 Drop / Destination: </span>
                <span className="text-slate-800">{booking.dropLocation}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 mt-2 text-[11px]">
              <div>
                <span className="text-slate-500">Pickup Date: </span>
                <span className="font-bold">{booking.pickupDate} ({booking.pickupTime})</span>
              </div>
              <div>
                <span className="text-slate-500">Return Date: </span>
                <span className="font-bold">{booking.returnDate || 'Same Day'}</span>
              </div>
              <div>
                <span className="text-slate-500">Duration: </span>
                <span className="font-bold">{booking.daysCount || 1} Day(s)</span>
              </div>
            </div>
          </div>

          {/* KILOMETRES / ODOMETER LOG TABLE */}
          <div className="mb-5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Kilometres & Odometer Reading Log
            </div>

            <table className="w-full border-collapse border border-slate-300 text-center">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold">
                  <th className="border border-slate-300 py-1.5 px-2">Opening Odometer (Start KM)</th>
                  <th className="border border-slate-300 py-1.5 px-2">Closing Odometer (End KM)</th>
                  <th className="border border-slate-300 py-1.5 px-2">Total Distance Run</th>
                  <th className="border border-slate-300 py-1.5 px-2">Min. Daily KM</th>
                  <th className="border border-slate-300 py-1.5 px-2 bg-amber-50 text-amber-900">Billable KM</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr>
                  <td className="border border-slate-300 py-2 px-2 font-bold">
                    {booking.startKm !== null ? `${booking.startKm} KM` : 'Recorded at start'}
                  </td>
                  <td className="border border-slate-300 py-2 px-2 font-bold">
                    {booking.endKm !== null ? `${booking.endKm} KM` : 'Recorded at return'}
                  </td>
                  <td className="border border-slate-300 py-2 px-2 font-bold text-emerald-700">
                    {totalKmRun} KM
                  </td>
                  <td className="border border-slate-300 py-2 px-2 text-slate-600">
                    {booking.minKmPerDay || 300} KM / Day
                  </td>
                  <td className="border border-slate-300 py-2 px-2 font-black bg-amber-50 text-amber-900 text-sm">
                    {billableDistance} KM
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ITEMISED BILL BREAKDOWN */}
          <div className="mb-5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Fare Calculation & Invoicing
            </div>

            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left font-bold">
                  <th className="border border-slate-300 py-1.5 px-3">Description</th>
                  <th className="border border-slate-300 py-1.5 px-3 text-right">Calculation Details</th>
                  <th className="border border-slate-300 py-1.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="border border-slate-300 py-1.5 px-3 font-medium">
                    Base Distance / Package Rate
                  </td>
                  <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                    {billableDistance} KM @ ₹{booking.ratePerKm || 25}/KM
                  </td>
                  <td className="border border-slate-300 py-1.5 px-3 text-right font-mono font-bold">
                    ₹{(booking.baseFare || 0).toLocaleString('en-IN')}
                  </td>
                </tr>

                {Number(booking.extraKmCharge) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium">
                      Extra Kilometres
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                      Above package limit
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono">
                      ₹{Number(booking.extraKmCharge).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {Number(booking.driverBataTotal) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium">
                      Driver Charge
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                      {booking.daysCount || 1} Day(s) @ ₹{booking.driverBataPerDay || 400}/Day
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono">
                      ₹{Number(booking.driverBataTotal).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {Number(booking.tollCharges) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium">
                      Toll Highway Charges
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                      Actual FASTag receipts
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono">
                      ₹{Number(booking.tollCharges).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {Number(booking.parkingCharges) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium">
                      Parking & State Permit Taxes
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                      Actual receipts
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono">
                      ₹{Number(booking.parkingCharges).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {Number(booking.nightCharges) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium">
                      Night Driving Allowance
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-slate-600">
                      10:00 PM – 06:00 AM
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono">
                      ₹{Number(booking.nightCharges).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {Number(booking.discount) > 0 && (
                  <tr>
                    <td className="border border-slate-300 py-1.5 px-3 font-medium text-emerald-700">
                      Discount / Promotional Waiver
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-emerald-700">
                      Special waiver
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 text-right font-mono text-emerald-700">
                      -₹{Number(booking.discount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {/* Subtotals & Net */}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan="2" className="border border-slate-300 py-2 px-3 text-right uppercase text-xs">
                    Total Trip Amount:
                  </td>
                  <td className="border border-slate-300 py-2 px-3 text-right font-mono text-sm text-slate-900">
                    ₹{(booking.totalFare || 0).toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="text-emerald-800">
                  <td colSpan="2" className="border border-slate-300 py-1.5 px-3 text-right font-medium text-xs">
                    Less: Advance / Paid Amount:
                  </td>
                  <td className="border border-slate-300 py-1.5 px-3 text-right font-mono font-bold">
                    -₹{(booking.advancePaid || 0).toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-amber-100/60 font-black text-amber-950 text-sm">
                  <td colSpan="2" className="border border-slate-300 py-2.5 px-3 text-right uppercase">
                    Net Balance Payable:
                  </td>
                  <td className="border border-slate-300 py-2.5 px-3 text-right font-mono text-base text-amber-900">
                    ₹{(booking.balanceDue || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SIGNATURES SECTION */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-6">
            <div className="text-center">
              <div className="h-12 border-b border-dashed border-slate-400 mb-1" />
              <div className="font-bold text-slate-800">Driver Signature</div>
              <div className="text-[10px] text-slate-500">({booking.driverName || 'Driver'})</div>
            </div>

            <div className="text-center">
              <div className="h-12 border-b border-dashed border-slate-400 mb-1" />
              <div className="font-bold text-slate-800">Customer Signature</div>
              <div className="text-[10px] text-slate-500">I certify the KM readings & satisfaction</div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-[9px] text-slate-500 text-center space-y-0.5">
            <p>Thank you for choosing Kadjai Travels! We wish you a safe and memorable journey.</p>
            <p>For feedback or 24x7 fleet support, contact {COMPANY_INFO.phone} or {COMPANY_INFO.email}.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
