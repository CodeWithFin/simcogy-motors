import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@simcogy-motors.com";
export const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@simcogy-motors.com";

interface LeadEmailData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  channel: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carSlug: string;
  carPrice: string;
}

interface TradeInEmailData {
  make: string;
  model: string;
  year: number;
  mileage_km: number;
  condition_notes: string;
  phone: string;
}

function generateLeadEmailHtml(data: LeadEmailData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const carUrl = `${siteUrl}/cars/${data.carSlug}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">New Lead Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Customer Details</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Name:</strong> ${data.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Phone:</strong> ${data.phone}</td>
                      </tr>
                      ${data.email ? `<tr><td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Email:</strong> ${data.email}</td></tr>` : ""}
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Channel:</strong> ${data.channel.charAt(0).toUpperCase() + data.channel.slice(1).replace("_", " ")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Vehicle of Interest</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Vehicle:</strong> ${data.carYear} ${data.carMake} ${data.carModel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Price:</strong> ${data.carPrice}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Listing:</strong> <a href="${carUrl}" style="color: #2563eb; text-decoration: none;">${carUrl}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${data.message ? `
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                    <p style="margin: 0; font-size: 15px; color: #374151; white-space: pre-wrap;">${data.message}</p>
                  </td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-right: 12px;">
                    <a href="${carUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500; text-decoration: none;">View Listing</a>
                  </td>
                  <td>
                    <a href="https://wa.me/${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${data.name}, thanks for your interest in the ${data.carYear} ${data.carMake} ${data.carModel} from Simcogy Motors.`)}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500; text-decoration: none;">Reply on WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">Simcogy Motors — Internal Notification</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateTradeInEmailHtml(data: TradeInEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">New Trade-In Request</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Customer Contact</p>
                    <p style="margin: 0; font-size: 15px; color: #374151;"><strong>Phone:</strong> ${data.phone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Vehicle Details</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Make:</strong> ${data.make}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Model:</strong> ${data.model}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Year:</strong> ${data.year}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #374151;"><strong>Mileage:</strong> ${data.mileage_km.toLocaleString()} km</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Condition Notes</p>
                    <p style="margin: 0; font-size: 15px; color: #374151; white-space: pre-wrap;">${data.condition_notes || "No notes provided"}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <a href="https://wa.me/${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, thanks for your trade-in request for the ${data.year} ${data.make} ${data.model}. We'll review and get back to you shortly.`)}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500; text-decoration: none;">Reply on WhatsApp</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">Simcogy Motors — Internal Notification</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendLeadNotificationEmail(data: LeadEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Lead: ${data.name} — ${data.carYear} ${data.carMake} ${data.carModel}`,
      html: generateLeadEmailHtml(data),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send lead notification email:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendTradeInNotificationEmail(data: TradeInEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Trade-In Request: ${data.year} ${data.make} ${data.model}`,
      html: generateTradeInEmailHtml(data),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send trade-in notification email:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}