import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Order } from './order.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private etherealTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if configuration is provided and it's not the placeholder
    if (host && user && pass && user !== 'your-email@gmail.com' && pass !== 'your-app-password') {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      console.log('✉️ EmailService: Nodemailer transporter initialized successfully.');
    } else {
      console.log('✉️ EmailService: SMTP credentials are not configured or still placeholders. Ethereal Email auto-fallback enabled.');
    }
  }

  async sendNewOrderNotification(order: Order): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin-receiver@gmail.com';
    const orderId = (order as any)._id ? (order as any)._id.toString().slice(-8).toUpperCase() : 'UNKNOWN';

    // Safe fallbacks for optional or potentially missing/non-numeric properties
    const lat = typeof order.latitude === 'number' ? order.latitude : 0;
    const lng = typeof order.longitude === 'number' ? order.longitude : 0;
    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : 0;
    const deliveryFee = typeof order.deliveryFee === 'number' ? order.deliveryFee : 0;
    const gstAmount = typeof order.gstAmount === 'number' ? order.gstAmount : 0;
    const handlingFee = typeof order.handlingFee === 'number' ? order.handlingFee : 0;
    const totalAmount = typeof order.totalAmount === 'number' ? order.totalAmount : 0;

    // Format items list for email body
    const itemsHtml = (order.items || [])
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${item.name || 'Unnamed Product'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">× ${item.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: right; font-weight: bold;">₹${(item.price || 0) * (item.quantity || 1)}</td>
      </tr>`,
      )
      .join('');

    const emailSubject = `🔔 New Order Placed: #${orderId}`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">🥦 New Order Alert!</h1>
          <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">FirstMart Order Notification</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">📋 Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Order ID:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; font-size: 14px; text-align: right;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Customer Mobile:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #a855f7; font-size: 14px; text-align: right;">📱 ${order.mobile || 'No contact'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Delivery Address:</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px; text-align: right;">🏠 ${order.address || 'No address details'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Geolocation:</td>
              <td style="padding: 6px 0; font-size: 14px; text-align: right;">
                <a href="https://www.google.com/maps?q=${lat},${lng}" style="color: #3b82f6; text-decoration: underline;">
                  📍 Open in Maps (${lat.toFixed(4)}, ${lng.toFixed(4)})
                </a>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">🛒 Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 10px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase;">Item</th>
                <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; text-transform: uppercase;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Subtotal:</td>
              <td style="padding: 4px 0; font-size: 13px; text-align: right; color: #475569;">₹${subtotal}</td>
            </tr>
            ${deliveryFee > 0 ? `<tr>
              <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Delivery Fee:</td>
              <td style="padding: 4px 0; font-size: 13px; text-align: right; color: #475569;">+ ₹${deliveryFee}</td>
            </tr>` : ''}
            ${gstAmount > 0 ? `<tr>
              <td style="padding: 4px 0; color: #64748b; font-size: 13px;">GST:</td>
              <td style="padding: 4px 0; font-size: 13px; text-align: right; color: #475569;">+ ₹${gstAmount}</td>
            </tr>` : ''}
            ${handlingFee > 0 ? `<tr>
              <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Handling Fee:</td>
              <td style="padding: 4px 0; font-size: 13px; text-align: right; color: #475569;">+ ₹${handlingFee}</td>
            </tr>` : ''}
            <tr style="border-top: 1px dashed #cbd5e1;">
              <td style="padding: 10px 0 0 0; font-weight: bold; color: #0f172a; font-size: 16px;">Total Amount:</td>
              <td style="padding: 10px 0 0 0; font-weight: 800; color: #a855f7; font-size: 20px; text-align: right;">₹${totalAmount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
          This is an automated order notification. Please configure your store admin credentials inside the backend .env variables.
        </div>
      </div>`;

    let currentTransporter = this.transporter;
    let usingEthereal = false;

    if (!currentTransporter) {
      if (!this.etherealTransporter) {
        try {
          console.log('✉️ EmailService: Creating dynamic Ethereal test account for email preview...');
          const testAccount = await nodemailer.createTestAccount();
          this.etherealTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          console.log('✉️ EmailService: Ethereal test transporter initialized successfully.');
        } catch (etherealErr) {
          console.warn('⚠️ EmailService: Failed to initialize Ethereal test account:', etherealErr.message);
        }
      }
      currentTransporter = this.etherealTransporter;
      usingEthereal = true;
    }

    if (currentTransporter) {
      try {
        const fromEmail = usingEthereal ? 'FirstMart Store <noreply@firstmart.com>' : `"FirstMart Store" <${process.env.SMTP_USER}>`;
        const info = await currentTransporter.sendMail({
          from: fromEmail,
          to: adminEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (usingEthereal) {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log(`
===================================================
✉️ EmailService: Order notification sent to Ethereal Email!
🔗 Email Preview Link: ${previewUrl}
===================================================
`);
        } else {
          console.log(`✉️ EmailService: Notification email successfully sent for order #${orderId}.`);
        }
        return true;
      } catch (err) {
        console.error(`❌ EmailService: Failed to send email for order #${orderId}:`, err.message);
        this.logFallback(order, orderId);
        return false;
      }
    } else {
      this.logFallback(order, orderId);
      return true;
    }
  }

  private logFallback(order: Order, orderId: string) {
    console.log(`
===================================================
💡 FALLBACK LOG: NEW ORDER DETAILS FOR #${orderId}
===================================================
📱 Mobile: ${order.mobile}
🏠 Address: ${order.address || 'N/A'}
📍 Location: https://www.google.com/maps?q=${order.latitude},${order.longitude}
🛒 Items: ${JSON.stringify(order.items.map((i) => `${i.name} x${i.quantity}`))}
💰 Total: ₹${order.totalAmount}
===================================================
`);
  }
}
