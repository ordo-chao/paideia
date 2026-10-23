import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function StaffAttendanceReportEmail(adminEmail, adminName, periodStart, periodEnd, totalStaff, presentDays, absentDays, lateDays, leaveDays, attendanceRate, byDepartment, byStaff, chronicAbsentees, reportUrl, hrManagerName, hrEmail) {
  const deptRows = (byDepartment || []).map(d => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${d.department}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${d.staff}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:${parseInt(d.rate) < 90 ? '#d4663a' : '#888'};">${d.rate}%</td>
    </tr>`).join('');

  const staffRows = (byStaff || []).map(s => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">
        ${s.name}<br>
        <span style="color:#888; font-size:11px;">${s.role}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap;">
        ${s.present} / ${s.absent} / ${s.late}
      </td>
    </tr>`).join('');

  const chronicRows = (chronicAbsentees || []).map(c => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a;">
        ${c.name}<br>
        <span style="color:#888; font-size:11px;">${c.role}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a; white-space:nowrap;">
        ${c.days} days
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Staff Attendance Report — ${periodStart} to ${periodEnd} (${attendanceRate}%)`,
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
                [  STAFF ATTENDANCE ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                STAFF<br>ATTENDANCE
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${periodStart.toUpperCase()} → ${periodEnd.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is the staff attendance summary for the reporting period.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      STAFF ATTENDANCE RATE
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:36px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${attendanceRate}%
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${totalStaff} staff · ${presentDays} present · ${absentDays} absent · ${lateDays} late · ${leaveDays} on leave
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${deptRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY DEPARTMENT
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom:4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">DEPT</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">STAFF</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">RATE</td>
                </tr>
                    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${d.department}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${d.staff}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:${parseInt(d.rate) < 90 ? '#d4663a' : '#888'};">${d.rate}%</td>
    </tr>
              </table>
            </td>
          </tr>` : ''}

          ${staffRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                INDIVIDUAL SUMMARY (P/A/L)
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${staffRows}
              </table>
            </td>
          </tr>` : ''}

          ${chronicRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                CHRONIC ABSENTEES (3+ DAYS)
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${chronicRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      Staff attending less than 90% in the period should have a documented conversation with their supervisor.
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
                Prepared by <strong style="color:#f0f0f0;">${hrManagerName}</strong>. Queries: <strong style="color:#f0f0f0;">${hrEmail}</strong>.
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