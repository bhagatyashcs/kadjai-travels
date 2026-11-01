// WhatsApp Communication Engine for Kadjai Travels
// Auto-formats professional messages for customers and drivers

import { COMPANY_INFO } from '../data/travelData';

/**
 * Clean phone number to standard international format without spaces/dashes
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return COMPANY_INFO.whatsappNumber;
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    digits = '91' + digits; // prepend India country code if 10 digits
  }
  return digits;
};

/**
 * Open WhatsApp directly in new browser tab
 */
export const openWhatsApp = (phone, text) => {
  const clean = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${clean}?text=${encoded}`;
  window.open(url, '_blank');
};

/**
 * Booking Confirmation for Customer with Full Itemized Toll, Parking & Driver Breakdown
 */
export const getCustomerConfirmationMessage = (booking) => {
  const driverChargeText = booking.driverBataTotal 
    ? `• 👨‍✈️ Driver Charge: ₹${Number(booking.driverBataTotal).toLocaleString('en-IN')} (${booking.daysCount || 1} day duty)\n`
    : '';
  const tollText = Number(booking.tollCharges) > 0 
    ? `• 🛣️ Highway Toll Charges: ₹${Number(booking.tollCharges).toLocaleString('en-IN')}\n`
    : '';
  const parkingText = Number(booking.parkingCharges) > 0 
    ? `• 🅿️ Parking / Entry Taxes: ₹${Number(booking.parkingCharges).toLocaleString('en-IN')}\n`
    : '';
  const nightText = Number(booking.nightCharges) > 0 
    ? `• 🌙 Night Driving Charges: ₹${Number(booking.nightCharges).toLocaleString('en-IN')}\n`
    : '';

  return `🚕 *KADJAI TRAVELS - TRIP QUOTATION & CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,
Your trip enquiry has been registered with Kadjai Travels!

📋 *Booking Ref:* ${booking.id}
📍 *Pickup Location:* ${booking.pickupLocation}
🏁 *Drop Destination:* ${booking.dropLocation}
🚗 *Trip Category:* ${booking.tripType}
📅 *Pickup Date & Time:* ${booking.pickupDate} at ${booking.pickupTime || '07:00 AM'}
${booking.returnDate ? `🔄 *Return Date:* ${booking.returnDate} (${booking.daysCount || 1} Days)\n` : ''}
🚗 *Vehicle:* ${booking.vehicleModelId ? booking.vehicleModelId.toUpperCase() : 'Tourist AC Cab'} (${booking.vehiclePlateNumber || 'Allocated prior to departure'})
👨‍✈️ *Driver:* ${booking.driverName || 'Verified Driver Allocated'} ${booking.driverPhone ? `(${booking.driverPhone})` : ''}

💵 *TRANSPARENT FARE BREAKDOWN:*
• 🚗 Vehicle Distance Fare (${booking.billableKm || booking.estKm || 300} KM): ₹${Number(booking.baseFare || 0).toLocaleString('en-IN')}
${driverChargeText}${tollText}${parkingText}${nightText}━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT:* ₹${Number(booking.totalFare || 0).toLocaleString('en-IN')}
💵 *Advance Paid:* ₹${Number(booking.advancePaid || 0).toLocaleString('en-IN')}
💳 *Balance Due:* ₹${Number(booking.balanceDue || 0).toLocaleString('en-IN')}

✨ *Our Commitment:* Clean sanitized Ertiga, chilled dual AC, verified highway driver, no hidden surge.

📞 Need help? Call: ${COMPANY_INFO.displayPhone}
Thank you for choosing *Kadjai Travels*!`;
};

/**
 * Customer Inquiry message for WhatsApp button on landing page / calculator
 */
export const getCustomerInquiryMessage = ({
  pickupLocation,
  dropLocation,
  tripType,
  pickupDate,
  pickupTime,
  returnDate,
  daysCount,
  vehicleName,
  passengers,
  name,
  phone,
  breakdown,
}) => {
  const driverChargeLine = breakdown && breakdown.driverBataTotal 
    ? `• Driver Charge (${daysCount} days): ₹${Number(breakdown.driverBataTotal).toLocaleString('en-IN')}\n` 
    : '';
  const tollLine = breakdown && Number(breakdown.tollCharges) > 0 
    ? `• Highway Toll Charges: ₹${Number(breakdown.tollCharges).toLocaleString('en-IN')}\n` 
    : '';
  const parkingLine = breakdown && Number(breakdown.parkingCharges) > 0 
    ? `• Parking / Airport Taxes: ₹${Number(breakdown.parkingCharges).toLocaleString('en-IN')}\n` 
    : '';
  const nightLine = breakdown && Number(breakdown.nightCharges) > 0 
    ? `• Night Driving Charges: ₹${Number(breakdown.nightCharges).toLocaleString('en-IN')}\n` 
    : '';

  return `Hi Kadjai Travels,

I want to book a tourist car from your website:
📍 *Pickup Location:* ${pickupLocation}
🏁 *Destination:* ${dropLocation}
🛣️ *Trip Type:* ${tripType}
📅 *Pickup Date:* ${pickupDate} at ${pickupTime}
${returnDate ? `🔄 *Return Date:* ${returnDate} (${daysCount} Days)\n` : ''}🚗 *Vehicle Requested:* ${vehicleName || 'Maruti Suzuki Ertiga (6+1 AC)'}
👥 *Passengers:* ${passengers}
👤 *Customer Name:* ${name || 'Customer'}
📞 *Phone:* ${phone || ''}

💵 *ESTIMATED FARE BREAKDOWN:*
• Car Fare (${breakdown?.billableKm || 0} KM @ ₹${breakdown?.ratePerKm || 25}/km): ₹${Number(breakdown?.baseFare || 0).toLocaleString('en-IN')}
${driverChargeLine}${tollLine}${parkingLine}${nightLine}━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL ESTIMATED FARE:* ₹${Number(breakdown?.totalFare || 0).toLocaleString('en-IN')}

Please confirm car and driver availability for this journey.`;
};

/**
 * Trip Dispatch Assignment for Driver
 */
export const getDriverDispatchMessage = (booking) => {
  return `🚗 *KADJAI TRAVELS - TRIP DUTY SLIP*
━━━━━━━━━━━━━━━━━━━━
Namaste *${booking.driverName}*,
You have been assigned a new trip duty:

📋 *Booking ID:* ${booking.id}
👤 *Customer:* ${booking.customerName}
📞 *Customer Phone:* ${booking.customerPhone}
👥 *Passengers:* ${booking.passengers || '4-6'}

📅 *Date & Time:* ${booking.pickupDate} at ${booking.pickupTime}
📍 *Pickup Location:* ${booking.pickupLocation}
🏁 *Drop Location:* ${booking.dropLocation}
${booking.returnDate ? `🔄 *Return Date:* ${booking.returnDate}\n` : ''}
🚗 *Vehicle Plate:* ${booking.vehiclePlateNumber}
📝 *Notes:* ${booking.notes || 'Please ensure clean cab, neat uniform and on-time pickup.'}

⚠️ *Driver Instructions:*
1. Note Starting Odometer reading with customer before moving.
2. Keep Toll and Parking receipts safely for billing.
3. Have a safe journey!`;
};

/**
 * Duty Slip & Final Invoice Summary
 */
export const getDutySlipInvoiceMessage = (booking) => {
  return `🧾 *KADJAI TRAVELS - DUTY SLIP & INVOICE*
━━━━━━━━━━━━━━━━━━━━
Booking Ref: *${booking.id}*
Customer: *${booking.customerName}* (${booking.customerPhone})
Date: ${booking.pickupDate} ${booking.returnDate ? `to ${booking.returnDate}` : ''}
Route: ${booking.pickupLocation} ➔ ${booking.dropLocation}
Vehicle: ${booking.vehiclePlateNumber || 'Tourist Cab'}

📏 *KILOMETRE LOG:*
• Opening Odometer: ${booking.startKm || 'N/A'} KM
• Closing Odometer: ${booking.endKm || 'N/A'} KM
• Total Distance: ${booking.totalKm || booking.estKm || 0} KM
• Billable Distance: ${booking.billableKm || booking.totalKm || 0} KM

💵 *ITEMIZED FARE BREAKDOWN:*
• Base Vehicle Fare: ₹${Number(booking.baseFare || 0).toLocaleString('en-IN')}
${booking.driverBataTotal ? `• Driver Charge: ₹${Number(booking.driverBataTotal).toLocaleString('en-IN')} (${booking.daysCount || 1} days)\n` : ''}
${booking.tollCharges ? `• Highway Toll Charges: ₹${Number(booking.tollCharges).toLocaleString('en-IN')}\n` : ''}
${booking.parkingCharges ? `• Parking / Airport Taxes: ₹${Number(booking.parkingCharges).toLocaleString('en-IN')}\n` : ''}
${booking.nightCharges ? `• Night Driving Allowance: ₹${Number(booking.nightCharges).toLocaleString('en-IN')}\n` : ''}
${booking.discount ? `• Discount: -₹${Number(booking.discount).toLocaleString('en-IN')}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
*TOTAL AMOUNT:* ₹${Number(booking.totalFare || 0).toLocaleString('en-IN')}
Advance Paid: ₹${Number(booking.advancePaid || 0).toLocaleString('en-IN')}
*BALANCE DUE:* ₹${Number(booking.balanceDue || 0).toLocaleString('en-IN')}
Payment Status: *${booking.paymentStatus || 'Pending'}*

Thank you for travelling with *Kadjai Travels*!
📞 Support: ${COMPANY_INFO.displayPhone}`;
};
