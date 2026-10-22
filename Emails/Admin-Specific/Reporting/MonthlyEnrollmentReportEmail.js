import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function MonthlyEnrollmentReportEmail(adminEmail, adminName, month, academicYear, totalStudents, newAdmissions, departures, netChange, byGrade, byGender, byBoarding, waitlist, capacityUtilization, reportUrl, registrarName, registrarEmail) {
  const gradeRows = (byGrade || []).map(g => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${g.grade}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${g.total}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a;">${g.new}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#555;">−${g.left}</td>
    </tr>`).join('');

  const isPositive = netChange >= 0;

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Monthly Enrollment — ${month} ${academicYear} (${totalStudents} students)`,
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
                [  MONTHLY ENROLLMENT ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ENROLLMENT<br>REPORT
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${month.toUpperCase()} ${academicYear.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is the monthly enrollment snapshot for the school.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      TOTAL ENROLLED
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:36px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${totalStudents}
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:${isPositive ? '#d4663a' : '#888'};">
                      ${isPositive ? '+' : ''}${netChange} this month · ${newAdmissions} new · ${departures} departed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${gradeRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY GRADE
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom:4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">GRADE</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">TOTAL</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">NEW</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">LEFT</td>
                </tr>
                ${gradeRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                DEMOGRAPHICS
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">GENDER</td>
                  <td style="color:#f0f0f0;">${byGender}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">BOARDING</td>
                  <td style="color:#f0f0f0;">${byBoarding}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CAPACITY</td>
                  <td style="color:#f0f0f0;">${capacityUtilization}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">WAITLIST</td>
                  <td style="color:#f0f0f0;">${waitlist}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      ${capacityUtilization.includes('9') || capacityUtilization.includes('100') ? 'Enrollment is at or near capacity — coordinate with admissions on waitlist policy.' : 'Enrollment is within capacity. Continue monitoring month-over-month trends.'}
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
                Prepared by the registrar <strong style="color:#f0f0f0;">${registrarName}</strong>. Queries: <strong style="color:#f0f0f0;">${registrarEmail}</strong>.
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