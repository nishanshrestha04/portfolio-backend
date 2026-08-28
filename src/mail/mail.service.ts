import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendContactEmails(contactDetails: { name: string; email: string; message: string }) {
    if (!process.env.RESEND_API_KEY) {
      this.logger.warn('Resend API Key not configured. Skipping emails.');
      return;
    }

    const from = process.env.RESEND_FROM || process.env.SMTP_FROM || 'onboarding@resend.dev';
    
    // 1. Email to the user
    const userHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050a0e; color: #ffffff; border-radius: 16px; border: 1px solid #1a232c; overflow: hidden;">
        <tr>
          <td style="padding: 48px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom: 40px;">
                  <div style="display: inline-block; width: 56px; height: 56px; line-height: 60px; text-align: center; border-radius: 50%; border: 1px solid rgba(0, 230, 150, 0.3); background-color: rgba(0, 230, 150, 0.05); box-shadow: 0 0 20px rgba(0,230,150,0.15);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E696" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h1 style="margin: 24px 0 0 0; font-size: 26px; font-weight: 600; color: #f0f6fc; letter-spacing: -0.5px;"><span style="color: #00E696;">Thank you</span> for reaching out!</h1>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #1a232c; margin-bottom: 40px;">
              <tr>
                <td width="48" valign="top" style="padding-bottom: 40px; padding-right: 20px;">
                  <div style="width: 48px; height: 48px; line-height: 48px; text-align: center; border-radius: 50%; border: 1px solid #1a232c; font-weight: 600; font-size: 16px; color: #ffffff; background-color: #0d1218;">
                    ${contactDetails.name.substring(0, 2).toUpperCase()}
                  </div>
                </td>
                <td valign="top" style="padding-bottom: 40px;">
                  <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #f0f6fc;">Hi ${contactDetails.name},</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #8b949e;">I've received your message and appreciate you taking the time to write to me. I will review your inquiry and get back to you as soon as possible.</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="48" valign="top" style="padding-right: 20px;">
                  <div style="width: 48px; height: 48px; line-height: 52px; text-align: center; border-radius: 12px; border: 1px solid #1a232c; background-color: #0d1218;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00E696" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </div>
                </td>
                <td valign="top">
                  <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #00E696;">Best regards,</p>
                  <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #f0f6fc;">Nishan Shrestha</p>
                  <p style="margin: 0; font-size: 13px; color: #8b949e;">AI & Full-Stack Developer</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const userMailOptions = {
      from: `"Nishan Shrestha" <${from}>`,
      to: contactDetails.email,
      subject: 'Message Received - Nishan Shrestha',
      text: `Hi ${contactDetails.name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nNishan Shrestha`,
      html: userHtml,
    };

    // 2. Email to the site owner
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; margin-top: 0;">New Submission</h2>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${contactDetails.name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contactDetails.email}">${contactDetails.email}</a></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; white-space: pre-wrap; color: #444;">${contactDetails.message}</p>
        </div>
      </div>
    `;

    const ownerMailOptions = {
      from: `"Portfolio Alerts" <${from}>`,
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission from ${contactDetails.name}`,
      text: `You have received a new message from your portfolio website.\n\nName: ${contactDetails.name}\nEmail: ${contactDetails.email}\nMessage: ${contactDetails.message}`,
      html: ownerHtml,
    };

    try {
      const { error: userError } = await this.resend.emails.send({
        from: `Nishan Shrestha <${from}>`,
        to: contactDetails.email,
        subject: 'Message Received - Nishan Shrestha',
        html: userHtml,
      });

      if (userError) {
        this.logger.error(`Failed to send auto-reply: ${userError.message}`);
      } else {
        this.logger.log(`Auto-reply sent to ${contactDetails.email}`);
      }
      
      const { error: ownerError } = await this.resend.emails.send({
        from: `Portfolio Alerts <${from}>`,
        to: process.env.RESEND_TO_EMAIL || process.env.SMTP_USER || 'nishanshrestha212@gmail.com',
        subject: `New Contact Form Submission from ${contactDetails.name}`,
        html: ownerHtml,
      });

      if (ownerError) {
        this.logger.error(`Failed to send notification email: ${ownerError.message}`);
      } else {
        this.logger.log(`Notification email sent to owner from ${contactDetails.email}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send emails: ${error.message}`);
    }
  }
}
