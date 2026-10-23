import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function DailyAttendanceSummaryEmail(adminEmail, adminName, reportDate, totalStudents, present, absent, late, excused, unexcused, byClass, byReason, notifiableAbsences, followUpRequired, reportUrl, attendanceOfficer, attendanceEmail) {
  const classRows = (byClass || []).map(c => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${c.class}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${c.present}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a;">${c.absent}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${c.late}</td>
    </tr>`).join('');

  const reasonRows = (byReason || []).map(r => `
    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">›</span> ${r.reason}
      </td>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">
        ${r.count}
      </td>
    </tr>`).join('');

  const attendanceRate = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Daily Attendance Summary — ${reportDate} (${attendanceRate}% present)`,
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
                [  DAILY ATTENDANCE · ${reportDate.toUpperCase()} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ATTENDANCE<br>SUMMARY
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is the attendance summary for ${reportDate}.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      ATTENDANCE RATE
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:36px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${attendanceRate}%
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${present} present · ${absent} absent · ${late} late
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:33%; padding-right:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#888;">TOTAL</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#f0f0f0;">${totalStudents}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:33%; padding:0 3px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">EXCUSED</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#888;">${excused}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:33%; padding-left:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #d4663a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#d4663a;">UNEXCUSED</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:20px; font-weight:900; color:#d4663a;">${unexcused}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${classRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY CLASS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom:4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">CLASS</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">PRES</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">ABS</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">LATE</td>
                </tr>
                ${classRows}
              </table>
            </td>
          </tr>` : ''}

          ${reasonRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ABSENCE REASONS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${reasonRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      FOLLOW-UP REQUIRED
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#888;">
                      ${notifiableAbsences} absences exceeded the notification threshold.<br>
                      ${followUpRequired}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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
                Report prepared by <strong style="color:#f0f0f0;">${attendanceOfficer}</strong>. For corrections, contact <strong style="color:#f0f0f0;">${attendanceEmail}</strong> within 24 hours.
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