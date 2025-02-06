import { MailService } from '@sendgrid/mail';
import { Guest } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'notifications@amakaandoreoluwa.com';
const ADMIN_EMAIL = 'admin@amakaandoreoluwa.com';

export async function sendRsvpNotification(guest: Guest) {
  const adminSubject = `New RSVP: ${guest.name}`;
  const adminText = `
New RSVP received from ${guest.name}
Email: ${guest.email || 'Not provided'}
Attending: ${guest.isAttending ? 'Yes' : 'No'}
Dietary Restrictions: ${guest.dietaryRestrictions || 'None'}
Plus One: ${guest.plusOne ? 'Yes' : 'No'}
RSVP Date: ${guest.rsvpDate}
`;

  try {
    // Send notification to admin
    await mailService.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: adminSubject,
      text: adminText,
    });

    // Send confirmation to guest if they provided an email
    if (guest.email) {
      const guestSubject = 'Thank you for your RSVP';
      const guestText = `
Dear ${guest.name},

Thank you for responding to our wedding invitation. We have received your RSVP.

Details of your response:
Attending: ${guest.isAttending ? 'Yes' : 'No'}
${guest.dietaryRestrictions ? `Dietary Restrictions: ${guest.dietaryRestrictions}` : ''}
${guest.plusOne ? 'You have indicated that you will bring a plus one.' : ''}

If you need to make any changes to your RSVP, please contact us directly.

Best regards,
Amaka & Oreoluwa
`;

      await mailService.send({
        to: guest.email,
        from: FROM_EMAIL,
        subject: guestSubject,
        text: guestText,
      });
    }

    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}
