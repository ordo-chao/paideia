import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GraduationProgressEmail(studentEmail, studentName, program, unitsCompleted, unitsRequired, coreCompleted, coreRequired, electivesCompleted, electivesRequired, expectedGraduation, progressUrl) {
  const pct = Math.min(100, Math.round((unitsCompleted / unitsRequired) * 100));

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: studentEmail,
    subject: `Graduation Progress Update — ${pct}% Complete`,
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
                [  GRADUATION PROGRESS ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                GRADUATION<br>PROGRESS
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${studentName},<br><br>
                Here is a snapshot of your progress toward the <strong style="color:#f0f0f0;">${program}</strong> degree.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:24px; background-color:#111111;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      OVERALL PROGRESS
                    </p>
                    <p style="margin:0 0 16px; font-family:'Helvetica Neue',Arial,sans-serif; font-size:36px; font-weight:900; color:#f0f0f0; letter-spacing:-0.02em;">
                      ${pct}%
                    </p>
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#2a2a2a;">
                      <tr>
                        <td style="height:4px; background-color:#d4663a; width:${pct}%;"></td>
                        <td style="height:4px;"></td>
                      </tr>
                    </table>
                    <p style="margin:12px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${unitsCompleted} of ${unitsRequired} units completed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:0 8px 0 0; width:50%; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:16px; background-color:#111111;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                            CORE
                          </p>
                          <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:14px; color:#f0f0f0;">
                            ${coreCompleted}<span style="color:#555;">/${coreRequired}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding:0 0 0 8px; width:50%; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:16px; background-color:#111111;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                            ELECTIVES
                          </p>
                          <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:14px; color:#f0f0f0;">
                            ${electivesCompleted}<span style="color:#555;">/${electivesRequired}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">EXPECTED</td>
                  <td style="color:#f0f0f0;">${expectedGraduation}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${progressUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      VIEW FULL PROGRESS →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Confirm your remaining requirements with your academic advisor each semester to stay on track for graduation.
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