import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function ExamResultsSummaryEmail(adminEmail, adminName, examSession, term, academicYear, totalStudents, totalPassed, passRate, averageScore, bySubject, byGrade, topPerformers, subjectsBelowTarget, reportedBy, reportedAt, reportUrl, academicsEmail) {
  const subjectRows = (bySubject || []).map(s => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${s.subject}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${s.average}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:${s.passRate < 70 ? '#d4663a' : '#888'};">${s.passRate}%</td>
    </tr>`).join('');

  const gradeRows = (byGrade || []).map(g => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${g.grade}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${g.count}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${g.percentage}%</td>
    </tr>`).join('');

  const performerRows = (topPerformers || []).map(p => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">
        ${p.name}<br>
        <span style="color:#888; font-size:11px;">${p.class}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a; white-space:nowrap;">
        ${p.score}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Exam Results Summary — ${examSession} (${passRate}% pass rate)`,
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
                [  EXAM RESULTS SUMMARY ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                RESULTS<br>SUMMARY
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${examSession.toUpperCase()} · ${term.toUpperCase()} ${academicYear.toUpperCase()} · REPORTED ${reportedAt.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is the aggregate performance summary.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      OVERALL PASS RATE
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:36px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${passRate}%
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${totalPassed} of ${totalStudents} passed · average ${averageScore}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${subjectRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY SUBJECT
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom:4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">SUBJECT</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">AVG</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">PASS</td>
                </tr>
                    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${s.subject}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${s.average}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:${s.passRate < 70 ? '#d4663a' : '#888'};">${s.passRate}%</td>
    </tr>
              </table>
            </td>
          </tr>` : ''}

          ${gradeRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                GRADE DISTRIBUTION
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom:4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">GRADE</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">COUNT</td>
                  <td style="padding-bottom:4px; text-align:right; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#555;">PCT</td>
                </tr>
                ${gradeRows}
              </table>
            </td>
          </tr>` : ''}

          ${performerRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                TOP PERFORMERS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${performerRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      Subjects below 70% pass rate: ${subjectsBelowTarget || 'none'}. Recommend department review for any flagged subjects before next term.
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
                Prepared by <strong style="color:#f0f0f0;">${reportedBy}</strong>. Queries: <strong style="color:#f0f0f0;">${academicsEmail}</strong>.
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