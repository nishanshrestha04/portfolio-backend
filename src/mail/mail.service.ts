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
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
        <div style="padding: 40px; text-align: center; border-bottom: 1px solid #222;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #10b981;">Thank you for reaching out!</h1>
        </div>
        <div style="padding: 40px; background-color: #111;">
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db; margin-top: 0;">Hi <strong style="color: #fff;">${contactDetails.name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">I've received your message and appreciate you taking the time to write to me. I will review your inquiry and get back to you as soon as possible.</p>
          <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #333;">
            <p style="font-size: 16px; color: #9ca3af; margin: 0;">Best regards,</p>
            <p style="font-size: 18px; font-weight: 600; color: #ffffff; margin: 8px 0 0 0;">Nishan Shrestha</p>
          </div>
        </div>
      </div>
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
