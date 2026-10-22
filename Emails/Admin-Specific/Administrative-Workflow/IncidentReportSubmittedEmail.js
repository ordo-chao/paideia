import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function IncidentReportSubmittedEmail(adminEmail, adminName, incidentId, category, severity, incidentDate, incidentTime, location, reportedBy, reportedByRole, reportedAt, involvedParties, description, immediateAction, witnesses, safeguardingLead, safeguardingLeadPhone, parentNotified, authoritiesNotified, reviewDeadline, portalUrl, emergencyEmail) {
  const partyRows = (involvedParties || []).map(p => `
    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">›</span> ${p}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@craygroup.biz',
    to: adminEmail,
    subject: `[${severity.toUpperCase()}] Incident Report — ${incidentId} (${category})`,
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
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#0a0a0a; border:1px solid ${severity === 'critical' || severity === 'high' ? '#d4663a' : '#2a2a2a'};">

          <tr>
            <td style="padding:20px 28px; border-bottom:1px solid #2a2a2a; background-color:${severity === 'critical' || severity === 'high' ? '#1a0f0a' : 'transparent'};">
              <span style="font-family:'Courier New',monospace; font-size:10px; letter-spacing:3px; color:#d4663a; text-transform:uppercase;">
                [  INCIDENT REPORT · ${severity.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                INCIDENT<br>REPORTED
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, a <strong style="color:#f0f0f0;">${severity}</strong> severity incident has been reported. ${severity === 'critical' ? 'Immediate review is required.' : 'Please review within the stated deadline.'}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:24px; background-color:#111111;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">INCIDENT ID</td>
                        <td style="color:#f0f0f0;">${incidentId}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CATEGORY</td>
                        <td style="color:#f0f0f0;">${category}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SEVERITY</td>
                        <td style="color:#d4663a;">${severity.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DATE/TIME</td>
                        <td style="color:#f0f0f0;">${incidentDate} · ${incidentTime}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">LOCATION</td>
                        <td style="color:#f0f0f0;">${location}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REPORTED BY</td>
                        <td style="color:#f0f0f0;">${reportedBy} · ${reportedByRole}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REPORTED AT</td>
                        <td style="color:#f0f0f0;">${reportedAt}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REVIEW BY</td>
                        <td style="color:#f0f0f0;">${reviewDeadline}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${partyRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                INVOLVED PARTIES
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${partyRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                DESCRIPTION
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${description}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                IMMEDIATE ACTION TAKEN
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${immediateAction}
              </p>
            </td>
          </tr>

          ${witnesses ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                WITNESSES
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${witnesses}
              </p>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      NOTIFICATIONS
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#888;">
                      Parent/guardian: ${parentNotified ? 'Notified' : 'Not yet notified'}<br>
                      Authorities: ${authoritiesNotified ? 'Notified' : 'Not applicable at this stage'}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SAFEGUARDING LEAD</td>
                  <td style="color:#f0f0f0;">${safeguardingLead} · ${safeguardingLeadPhone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      REVIEW INCIDENT →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:${severity === 'critical' ? '#d4663a' : '#666'};">
                ${severity === 'critical'
                  ? `CRITICAL incidents require same-day review. Contact ${emergencyEmail} or the safeguarding lead immediately if the situation is ongoing.`
                  : `Review and document any decisions in the portal by ${reviewDeadline}. All incident details are confidential.`}
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