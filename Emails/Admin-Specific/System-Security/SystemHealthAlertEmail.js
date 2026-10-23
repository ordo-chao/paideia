import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SystemHealthAlertEmail(adminEmail, adminName, severity, alertName, service, environment, detectedAt, metric, currentValue, threshold, impact, affectedUsers, diagnosis, recommendedActions, dashboardUrl, runbookUrl, onCallName, onCallPhone, incidentEmail) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `[${severity.toUpperCase()}] ${alertName} — ${service} (${environment})`,
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
                [  SYSTEM HEALTH · ${severity.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:30px; line-height:1.05; color:#f0f0f0; letter-spacing:-0.02em;">
                ${alertName.toUpperCase()}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                SERVICE: ${service.toUpperCase()} · ENV: ${environment.toUpperCase()} · ${detectedAt}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, this alert requires your attention. Diagnose below and follow the runbook or escalate to on-call.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #d4663a; background-color:#111111;">
                <tr>
                  <td align="center" style="padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      ${metric.toUpperCase()}
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:28px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${currentValue}
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      threshold: ${threshold}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                IMPACT
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${impact}${affectedUsers ? `<br><br>Affected users: <strong style="color:#f0f0f0;">${affectedUsers}</strong>` : ''}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                DIAGNOSIS
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${diagnosis}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                RECOMMENDED ACTIONS
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${recommendedActions}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${dashboardUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      OPEN DASHBOARD →
                    </a>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="background-color:#111111; border:1px solid #2a2a2a;">
                    <a href="${runbookUrl}"
                       target="_blank"
                       style="display:inline-block; padding:12px 24px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; color:#f0f0f0; text-decoration:none;">
                      OPEN RUNBOOK →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:20px 24px; background-color:#111111;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ON-CALL</td>
                        <td style="color:#f0f0f0;">${onCallName} · ${onCallPhone}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">INCIDENT EMAIL</td>
                        <td style="color:#f0f0f0;">${incidentEmail}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                Do not reply to this email. Use the dashboard or escalate to on-call for real-time coordination.
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