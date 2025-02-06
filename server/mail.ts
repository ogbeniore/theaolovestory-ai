import { MailService } from '@sendgrid/mail';
import { Guest } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

if (!process.env.SENDGRID_VERIFIED_SENDER) {
  throw new Error("SENDGRID_VERIFIED_SENDER environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_VERIFIED_SENDER;
const ADMIN_EMAIL = 'admin@amakaandoreoluwa.com';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function sendRsvpNotification(guest: Guest) {
  console.log(`Attempting to send RSVP notification for guest: ${guest.name}`);

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
    console.log(`Sending admin notification to ${ADMIN_EMAIL}`);
    if (!isValidEmail(ADMIN_EMAIL)) {
      throw new Error(`Invalid admin email address: ${ADMIN_EMAIL}`);
    }

    await mailService.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: adminSubject,
      text: adminText,
    });
    console.log('Successfully sent admin notification');

    // Send confirmation to guest if they provided an email
    if (guest.email && isValidEmail(guest.email)) {
      console.log(`Sending guest confirmation to ${guest.email}`);
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
      console.log('Successfully sent guest confirmation');
    } else if (guest.email) {
      console.log(`Skipping guest email - invalid address: ${guest.email}`);
    }

    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', {
      error: error.message,
      response: error.response?.body,
      guest: {
        name: guest.name,
        email: guest.email,
      }
    });

    // Log specific SendGrid error details if available
    if (error.response?.body) {
      console.error('SendGrid API Error Details:', JSON.stringify(error.response.body, null, 2));
    }

    return false;
  }
}