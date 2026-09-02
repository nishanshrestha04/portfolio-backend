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
                    <img src="https://img.icons8.com/ios-filled/50/00e696/checkmark--v1.png" width="24" height="24" style="display: block; margin: 16px auto 0;" alt="✓" />
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
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
              <tr>
                <td width="48" valign="top" style="padding-right: 20px;">
                  <div style="width: 48px; height: 48px; line-height: 52px; text-align: center; border-radius: 12px; border: 1px solid #1a232c; background-color: #0d1218;">
                    <img src="https://img.icons8.com/ios-filled/50/00e696/paper-plane.png" width="22" height="22" style="display: block; margin: 13px auto 0;" alt="send" />
                  </div>
                </td>
                <td valign="top">
                  <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #00E696;">Best regards,</p>
                  <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #f0f6fc;">Nishan Shrestha</p>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                font-family: 'Inter', Arial, Helvetica, sans-serif;
                color: #f0f6fc;
                line-height: 1.4;
              "
            >
              <tr>
                <td valign="middle" style="padding-right: 16px">
                  <a
                    href="https://nishanshrestha04.com.np"
                    target="_blank"
                    style="text-decoration: none"
                  >
                    <img
                      src="https://www.nishanshrestha04.com.np/favicon.svg"
                      width="72"
                      height="72"
                      alt="NS"
                      style="
                        display: block;
                        width: 72px;
                        height: 72px;
                        border-radius: 50%;
                        border: 1px solid #1a232c;
                      "
                    />
                  </a>
                </td>
                <td
                  valign="middle"
                  style="border-left: 2px solid #0070f3; padding-left: 16px"
                >
                  <div
                    style="
                      font-size: 18px;
                      font-weight: 700;
                      color: #f0f6fc;
                      margin-bottom: 2px;
                    "
                  >
                    Nishan Shrestha
                  </div>
                  <div
                    style="
                      font-family: 'JetBrains Mono', monospace;
                      font-size: 13px;
                      font-weight: 600;
                      color: #0070f3;
                      margin-bottom: 8px;
                    "
                  >
                    AI &amp; Full-Stack Developer
                  </div>
                  <div
                    style="
                      font-family: 'JetBrains Mono', monospace;
                      font-size: 11px;
                      color: #8b949e;
                      margin-bottom: 10px;
                    "
                  >
                    AI&nbsp;•&nbsp;Machine Learning&nbsp;•&nbsp;Full-Stack Development
                  </div>
                  <div style="font-size: 0">
                    <a
                      href="https://nishanshrestha04.com.np"
                      target="_blank"
                      style="
                        text-decoration: none;
                        display: inline-block;
                        margin-right: 12px;
                      "
                      title="Portfolio"
                    >
                      <img
                        src="https://img.icons8.com/ios-filled/50/8b949e/domain.png"
                        width="16"
                        height="16"
                        alt="Portfolio"
                        style="display: block; border: 0"
                      />
                    </a>
                    <a
                      href="https://github.com/nishanshrestha04"
                      target="_blank"
                      style="
                        text-decoration: none;
                        display: inline-block;
                        margin-right: 12px;
                      "
                      title="GitHub"
                    >
                      <img
                        src="https://img.icons8.com/ios-filled/50/8b949e/github.png"
                        width="16"
                        height="16"
                        alt="GitHub"
                        style="display: block; border: 0"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/nishanshrestha04/"
                      target="_blank"
                      style="text-decoration: none; display: inline-block"
                      title="LinkedIn"
                    >
                      <img
                        src="https://img.icons8.com/ios-filled/50/8b949e/linkedin.png"
                        width="16"
                        height="16"
                        alt="LinkedIn"
                        style="display: block; border: 0"
                      />
                    </a>
                  </div>
                  <div style="font-size: 11px; color: #8b949e; margin-top: 7px">
                    <a
                      href="mailto:nishanshrestha212@gmail.com"
                      style="
                        color: #8b949e;
                        text-decoration: none;
                        font-family: 'JetBrains Mono', monospace;
                      "
                      >nishanshrestha212@gmail.com</a
                    >
                  </div>
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
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050a0e; color: #ffffff; border-radius: 16px; border: 1px solid #1a232c; overflow: hidden;">
        <tr>
          <td style="padding: 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; border-bottom: 1px solid #1a232c; padding-bottom: 24px;">
              <tr>
                <td width="20" valign="middle">
                  <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #0070f3;"></div>
                </td>
                <td valign="middle">
                  <h2 style="margin: 0; font-size: 22px; font-weight: 600; color: #f0f6fc; letter-spacing: -0.5px;">New Contact Submission</h2>
                </td>
              </tr>
            </table>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
              <tr>
                <td width="80" valign="top" style="padding-bottom: 16px; font-size: 14px; color: #8b949e; font-weight: 500;">Name</td>
                <td valign="top" style="padding-bottom: 16px; font-size: 15px; color: #f0f6fc; font-weight: 600;">${contactDetails.name}</td>
              </tr>
              <tr>
                <td width="80" valign="top" style="padding-bottom: 16px; font-size: 14px; color: #8b949e; font-weight: 500;">Email</td>
                <td valign="top" style="padding-bottom: 16px; font-size: 15px;">
                  <a href="mailto:${contactDetails.email}" style="color: #0070f3; text-decoration: none; font-weight: 600;">${contactDetails.email}</a>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color: #0d1218; border: 1px solid #1a232c; border-radius: 12px; padding: 24px;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8b949e; font-weight: 600;">Message</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #e6edf3; white-space: pre-wrap; font-family: 'Inter', sans-serif;">${contactDetails.message}</p>
                </td>
              </tr>
            </table>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
              <tr>
                <td align="center">
                  <a href="mailto:${contactDetails.email}" style="display: inline-block; background-color: #0070f3; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">Reply to ${contactDetails.name}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
