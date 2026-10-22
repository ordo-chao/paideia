import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function BackupStatusEmail(adminEmail, adminName, status, backupName, source, destination, startedAt, duration, size, objectCount, failureReason, verificationStatus, retentionDays, nextScheduled, backupUrl, auditUrl, onCallName, incidentEmail) {
  const isSuccess = status === 'success';

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Backup ${isSuccess ? 'Completed' : 'FAILED'} — ${backupName}`,
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
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#0a0a0a; border:1px solid ${isSuccess ? '#2a2a2a' : '#d4663a'};">

          <tr>
            <td style="padding:20px 28px; border-bottom:1px solid #2a2a2a;">
              <span style="font-family:'Courier New',monospace; font-size:10px; letter-spacing:3px; color:#d4663a; text-transform:uppercase;">
                [  BACKUP ${isSuccess ? 'COMPLETED' : 'FAILED'} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                BACKUP<br>${isSuccess ? 'OK' : 'FAILED'}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, the scheduled backup <strong style="color:#f0f0f0;">${backupName}</strong> ${isSuccess ? 'completed successfully.' : 'did not complete. Please investigate immediately.'}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed ${isSuccess ? '#2a2a2a' : '#d4663a'}; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:${isSuccess ? '#555' : '#d4663a'};">
                      STATUS: ${status.toUpperCase()}
                    </p>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${isSuccess ? `size ${size} · ${objectCount} objects · ${duration}` : `failed after ${duration}`}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SOURCE</td>
                  <td style="color:#f0f0f0;">${source}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DESTINATION</td>
                  <td style="color:#f0f0f0;">${destination}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">STARTED</td>
                  <td style="color:#f0f0f0;">${startedAt}</td>
                </tr>
                ${isSuccess ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RETENTION</td>
                  <td style="color:#f0f0f0;">${retentionDays}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">VERIFICATION</td>
                  <td style="color:#f0f0f0;">${verificationStatus}</td>
                </tr>` : ''}
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">NEXT RUN</td>
                  <td style="color:#f0f0f0;">${nextScheduled}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${!isSuccess && failureReason ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      FAILURE REASON
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#888;">
                      ${failureReason}
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
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${backupUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      OPEN BACKUP →
                    </a>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="background-color:#111111; border:1px solid #2a2a2a;">
                    <a href="${auditUrl}"
                       target="_blank"
                       style="display:inline-block; padding:12px 24px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; color:#f0f0f0; text-decoration:none;">
                      VIEW LOGS →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                ${isSuccess
                  ? 'No action required. A monthly restore test is scheduled to verify recoverability.'
                  : 'Escalate to on-call (' + onCallName + ') or ' + incidentEmail + ' if the next scheduled run also fails.'}
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