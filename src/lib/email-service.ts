// lib/email-service.ts
import { Resend } from 'resend';
import validator from 'validator';

// Initialize Resend only if the API key is available
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@nalevelempire.com';

const emailTemplates = new Map<string, EmailTemplate>();

export type EmailData = {
  subject: string;
  [key: string]: unknown;
};

export interface EmailTemplate {
  render: (data: EmailData) => string;
  renderText: (data: EmailData) => string;
}

export async function sendEmail(
  type: 'verification' | 'reset' | 'welcome',
  email: string,
  data: EmailData
) {
    if (!resend) {
      console.error("Resend API key not configured. Email service is disabled.");
      return { success: false, error: "Resend API key not configured" };
    }

  validateEmail(email);

  if (typeof data.subject !== 'string') {
    throw new Error('Email subject must be a string');
  }

  const template = await getTemplate(type);
  const html = template.render(data);
  const text = template.renderText(data);

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: data.subject,
        headers: {
          'X-Entity-Ref': `${type}-email`
        },
        html,
        text
      });

      if (result.error) throw result.error;
      return { success: true, data: result.data };
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`Email failed after 3 attempts: ${error}`);
        return { success: false, error };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
    }
  }
   return { success: false, error: "Email send failed after multiple retries" };
}

async function getTemplate(name: string): Promise<EmailTemplate> {
    if (!emailTemplates.has(name)) {
      try {
        const templateModule = await import(`@/emails/${name}`);
        const template: EmailTemplate = templateModule.default;

        if (!template || typeof template?.render !== 'function' || typeof template?.renderText !== 'function') {
          throw new Error(`Invalid email template: ${name}`);
        }
        emailTemplates.set(name, template);
      } catch (error) {
        console.error(`Error loading email template ${name}:`, error);
        throw new Error(`Failed to load email template: ${name}`);
      }
    }
    return emailTemplates.get(name)!;
}

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_APP_URL is not defined');

  if (process.env.NODE_ENV === 'production') {
    return baseUrl.replace(/^http:/, 'https:');
  }
  return baseUrl;
};


export const baseHTML = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .footer { margin-top: 2rem; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>Best regards,<br>The Nalevel Empire Team</p>
    </div>
  </div>
</body>
</html>
`;

export const createButton = (text: string, url: string) => `
  <p>
    <a href="${url}" 
       style="background-color: #2563eb; color: white; 
              padding: 12px 24px; border-radius: 4px; 
              text-decoration: none; display: inline-block;">
      ${text}
    </a>
  </p>
`;

const validateEmail = (email: string) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email address');
  }
};

export async function sendVerificationEmail(email: string, token: string) {
    const encodedToken = encodeURIComponent(token);
    const verifyUrl = `${getBaseUrl()}/auth/verify?token=${encodedToken}`;

    return sendEmail('verification', email, {
      subject: 'Verify your email address',
      verifyUrl,
      token
    });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const encodedToken = encodeURIComponent(token);
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${encodedToken}`;

  return sendEmail('reset', email, {
    subject: 'Reset your password',
    resetUrl,
    token
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${getBaseUrl()}/dashboard`;

  return sendEmail('welcome', email, {
    subject: 'Welcome to Nalevel Empire',
    name,
    dashboardUrl
  });
}