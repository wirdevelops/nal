import { baseHTML, createButton, EmailTemplate } from '@/lib/email-service';

const welcomeTemplate: EmailTemplate = {
    render: (data) => {
        return baseHTML(`
          <h1>${data.subject}, ${data.name}</h1>
            <p>We're excited to have you as a member of Nalevel Empire!</p>
            <p>You can go to your dashboard by clicking below:</p>
            ${createButton("Go to Dashboard", data.dashboardUrl as string)}
        `);
    },
    renderText: (data) => {
       return `${data.subject} ${data.name}, Welcome to Nalevel Empire! Go to your dashboard here: ${data.dashboardUrl}`;
    }
};
export default welcomeTemplate;