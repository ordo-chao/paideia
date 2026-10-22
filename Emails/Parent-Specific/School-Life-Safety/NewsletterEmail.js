import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function NewsletterEmail(parentEmail, parentName, issueTitle, issueNumber, term, academicYear, month, highlights, announcements, upcomingEvents, portalUrl, unsubscribeUrl) {
  const highlightRows = (highlights || []).map(h => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#d4663a; display:inline-block; margin-right:8px;">›</span>
        <span style="color:#f0f0f0;">${h.title}</span>
        <p style="margin:4px 0 0; color:#888; font-size:11px; line-height:1.6; padding-left:16px;">${h.summary}</p>
      </td>
    </tr>`).join('');

  const announcementRows = (announcements || []).map(a => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">—</span> ${a}
      </td>
    </tr>`).join('');

  const eventRows = (upcomingEvents || []).map(e => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#d4663a; display:inline-block; min-width:90px;">${e.date}</span>
        <span style="color:#f0f0f0;">${e.title}</span>
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `${issueTitle} — ${month}, ${academicYear}`,
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
                [  NEWSLETTER · ${issueNumber.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${issueTitle.toUpperCase()}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${month.toUpperCase()} ${academicYear.toUpperCase()} · ${term.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Dear ${parentName},<br><br>
                Welcome to the ${month} edition of the Paideia newsletter — a short read of the highlights, announcements, and dates worth knowing about.
              </p>
            </td>
          </tr>

          ${highlightRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                HIGHLIGHTS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${highlightRows}
              </table>
            </td>
          </tr>` : ''}

          ${announcementRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                NOTICES
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${announcementRows}
              </table>
            </td>
          </tr>` : ''}

          ${eventRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                UPCOMING DATES
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${eventRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      READ FULL NEWSLETTER →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                You are receiving this newsletter because you are a registered parent at Paideia. <a href="${unsubscribeUrl}" style="color:#888; text-decoration:underline;">Unsubscribe from newsletters</a> (you will still receive essential communications).
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