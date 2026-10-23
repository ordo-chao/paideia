import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSportsTeamSelectionEmail(studentEmail, studentName, sport, teamName, selected, trialDate, trialNotes, coachName, coachEmail, nextStepDate, nextStepInfo) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: studentEmail,
    subject: selected ? `You've Been Selected — ${teamName}` : `Team Selection Result — ${sport}`,
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
                [  TEAM SELECTION ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${selected ? 'YOU ARE<br>SELECTED' : 'TEAM<br>SELECTION'}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${studentName},<br><br>
                ${selected
                  ? `Congratulations! You have been selected to join the <strong style="color:#f0f0f0;">${teamName}</strong> for the upcoming season.`
                  : `Thank you for attending the <strong style="color:#f0f0f0;">${sport}</strong> trials. Unfortunately, you were not selected this time.`}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed ${selected ? '#d4663a' : '#2a2a2a'}; padding:20px 16px;">
                    <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:${selected ? '#d4663a' : '#555'};">
                      ${selected ? 'STATUS: SELECTED' : 'STATUS: NOT SELECTED'}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SPORT</td>
                  <td style="color:#f0f0f0;">${sport}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TEAM</td>
                  <td style="color:#f0f0f0;">${teamName}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TRIAL DATE</td>
                  <td style="color:#f0f0f0;">${trialDate}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">COACH</td>
                  <td style="color:#f0f0f0;">${coachName} · ${coachEmail}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${trialNotes ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                COACH'S NOTES
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${trialNotes}
              </p>
            </td>
          </tr>` : ''}

          ${selected ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0 0 6px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      NEXT STEP — ${nextStepDate}
                    </p>
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#888;">
                      ${nextStepInfo}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                We appreciate your effort. Keep training and consider joining upcoming sessions — we'll continue to watch your development.
              </p>
            </td>
          </tr>`}

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