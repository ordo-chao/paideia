import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function ApplicationStatusChangeEmail(adminEmail, adminName, applicationId, applicantName, gradeApplied, previousStatus, newStatus, changedBy, changedAt, reason, nextStep, assignedTo, parentNotified, parentNotifiedAt, portalUrl, notes) {
  const getStatusColor = (s) => {
    if (s === 'approved' || s === 'enrolled') return '#d4663a';
    if (s === 'rejected' || s === 'withdrawn') return '#555';
    return '#f0f0f0';
  };

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Application Status: ${applicantName} → ${newStatus.toUpperCase()}`,
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
                [  APPLICATION STATUS ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                STATUS<br>CHANGED
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, application <strong style="color:#f0f0f0;">${applicationId}</strong> for <strong style="color:#f0f0f0;">${applicantName}</strong> (${gradeApplied}) has moved through the pipeline.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #2a2a2a; padding:20px 16px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:0 16px; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:2px; color:#555;">
                            FROM
                          </p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:14px; font-weight:900; color:#555; letter-spacing:-0.01em; text-transform:uppercase;">
                            ${previousStatus}
                          </p>
                        </td>
                        <td style="padding:0 12px; color:#d4663a; font-family:'Courier New',monospace; font-size:16px;">
                          →
                        </td>
                        <td style="padding:0 16px; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:2px; color:#555;">
                            TO
                          </p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:14px; font-weight:900; color:${getStatusColor(newStatus)}; letter-spacing:-0.01em; text-transform:uppercase;">
                            ${newStatus}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CHANGED BY</td>
                  <td style="color:#f0f0f0;">${changedBy} · ${changedAt}</td>
                </tr>
                ${assignedTo ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ASSIGNED TO</td>
                  <td style="color:#f0f0f0;">${assignedTo}</td>
                </tr>` : ''}
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PARENT NOTIFIED</td>
                  <td style="color:#f0f0f0;">${parentNotified ? `Yes · ${parentNotifiedAt}` : 'No'}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${reason ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                REASON
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${reason}
              </p>
            </td>
          </tr>` : ''}

          ${nextStep ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      NEXT STEP
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#888;">
                      ${nextStep}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          ${notes ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                INTERNAL NOTES
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${notes}
              </p>
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
                      OPEN APPLICATION →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                ${parentNotified
                  ? 'The parent has been notified. No further action unless the parent responds.'
                  : 'The parent has NOT yet been notified. Send the status notification from the portal if this is an approved or rejected status.'}
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