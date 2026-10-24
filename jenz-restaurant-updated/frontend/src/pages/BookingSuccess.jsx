import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2, Mail, Phone, Calendar, Clock, Users, UtensilsCrossed, Home, BookOpen, ArrowRight, MapPin, AlertTriangle } from "lucide-react";

const RESTAURANT_NAME = "Yāzhi — Modern Tamil Heritage Dining";
const RESTAURANT_ADDRESS = "34 Nehru Street, Kalpalayam, Vinayagapuram, Chennai - 600099, Tamil Nadu, India";
const RESTAURANT_PHONE = "+91 98765 43210";

const BookingSuccess = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const emailSent = state?.emailSent;

  // Fallback if navigated directly without booking state
  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  const bookingRef = booking._id
    ? `#BK-${booking._id.toString().slice(-6).toUpperCase()}`
    : "#BK-CONFIRMED";

  const dateStr = booking.date
    ? new Date(booking.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-cream via-ivory to-cream">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/15 text-gold mb-3 shadow-gold">
            <CheckCircle2 size={36} />
          </div>
          <p className="eyebrow mb-1">Reservation Confirmed</p>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">
            Table Reserved Successfully!
          </h1>
          <div className="divider-gold mx-auto mt-3" />
          <p className="text-sm text-charcoal/70 mt-3 max-w-md mx-auto">
            Thank you, <strong className="text-charcoal">{booking.name}</strong>. We have received your booking request and our team is preparing your table.
          </p>
        </div>

        {/* Booking Card */}
        <div className="card-premium p-7 md:p-8 space-y-6">
          {/* Reference Banner */}
          <div className="flex items-center justify-between bg-charcoal text-cream rounded-xl px-5 py-3.5">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                Booking Reference
              </p>
              <p className="font-mono text-lg font-bold text-cream tracking-wide">{bookingRef}</p>
            </div>
            <span className="bg-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/40">
              {booking.status || "Pending"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <Mail size={14} className="text-gold" />
                <span>Email</span>
              </div>
              <p className="font-semibold text-charcoal text-sm truncate">{booking.email}</p>
            </div>

            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <Phone size={14} className="text-gold" />
                <span>Phone</span>
              </div>
              <p className="font-semibold text-charcoal text-sm">{booking.phone}</p>
            </div>

            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <Calendar size={14} className="text-gold" />
                <span>Date</span>
              </div>
              <p className="font-semibold text-charcoal text-sm">{dateStr}</p>
            </div>

            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <Clock size={14} className="text-gold" />
                <span>Time Slot</span>
              </div>
              <p className="font-semibold text-charcoal text-sm">
                {booking.startTime} – {booking.endTime}
              </p>
            </div>

            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <Users size={14} className="text-gold" />
                <span>Party Size</span>
              </div>
              <p className="font-semibold text-charcoal text-sm">
                {booking.numberOfPeople} Guests
              </p>
            </div>

            <div className="bg-cream/40 rounded-xl p-3.5 border border-charcoal/5">
              <div className="flex items-center gap-2 text-charcoal/60 text-xs font-semibold mb-1">
                <UtensilsCrossed size={14} className="text-gold" />
                <span>Table Assigned</span>
              </div>
              <p className="font-semibold text-charcoal text-sm">
                Table {booking.tableNumber}
              </p>
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="bg-charcoal text-cream rounded-xl p-4 text-xs space-y-1.5">
            <p className="text-gold font-semibold uppercase tracking-widest text-[11px] mb-1">Restaurant Details</p>
            <p className="font-semibold text-sm">{RESTAURANT_NAME}</p>
            <p className="flex items-center gap-1.5 text-cream/70"><MapPin size={12} className="text-gold shrink-0" /> {RESTAURANT_ADDRESS}</p>
            <p className="flex items-center gap-1.5 text-cream/70"><Phone size={12} className="text-gold shrink-0" /> {RESTAURANT_PHONE}</p>
          </div>

          {booking.note && (
            <div className="text-xs bg-white rounded-xl p-3 border border-charcoal/10 text-charcoal/80">
              <span className="font-semibold text-charcoal">Special Note: </span>
              {booking.note}
            </div>
          )}

          {/* Email Confirmation Notice - reflects the REAL delivery result from the backend */}
          {emailSent === false ? (
            <div className="flex items-start gap-3 bg-red-50/70 border border-red-200/80 rounded-xl p-4 text-xs text-red-900">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Confirmation Email Could Not Be Sent</p>
                <p className="text-red-800/90 leading-relaxed">
                  Your table is still reserved, but we couldn't confirm delivery of the summary email to{" "}
                  <strong className="font-medium text-charcoal">{booking.email}</strong>. You can review this reservation anytime under My Bookings.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900">
              <Mail size={18} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Confirmation Email Sent</p>
                <p className="text-amber-800/90 leading-relaxed">
                  A summary of your reservation has been sent to{" "}
                  <strong className="font-medium text-charcoal">{booking.email}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/"
                className="btn-gold py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-gold"
              >
                <Home size={14} /> Return Home
              </Link>
              <Link
                to="/menu"
                className="btn-dark py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <BookOpen size={14} /> Explore Menu
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-1.5 text-xs text-burgundy hover:text-charcoal font-semibold transition underline"
              >
                View in My Bookings <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
