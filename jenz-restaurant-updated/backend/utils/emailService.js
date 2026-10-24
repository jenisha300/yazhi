import nodemailer from "nodemailer";

const RESTAURANT_NAME = "Yāzhi — Modern Tamil Heritage Dining";
const RESTAURANT_ADDRESS = "34 Nehru Street, Kalpalayam, Vinayagapuram, Chennai - 600099, Tamil Nadu, India";
const RESTAURANT_PHONE = "+91 98765 43210";

// Configure Nodemailer transporter based on environment variables
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE;

  if (service) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  // Fallback to standard SMTP with EMAIL_USER/EMAIL_PASS if provided
  if (user && pass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      // DEV ONLY: works around "self-signed certificate in certificate chain"
      // caused by local antivirus/corporate proxies intercepting TLS.
      // Remove this before deploying to production.
      tls: process.env.NODE_ENV === "production" ? undefined : { rejectUnauthorized: false },
    });
  }

  return null;
};

const getFromAddress = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || '"Yāzhi Restaurant" <reservations@yazhirestaurant.com>';
};

/**
 * Send a password-reset email containing a single-use, time-limited link.
 * The raw token lives only in this email - the DB only ever stores its hash.
 */
export const sendPasswordResetEmail = async ({ user, resetLink }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.warn(`[EmailService] SMTP credentials not configured. Password reset email skipped for ${user.email}.`);
      return { success: false, warning: "SMTP not configured" };
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f1e7; margin: 0; padding: 0; color: #1b1a17; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(27,26,23,0.08); }
    .header { background: #1b1a17; padding: 32px 20px; text-align: center; border-bottom: 2px solid #c9a24b; }
    .brand-title { color: #c9a24b; font-size: 26px; font-weight: 700; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
    .brand-sub { color: #f6f1e7; font-size: 11px; letter-spacing: 3px; margin-top: 6px; text-transform: uppercase; opacity: 0.8; }
    .content { padding: 40px 32px; }
    .salutation { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1b1a17; }
    .message { font-size: 14px; line-height: 1.6; color: #4a4843; margin-bottom: 28px; }
    .btn-wrapper { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; background: #c9a24b; color: #1b1a17 !important; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; padding: 14px 36px; border-radius: 999px; text-decoration: none; }
    .meta-notice { font-size: 12px; color: #7a766e; text-align: center; margin-top: 16px; }
    .link-fallback { font-size: 12px; color: #4a4843; word-break: break-all; background: #fdfbf7; border: 1px solid #ede8de; border-radius: 8px; padding: 12px; margin-top: 16px; }
    .footer { background: #fdfbf7; border-top: 1px solid #ede8de; padding: 24px 32px; text-align: center; font-size: 12px; color: #8c887f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">Yāzhi — யாழி</h1>
      <div class="brand-sub">Culinary Excellence & Fine Dining</div>
    </div>
    <div class="content">
      <div class="salutation">Reset Your Password</div>
      <p class="message">
        Hello ${user.name || "Valued Guest"},<br><br>
        We received a request to reset the password for your Yāzhi account. Click the button below to choose a new password.
      </p>
      <div class="btn-wrapper">
        <a href="${resetLink}" class="btn">Reset My Password</a>
        <div class="meta-notice">This link expires in <strong>30 minutes</strong> and can only be used once.</div>
      </div>
      <div class="link-fallback">
        If the button doesn't work, copy and paste this link into your browser:<br>${resetLink}
      </div>
      <p class="message" style="font-size: 13px; color: #6b675f; border-left: 3px solid #c9a24b; padding-left: 12px; margin-top: 24px;">
        If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Yāzhi — Modern Tamil Heritage Dining</p>
      <p style="margin: 0;">For your security, never share this link with anyone.</p>
    </div>
  </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: user.email,
      subject: "Reset Your Password - Yāzhi",
      text: `Hello ${user.name || "Guest"},\n\nWe received a request to reset your Yāzhi account password. Open this link to choose a new one (valid for 30 minutes, single use):\n${resetLink}\n\nIf you didn't request this, you can ignore this email.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Password reset email delivery error for ${user.email}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Booking Confirmation Email.
 * Always sent to the AUTHENTICATED user's registered account email
 * (user.email) rather than whatever contact email was typed into the
 * booking form, per the "registered email" requirement. Falls back to the
 * booking's own email field only if, for some reason, no user is attached.
 */
export const sendBookingConfirmationEmail = async ({ booking, user }) => {
  try {
    const transporter = createTransporter();
    const recipientEmail = user?.email || booking.email;
    if (!recipientEmail) return { success: false, error: "No recipient email" };

    if (!transporter) {
      console.warn(`[EmailService] SMTP credentials not configured. Booking confirmation email skipped for ${recipientEmail}.`);
      return { success: false, warning: "SMTP not configured" };
    }

    const bookingRef = booking._id ? `#BK-${booking._id.toString().slice(-6).toUpperCase()}` : "CONFIRMED";
    const bookingDateStr = booking.date ? new Date(booking.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : "";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f1e7; margin: 0; padding: 0; color: #1b1a17; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(27,26,23,0.08); }
    .header { background: #1b1a17; padding: 32px 20px; text-align: center; border-bottom: 2px solid #c9a24b; }
    .brand-title { color: #c9a24b; font-size: 26px; font-weight: 700; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
    .brand-sub { color: #f6f1e7; font-size: 11px; letter-spacing: 3px; margin-top: 6px; text-transform: uppercase; opacity: 0.8; }
    .content { padding: 40px 32px; }
    .salutation { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1b1a17; }
    .intro { font-size: 14px; line-height: 1.6; color: #4a4843; margin-bottom: 24px; }
    .card { background: #fdfbf7; border: 1px solid #ede8de; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2ded5; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #7a766e; font-weight: 500; }
    .val { color: #1b1a17; font-weight: 600; text-align: right; }
    .status-badge { display: inline-block; background: #6b1f2a; color: #f6f1e7; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
    .footer { background: #fdfbf7; border-top: 1px solid #ede8de; padding: 24px 32px; text-align: center; font-size: 12px; color: #8c887f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">Yāzhi — யாழி</h1>
      <div class="brand-sub">Table Reservation Confirmation</div>
    </div>
    <div class="content">
      <div class="salutation">Reservation Received</div>
      <p class="intro">
        Dear ${booking.name || "Guest"},<br>
        Thank you for reserving a table at Yāzhi. Your booking request has been successfully submitted and logged in our reservation system.
      </p>

      <div class="card">
        <div class="row">
          <span class="label">Booking Reference</span>
          <span class="val" style="color: #c9a24b; font-family: monospace; font-size: 15px;">${bookingRef}</span>
        </div>
        <div class="row">
          <span class="label">Guest Name</span>
          <span class="val">${booking.name}</span>
        </div>
        <div class="row">
          <span class="label">Registered Email</span>
          <span class="val">${recipientEmail}</span>
        </div>
        <div class="row">
          <span class="label">Phone Number</span>
          <span class="val">${booking.phone || "-"}</span>
        </div>
        <div class="row">
          <span class="label">Date</span>
          <span class="val">${bookingDateStr}</span>
        </div>
        <div class="row">
          <span class="label">Time</span>
          <span class="val">${booking.startTime} – ${booking.endTime}</span>
        </div>
        <div class="row">
          <span class="label">Party Size</span>
          <span class="val">${booking.numberOfPeople} Guests</span>
        </div>
        <div class="row">
          <span class="label">Table</span>
          <span class="val">Table ${booking.tableNumber}</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="val"><span class="status-badge">${booking.status || "Pending"}</span></span>
        </div>
        ${booking.note ? `
        <div class="row">
          <span class="label">Special Request</span>
          <span class="val">${booking.note}</span>
        </div>` : ""}
      </div>

      <div class="card" style="background:#1b1a17; border: none;">
        <p style="margin:0 0 8px 0; color:#c9a24b; font-weight:700; font-size:13px; letter-spacing:1px; text-transform:uppercase;">Restaurant Details</p>
        <p style="margin:0 0 4px 0; color:#f6f1e7; font-size:14px; font-weight:600;">${RESTAURANT_NAME}</p>
        <p style="margin:0 0 4px 0; color:#cfc9bd; font-size:13px;">${RESTAURANT_ADDRESS}</p>
        <p style="margin:0; color:#cfc9bd; font-size:13px;">${RESTAURANT_PHONE}</p>
      </div>

      <p class="intro" style="font-size: 13px; color: #6b675f;">
        Our team reviews reservations promptly. You can track your reservation status anytime on our website under <strong>My Bookings</strong>. If your schedule changes, please cancel or contact us at least 2 hours in advance.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #1b1a17;">${RESTAURANT_NAME}</p>
      <p style="margin: 0 0 4px 0;">Fine Food · Exceptional Hospitality</p>
      <p style="margin: 0;">For inquiries or changes, please reply directly or visit our contact page.</p>
    </div>
  </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: recipientEmail,
      subject: `Table Reservation Confirmation - Yāzhi (${bookingRef})`,
      text: `Table Reservation Confirmation - Yāzhi\n\nDear ${booking.name},\nYour booking reference is ${bookingRef}.\nRegistered Email: ${recipientEmail}\nPhone: ${booking.phone || "-"}\nDate: ${bookingDateStr}\nTime: ${booking.startTime} - ${booking.endTime}\nGuests: ${booking.numberOfPeople}\nTable: Table ${booking.tableNumber}\nStatus: ${booking.status}\n\nRestaurant: ${RESTAURANT_NAME}\nAddress: ${RESTAURANT_ADDRESS}\nPhone: ${RESTAURANT_PHONE}\n\nThank you for choosing Yāzhi.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Booking confirmation email error:`, error.message);
    return { success: false, error: error.message };
  }
};