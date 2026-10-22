import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContractRenewalReminderEmail(teacherEmail, teacherName, contractType, currentContractEnd, renewalDeadline, timeUntil, yearsOfService, renewalTerms, hrOfficer, hrEmail, portalUrl, decisionRequired) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: teacherEmail,
    subject: `Contract Renewal Reminder — ${timeUntil}`,
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
                [  CONTRACT RENEWAL ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                CONTRACT<br>RENEWAL
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${teacherName},<br><br>
                Your current contract is approaching its end and renewal needs your attention <strong style="color:#d4663a;">${timeUntil}</strong>. Please review the terms below and respond.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      CONTRACT ENDS
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${currentContractEnd}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#888;">
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TYPE</td>
                  <td style="color:#f0f0f0;">${contractType}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SERVICE</td>
                  <td style="color:#f0f0f0;">${yearsOfService}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DECISION BY</td>
                  <td style="color:#f0f0f0;">${renewalDeadline}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">HR OFFICER</td>
                  <td style="color:#f0f0f0;">${hrOfficer} · ${hrEmail}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                PROPOSED TERMS
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${renewalTerms}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      A decision is required by ${renewalDeadline}. ${decisionRequired}
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
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      REVIEW CONTRACT →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Schedule a meeting with HR to discuss terms if needed. Early responses give both you and the school time to plan.
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