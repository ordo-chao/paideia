import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SchoolEventInvitationEmail(parentEmail, parentName, childName, gradeLevel, stream, eventTitle, eventType, eventDate, eventTime, venue, description, rsvpRequired, rsvpDeadline, rsvpUrl, cost, contactPerson, contactPhone, contactEmail, programmeUrl) {
  const programme = (await (async () => ''))(); // placeholder to keep shape consistent

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `You're Invited: ${eventTitle} — ${eventDate}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:'JetBrains Mono','Courier New',monospace;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a; padding:48px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#0a0a0a; border:1px solid #2a2a2a;">

          <tr>
            <td style="padding:20px 28px; border-bottom:1px solid #2a2a2a;">
              <span style="font-family:'Courier New',monospace; font-size:10px; letter-spacing:3px; color:#d4663a; text-transform:uppercase;">
                [  EVENT INVITATION · ${eventType.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                YOU'RE<br>INVITED
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Dear ${parentName},<br><br>
                On behalf of the school, we warmly invite you to <strong style="color:#f0f0f0;">${eventTitle}</strong>. As a parent of ${childName} (${gradeLevel}${stream ? ` ${stream}` : ''}), your presence would mean a great deal to the school community.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:24px; background-color:#111111;">
                    <h2 style="margin:0 0 16px; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:20px; line-height:1.2; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${eventTitle}
                    </h2>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DATE</td>
                        <td style="color:#f0f0f0;">${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TIME</td>
                        <td style="color:#f0f0f0;">${eventTime}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">VENUE</td>
                        <td style="color:#f0f0f0;">${venue}</td>
                      </tr>
                      ${cost ? `
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ENTRY</td>
                        <td style="color:#f0f0f0;">${cost}</td>
                      </tr>` : ''}
                      ${rsvpRequired ? `
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RSVP BY</td>
                        <td style="color:#f0f0f0;">${rsvpDeadline}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CONTACT</td>
                        <td style="color:#f0f0f0;">${contactPerson} · ${contactPhone}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${description}
              </p>
            </td>
          </tr>

          ${rsvpRequired ? `
          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${rsvpUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      RSVP NOW →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      Please confirm your attendance by ${rsvpDeadline} so we can plan seating and refreshments.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border:1px solid #2a2a2a;">
                    <a href="${programmeUrl}"
                       target="_blank"
                       style="display:inline-block; padding:12px 24px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; color:#f0f0f0; text-decoration:none;">
                      VIEW PROGRAMME →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                For queries, contact <strong style="color:#f0f0f0;">${contactEmail}</strong> or call <strong style="color:#f0f0f0;">${contactPhone}</strong>. We look forward to welcoming you.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px; border-top:1px solid #2a2a2a; margin-top:32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family:'Courier New',monospace; font-size:10px; color:#555; letter-spacing:1px;">
                    © 2026 Paideia · NAIROBI, KENYA
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Courier New',monospace; font-size:10px; color:#d4663a; letter-spacing:1px; padding-top:6px;">
                    // END OF TRANSMISSION
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
}