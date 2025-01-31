import { EmailTemplate } from '@/lib/email-service';

const verificationTemplate: EmailTemplate = {
  render: (data) => {
    const { verifyUrl, subject } = data;
    return `
      ${baseHTML(`
        <h1>${subject}</h1>
        <p>Please click the button below to verify your email address:</p>
          ${createButton("Verify Email", verifyUrl as string)}
      `)}
    `;
  },
  renderText: (data) => {
    const { verifyUrl, subject } = data;
    return `${subject} Please verify your email by clicking the following link: ${verifyUrl}`;
  }
};

export default verificationTemplate;

import { baseHTML, createButton } from '@/lib/email-service';