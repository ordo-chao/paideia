import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function EmergencyAlertEmail(parentEmail, parentName, childName, gradeLevel, stream, alertType, severity, headline, situation, actionTaken, whatParentsShouldDo, schoolStatus, nextUpdateTime, hotlinePhone, hotlineEmail, portalUrl) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `[URGENT] ${headline}`,
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
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#0a0a0a; border:1px solid #d4663a;">

          <tr>
            <td style="padding:20px 28px; border-bottom:1px solid #2a2a2a; background-color:#1a0f0a;">
              <span style="font-family:'Courier New',monospace; font-size:10px; letter-spacing:3px; color:#d4663a; text-transform:uppercase;">
                [  EMERGENCY ALERT · ${alertType.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${headline.toUpperCase()}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                SEVERITY: ${severity.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Dear ${parentName},<br><br>
                This message concerns <strong style="color:#f0f0f0;">${childName}</strong> (${gradeLevel}${stream ? ` ${stream}` : ''}) and the entire school community.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #d4663a; background-color:#111111;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      SITUATION
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#f0f0f0;">
                      ${situation}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ACTION TAKEN BY SCHOOL
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${actionTaken}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                WHAT YOU SHOULD DO
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${whatParentsShouldDo}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:20px 24px; background-color:#111111;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SCHOOL STATUS</td>
                        <td style="color:#f0f0f0;">${schoolStatus}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">NEXT UPDATE</td>
                        <td style="color:#f0f0f0;">${nextUpdateTime}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">HOTLINE</td>
                        <td style="color:#f0f0f0;">${hotlinePhone}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">EMAIL</td>
                        <td style="color:#f0f0f0;">${hotlineEmail}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      VIEW LIVE UPDATES →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                Do not reply to this email — use the hotline or the live portal for urgent queries. Updates will also be sent by SMS.
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