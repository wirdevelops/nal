import { baseHTML, createButton, EmailTemplate } from '@/lib/email-service';

interface WelcomeEmailData {
    subject: string;
    name: string;
    dashboardUrl: string;
}

const welcomeTemplate: EmailTemplate<WelcomeEmailData> = {
    render: (data) => {
        return baseHTML(`
          <h1>${data.subject}, ${data.name}</h1>
            <p>We're excited to have you as a member of Nalevel Empire!</p>
            <p>You can go to your dashboard by clicking below:</p>
            ${createButton("Go to Dashboard", data.dashboardUrl)}
        `);
    },
    renderText: (data) => {
       return `${data.subject} ${data.name}, Welcome to Nalevel Empire! Go to your dashboard here: ${data.dashboardUrl}`;
    }
};
export default welcomeTemplate;