import { baseHTML, createButton, EmailTemplate } from '@/lib/email-service';

// Define the data structure for this specific template
interface VerificationEmailData {
    verifyUrl: string;
}

const verificationEmailTemplate: EmailTemplate<VerificationEmailData> = {
  render: (data) => {
    return baseHTML(`
      <p>Hello,</p>
      <p>Please click the button below to verify your email:</p>
      ${createButton('Verify Email', data.verifyUrl)}
      `);
  },
  renderText: (data) => {
    return `Please click the link to verify your email: ${data.verifyUrl}`;
  }
};

export default verificationEmailTemplate;