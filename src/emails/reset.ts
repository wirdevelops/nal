import { baseHTML, createButton, EmailTemplate } from '@/lib/email-service';

const resetTemplate: EmailTemplate = {
    render: (data) => {
        return baseHTML(`
        <h1>${data.subject}</h1>
            <p>Please click the button below to reset your password:</p>
                ${createButton("Reset Password", data.resetUrl as string)}
            `);
    },
    renderText: (data) => {
      return `${data.subject} Please reset your password by clicking the following link: ${data.resetUrl}`;
    }
};

export default resetTemplate;