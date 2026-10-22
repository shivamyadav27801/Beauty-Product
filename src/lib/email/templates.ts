export function getEmailBaseTemplate(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #fcf8f9;
      color: #333333;
    }
    .wrapper {
      width: 100%;
      background-color: #fcf8f9;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #f3d7dc;
    }
    .header {
      background-color: #3a1f2c;
      padding: 30px 20px;
      text-align: center;
    }
    .brand-title {
      font-family: 'Georgia', serif;
      color: #ffffff;
      letter-spacing: 4px;
      font-size: 22px;
      margin: 0;
      font-weight: 400;
    }
    .brand-sub {
      color: #f2b5c0;
      font-size: 11px;
      letter-spacing: 3px;
      margin-top: 5px;
    }
    .content {
      padding: 35px 30px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background-color: #b55b6c;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-size: 14px;
      letter-spacing: 1px;
      font-weight: 600;
      margin-top: 20px;
    }
    .footer {
      background-color: #fbf1f3;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      border-top: 1px solid #f8d7dc;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-title">VELVETIQUE</h1>
        <div class="brand-sub">BEAUTY</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Velvetique Beauty. All Rights Reserved.</p>
        <p>Clean beauty that nourishes, enhances and empowers you.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmail(name: string, siteUrl: string): { subject: string; html: string } {
  const content = `
    <h2 style="color: #3a1f2c; font-family: 'Georgia', serif; margin-top: 0;">Welcome to Velvetique, ${name}</h2>
    <p>Thank you for joining our community of conscious beauty enthusiasts. We are dedicated to providing luxurious, clean skincare that nurtures your natural radiance.</p>
    <p>Your account is now ready. Explore our best-selling collections, curated gift sets, and nourishing daily rituals.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${siteUrl}/shop" class="btn">DISCOVER THE COLLECTION</a>
    </div>
    <p style="font-size: 13px; color: #666;">Use code <strong>GLOW15</strong> at checkout for 15% off your first order over ₹999.</p>
  `;
  return {
    subject: "Welcome to Velvetique Beauty — Radiant Skin, Real Confidence",
    html: getEmailBaseTemplate("Welcome to Velvetique Beauty", content),
  };
}

export function getContactInquiryAdminEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: Date;
}): { subject: string; html: string } {
  const content = `
    <h2 style="color: #3a1f2c; font-family: 'Georgia', serif; margin-top: 0;">New Contact Inquiry Received</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #555;">Name:</td>
        <td style="padding: 8px 0;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
        <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
        <td style="padding: 8px 0;">${data.phone || "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
        <td style="padding: 8px 0;">${data.subject}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #555;">Received:</td>
        <td style="padding: 8px 0;">${data.date.toLocaleString()}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 15px; background: #faf7f5; border-left: 3px solid #b55b6c; border-radius: 4px;">
      <p style="margin: 0; font-style: italic; white-space: pre-wrap;">${data.message}</p>
    </div>
  `;
  return {
    subject: `New Contact Inquiry: ${data.subject} — Velvetique Beauty`,
    html: getEmailBaseTemplate("New Contact Inquiry", content),
  };
}

export function getContactInquiryCustomerConfirmation(name: string): { subject: string; html: string } {
  const content = `
    <h2 style="color: #3a1f2c; font-family: 'Georgia', serif; margin-top: 0;">Thank you for reaching out, ${name}</h2>
    <p>We have received your message. Our beauty advisory team carefully reviews each inquiry and will get back to you within 24 business hours.</p>
    <p>In the meantime, feel free to browse our <a href="/shop" style="color: #b55b6c; font-weight: 600;">latest collections</a> or check our <a href="/policies/faqs" style="color: #b55b6c; font-weight: 600;">FAQs</a>.</p>
  `;
  return {
    subject: "We received your message — Velvetique Beauty",
    html: getEmailBaseTemplate("Thank You for Contacting Velvetique", content),
  };
}

export function getOrderConfirmationEmail(order: {
  orderNumber: string;
  customer: { fullName: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  shippingAddress: { street: string; city: string; state: string; pincode: string };
}): { subject: string; html: string } {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <h2 style="color: #3a1f2c; font-family: 'Georgia', serif; margin-top: 0;">Order Confirmed: #${order.orderNumber}</h2>
    <p>Hello ${order.customer.fullName},</p>
    <p>Thank you for choosing Velvetique Beauty. Your order has been placed successfully and is being prepared with utmost care.</p>
    
    <div style="margin: 25px 0;">
      <h3 style="font-size: 16px; color: #3a1f2c; border-bottom: 2px solid #b55b6c; padding-bottom: 8px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemRows}
        <tr>
          <td style="padding: 12px 0; font-weight: bold; font-size: 16px;">Total Amount:</td>
          <td style="padding: 12px 0; font-weight: bold; font-size: 16px; text-align: right; color: #b55b6c;">₹${order.total}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #fbf8f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 5px 0; font-weight: bold;">Shipping To:</p>
      <p style="margin: 0; color: #555;">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
      <p style="margin: 5px 0 0 0; color: #555; font-size: 12px;">Payment Method: <strong>${order.paymentMethod}</strong></p>
    </div>
  `;

  return {
    subject: `Order Confirmation #${order.orderNumber} — Velvetique Beauty`,
    html: getEmailBaseTemplate(`Order #${order.orderNumber}`, content),
  };
}

export function getNewOrderAdminNotificationEmail(order: {
  orderNumber: string;
  customer: { fullName: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  shippingAddress: { street: string; city: string; state: string; pincode: string };
  createdAt: Date;
}): { subject: string; html: string } {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <h2 style="color: #3a1f2c; font-family: 'Georgia', serif; margin-top: 0;">🚨 New Order Received: #${order.orderNumber}</h2>
    <p>A new customer order has been placed on Velvetique Beauty.</p>

    <div style="background-color: #faf5f6; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 3px solid #b55b6c;">
      <p style="margin: 0 0 5px 0;"><strong>Customer:</strong> ${order.customer.fullName}</p>
      <p style="margin: 0 0 5px 0;"><strong>Email:</strong> <a href="mailto:${order.customer.email}">${order.customer.email}</a></p>
      <p style="margin: 0 0 5px 0;"><strong>Phone:</strong> ${order.customer.phone}</p>
      <p style="margin: 0 0 5px 0;"><strong>Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
      <p style="margin: 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="font-size: 15px; color: #3a1f2c; border-bottom: 2px solid #b55b6c; padding-bottom: 6px;">Purchased Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="text-align: left; font-size: 11px; text-transform: uppercase; color: #777;">
            <th style="padding-bottom: 6px;">Item</th>
            <th style="padding-bottom: 6px; text-align: center;">Qty</th>
            <th style="padding-bottom: 6px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="2" style="padding: 12px 0; font-weight: bold; font-size: 15px;">Total Order Value:</td>
            <td style="padding: 12px 0; font-weight: bold; font-size: 16px; text-align: right; color: #b55b6c;">₹${order.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  return {
    subject: `🚨 New Order #${order.orderNumber} (₹${order.total}) — Velvetique Beauty`,
    html: getEmailBaseTemplate(`New Order #${order.orderNumber}`, content),
  };
}

