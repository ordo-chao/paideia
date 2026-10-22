import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function ConfigReloadConfirmationEmail(adminEmail, adminName, configName, environment, triggeredBy, triggeredAt, duration, status, changes, validationWarnings, rollbackUrl, auditUrl, incidentEmail) {
  const changeRows = (changes || []).map(c => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#d4663a; display:inline-block; min-width:80px;">${c.type}</span>
        <span style="color:#f0f0f0;">${c.path}</span>
      </td>
    </tr>`).join('');

  const warningRows = (validationWarnings || []).map(w => `
    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">!</span> ${w}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Config Reload ${status === 'success' ? 'Completed' : 'FAILED'} — ${configName} (${environment})`,
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
                [  CONFIG RELOAD ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                CONFIG<br>${status === 'success' ? 'RELOADED' : 'FAILED'}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${adminName},<br><br>
                A configuration reload was triggered for <strong style="color:#f0f0f0;">${configName}</strong> in <strong style="color:#f0f0f0;">${environment}</strong> by ${triggeredBy}.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed ${status === 'success' ? '#d4663a' : '#d4663a'}; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      STATUS: ${status.toUpperCase()}
                    </p>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      completed in ${duration}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CONFIG</td>
                  <td style="color:#f0f0f0;">${configName}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ENVIRONMENT</td>
                  <td style="color:#f0f0f0;">${environment}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TRIGGERED BY</td>
                  <td style="color:#f0f0f0;">${triggeredBy}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TRIGGERED AT</td>
                  <td style="color:#f0f0f0;">${triggeredAt}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${changeRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                CHANGES APPLIED
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${changeRows}
              </table>
            </td>
          </tr>` : ''}

          ${warningRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                VALIDATION WARNINGS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${warningRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border:1px solid #2a2a2a; padding-right:12px;">
                    <a href="${auditUrl}"
                       target="_blank"
                       style="display:inline-block; padding:12px 24px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; color:#f0f0f0; text-decoration:none;">
                      VIEW AUDIT →
                    </a>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${rollbackUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      ROLLBACK →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                ${status === 'success'
                  ? 'Configuration has been applied. If anything looks wrong, roll back using the button above and contact ' + incidentEmail + '.'
                  : 'The new configuration was NOT applied. Investigate the validation errors and retry. Contact ' + incidentEmail + ' if you need help.'}
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