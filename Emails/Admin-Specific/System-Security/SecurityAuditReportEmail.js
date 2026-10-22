import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SecurityAuditReportEmail(adminEmail, adminName, reportPeriod, generatedAt, totalEvents, criticalCount, highCount, mediumCount, lowCount, topEvents, failedLogins, passwordResets, permissionChanges, mfaEnrollments, suspiciousIPs, recommendations, reportUrl, securityEmail) {
  const eventRows = (topEvents || []).map(e => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#d4663a; display:inline-block; min-width:70px;">${e.severity}</span>
        <span style="color:#f0f0f0;">${e.event}</span>
        <p style="margin:4px 0 0; color:#888; font-size:11px; padding-left:78px;">${e.count} occurrence${e.count !== 1 ? 's' : ''}</p>
      </td>
    </tr>`).join('');

  const recommendationRows = (recommendations || []).map(r => `
    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">›</span> ${r}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Security Audit — ${reportPeriod} (${criticalCount + highCount} high-priority events)`,
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
                [  SECURITY AUDIT ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                SECURITY<br>AUDIT
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${reportPeriod.toUpperCase()} · GENERATED ${generatedAt}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is your periodic security audit summary. Prioritise items marked CRITICAL or HIGH.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td align="center" style="padding:20px 16px; background-color:#111111;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      TOTAL EVENTS
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:32px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${totalEvents}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:25%; padding-right:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#d4663a;">CRIT</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#f0f0f0;">${criticalCount}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:25%; padding:0 3px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#d4663a;">HIGH</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#f0f0f0;">${highCount}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:25%; padding:0 3px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#888;">MED</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#f0f0f0;">${mediumCount}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:25%; padding-left:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#888;">LOW</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#f0f0f0;">${lowCount}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${eventRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                TOP EVENTS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${eventRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ACTIVITY
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">FAILED LOGINS</td>
                  <td style="color:#f0f0f0;">${failedLogins}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PWD RESETS</td>
                  <td style="color:#f0f0f0;">${passwordResets}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PERM CHANGES</td>
                  <td style="color:#f0f0f0;">${permissionChanges}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">MFA ENROLLS</td>
                  <td style="color:#f0f0f0;">${mfaEnrollments}</td>
                </tr>
                ${suspiciousIPs ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SUSPICIOUS IPs</td>
                  <td style="color:#f0f0f0;">${suspiciousIPs}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          ${recommendationRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                RECOMMENDATIONS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${recommendationRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${reportUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      VIEW FULL REPORT →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Critical or high-priority events should be investigated within 24 hours. For urgent escalation, contact <strong style="color:#f0f0f0;">${securityEmail}</strong>.
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