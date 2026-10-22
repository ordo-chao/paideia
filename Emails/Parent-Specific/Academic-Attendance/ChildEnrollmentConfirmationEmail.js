import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function ChildEnrollmentConfirmationEmail(parentEmail, parentName, childName, admissionNumber, gradeLevel, stream, subjects, term, academicYear, reportingDate, portalUrl) {
  const subjectRows = subjects.map(s => `
    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">›</span> ${s}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `Enrollment Confirmed — ${childName} (${gradeLevel})`,
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
                [  CHILD ENROLLMENT ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ENROLLMENT<br>CONFIRMED
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${parentName},<br><br>
                <strong style="color:#f0f0f0;">${childName}</strong> has been enrolled for <strong style="color:#f0f0f0;">${term}, ${academicYear}</strong>. Please review the details below and save this email for your records.
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
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CHILD</td>
                        <td style="color:#f0f0f0;">${childName}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ADM NO</td>
                        <td style="color:#f0f0f0;">${admissionNumber}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">GRADE</td>
                        <td style="color:#f0f0f0;">${gradeLevel}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">STREAM</td>
                        <td style="color:#f0f0f0;">${stream || 'Not assigned'}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TERM</td>
                        <td style="color:#f0f0f0;">${term}, ${academicYear}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REPORTING</td>
                        <td style="color:#f0f0f0;">${reportingDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${subjectRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                REGISTERED SUBJECTS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
      <td style="padding:6px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a;">›</span> ${s}
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
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      OPEN PARENT PORTAL →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Contact the admissions office if any of these details are incorrect. The parent portal gives you access to your child's timetable, grades, attendance records, and school notices.
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