import { EmailTemplate } from '@/lib/email-service';

const resetTemplate: EmailTemplate = {
  render: (data) => {
    const { resetUrl, subject } = data;
    return `
      ${baseHTML(`
          <h1>${subject}</h1>
          <p>Please click the button below to reset your password:</p>
            ${createButton("Reset Password", resetUrl as string)}
      `)}
    `;
  },
  renderText: (data) => {
     const { resetUrl, subject } = data;
     return `${subject} Please reset your password by clicking the following link: ${resetUrl}`;
  }
};

export default resetTemplate;

import { baseHTML, createButton } from '@/lib/email-service';