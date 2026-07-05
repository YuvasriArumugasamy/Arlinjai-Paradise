module.exports = {
  HOTEL: {
    name: 'Arlinjai Paradise',
    tagline: 'Comfort, Cleanliness, and Care – Your Home in Kanyakumari',
    address: 'No. 5/69, Beach Road, Kanyakumari – 629702, Tamil Nadu, India',
    phone: '9486271234',
    email: 'info@arlinjaiparadise.com',
    checkInTime: '12:00',
    checkOutTime: '11:00',
  },

  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked-in',
    CHECKED_OUT: 'checked-out',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no-show',
  },

  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    RECEPTIONIST: 'receptionist',
    GUEST: 'guest',
  },

  ROOM_CATEGORIES: {
    DELUXE: 'deluxe',
    STANDARD: 'standard',
    BUDGET: 'budget',
  },

  PAYMENT_METHODS: {
    PAY_AT_HOTEL: 'pay_at_hotel',
    UPI: 'upi',
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    PARTIAL: 'partial',
    REFUNDED: 'refunded',
  },

  EMAIL_SUBJECTS: {
    BOOKING_CONFIRMATION: 'Booking Confirmation – Arlinjai Paradise',
    BOOKING_CANCELLATION: 'Booking Cancellation – Arlinjai Paradise',
    CONTACT_ACK: 'We received your message – Arlinjai Paradise',
    PASSWORD_RESET: 'Password Reset – Arlinjai Paradise Admin',
  },

  HIGH_SEASON_MONTHS: [11, 0], // December (11) and January (0)
  HIGH_SEASON_LABEL: 'Dec–Jan',
}
