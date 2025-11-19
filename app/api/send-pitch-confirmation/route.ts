import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create email HTML template for pitch confirmation
const getPitchEmailHTML = (name?: string, pitchTitle?: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pitch Submitted - Play It Loud</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <h1 style="margin: 0; color: #1a0a2e; font-size: 32px; font-weight: bold;">
                    🎬 Play It Loud
                  </h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="background-color: #f8f9fa; border-radius: 12px; padding: 40px 30px; border: 1px solid #e9ecef;">
                  <h2 style="margin: 0 0 20px 0; color: #1a0a2e; font-size: 24px; font-weight: bold;">
                    Pitch Submitted Successfully! 🎉
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #495057; font-size: 16px; line-height: 1.6;">
                    Hi${name ? ` ${name}` : ''},
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #495057; font-size: 16px; line-height: 1.6;">
                    Thank you for submitting your pitch${pitchTitle ? `: <strong>"${pitchTitle}"</strong>` : ''}!
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #495057; font-size: 16px; line-height: 1.6;">
                    We've received your submission and our team will review it carefully. We're excited to learn more about your idea and see how we can help bring it to life.
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #495057; font-size: 16px; line-height: 1.6;">
                    <strong style="color: #1a0a2e;">What happens next?</strong><br>
                    Our team will review your pitch and get back to you soon. We typically respond within 2-3 business days. In the meantime, feel free to reach out if you have any questions.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fff; border-radius: 8px; border: 2px solid #dc3545;">
                    <p style="margin: 0; color: #dc3545; font-size: 18px; font-weight: bold;">
                      We'll get back to you soon! 🚀
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                    If you have any questions or need to update your submission, please don't hesitate to contact us.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 30px;">
                  <img 
                    src="https://res.cloudinary.com/dodl9nols/image/upload/v1757338623/PLAY_YOUTUBE_BANNER_Kansiime_fr3yop.jpg" 
                    alt="Play It Loud" 
                    style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;"
                  />
                  <p style="margin: 0; color: #6c757d; font-size: 14px;">
                    © 2025 Play It Loud. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #adb5bd; font-size: 12px;">
                    You're receiving this email because you submitted a pitch to Play It Loud.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

// Create transporter based on environment variables
const createTransporter = () => {
  // Check if using SMTP (Gmail, Outlook, etc.)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  // Check if using Gmail OAuth2
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    })
  }

  // Default: Try Gmail with app password
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, pitchTitle } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const transporter = createTransporter()

    if (!transporter) {
      console.log('Email service not configured. Pitch confirmation email would be sent to:', email)
      return NextResponse.json({
        success: true,
        message: 'Email service not configured. Please set up SMTP or Gmail credentials in .env.local',
        email: email
      })
    }

    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@playitloud.com'
    const fromName = process.env.FROM_NAME || process.env.EMAIL_FROM_NAME || 'NRG Radio Uganda'

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Pitch Submitted Successfully! 🎬',
      html: getPitchEmailHTML(name, pitchTitle),
    })

    return NextResponse.json({
      success: true,
      message: 'Pitch confirmation email sent successfully',
      messageId: info.messageId
    })
  } catch (error: any) {
    console.error('Error sending pitch confirmation email:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}

