import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeaveDecisionEmail(teacherEmail, teacherName, approved, leaveType, startDate, endDate, days, referenceId, decidedBy, decidedAt, reason, returnDate, substituteAssigned, appealDeadline, portalUrl) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: teacherEmail,
    subject: approved ? `Leave Approved — ${startDate} to ${endDate}` : `Leave Request Declined — ${referenceId}`,
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
                [  LEAVE DECISION ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${approved ? 'LEAVE<br>APPROVED' : 'LEAVE<br>DECLINED'}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${teacherName},<br><br>
                ${approved
                  ? `Your leave request has been approved. Details of your leave and what happens on your return are below.`
                  : `Your leave request has been reviewed and could not be approved at this time. The reason and next steps are below.`}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed ${approved ? '#d4663a' : '#2a2a2a'}; padding:20px 16px;">
                    <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:${approved ? '#d4663a' : '#555'};">
                      STATUS: ${approved ? 'APPROVED' : 'DECLINED'}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REFERENCE</td>
                  <td style="color:#f0f0f0;">${referenceId}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TYPE</td>
                  <td style="color:#f0f0f0;">${leaveType}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PERIOD</td>
                  <td style="color:#f0f0f0;">${startDate} → ${endDate}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DAYS</td>
                  <td style="color:#f0f0f0;">${days}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DECIDED BY</td>
                  <td style="color:#f0f0f0;">${decidedBy} · ${decidedAt}</td>
                </tr>
                ${approved && returnDate ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RETURN ON</td>
                  <td style="color:#f0f0f0;">${returnDate}</td>
                </tr>` : ''}
                ${approved && substituteAssigned ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">COVER</td>
                  <td style="color:#f0f0f0;">${substituteAssigned}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          ${reason ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${approved ? 'NOTES' : 'REASON FOR DECISION'}
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${reason}
              </p>
            </td>
          </tr>` : ''}

          ${!approved && appealDeadline ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      If you wish to appeal, submit an appeal through the staff portal by ${appealDeadline}.
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
                    <a href="${portalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      VIEW LEAVE RECORD →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                ${approved
                  ? 'Prepare handover notes for your classes before your leave begins. Ensure your substitute has access to lesson plans and gradebooks.'
                  : 'You may continue teaching as normal during the requested period. Contact HR if you have questions about the decision.'}
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