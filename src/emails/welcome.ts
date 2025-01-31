import { EmailTemplate } from '@/lib/email-service';

const welcomeTemplate: EmailTemplate = {
    render: (data) => {
        const { name, subject, dashboardUrl } = data;
    return `
        ${baseHTML(`
          <h1>${subject}, ${name}</h1>
            <p>We're excited to have you as a member of Nalevel Empire!</p>
            <p>You can go to your dashboard by clicking below:</p>
            ${createButton("Go to Dashboard", dashboardUrl as string)}
            
        `)}
        `;
    },
    renderText: (data) => {
       const { name, subject, dashboardUrl } = data;
       return `${subject} ${name}, Welcome to Nalevel Empire! Go to your dashboard here: ${dashboardUrl}`;
    }
};
export default welcomeTemplate;

import { baseHTML, createButton } from '@/lib/email-service';