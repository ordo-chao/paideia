import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendStudentCouncilElectionEmail(studentEmail, studentName, electionTitle, votingOpens, votingCloses, candidates, votingUrl, voterId, resultsAnnouncementDate) {
  const candidateRows = (candidates || []).map(c => `
    <tr>
      <td style="padding:14px 0; border-bottom:1px solid #1a1a1a;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:'JetBrains Mono',monospace; font-size:12px;">
          <tr>
            <td style="color:#f0f0f0; padding-bottom:4px;">
              <span style="color:#d4663a;">${c.position}</span>
            </td>
          </tr>
          <tr>
            <td style="color:#f0f0f0; font-size:13px; padding-bottom:2px;">${c.name}</td>
          </tr>
          <tr>
            <td style="color:#888; font-size:11px; line-height:1.6;">${c.manifestoSummary}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: studentEmail,
    subject: `Vote Now — ${electionTitle}`,
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
                [  STUDENT COUNCIL ELECTION ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                CAST YOUR<br>VOTE
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${studentName},<br><br>
                The <strong style="color:#f0f0f0;">${electionTitle}</strong> is now open. Your vote determines who represents you on the Student Council for the coming year.
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
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">OPENS</td>
                        <td style="color:#f0f0f0;">${votingOpens}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CLOSES</td>
                        <td style="color:#f0f0f0;">${votingCloses}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">VOTER ID</td>
                        <td style="color:#f0f0f0;">${voterId}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RESULTS ON</td>
                        <td style="color:#f0f0f0;">${resultsAnnouncementDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${candidateRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                CANDIDATES
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${candidateRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${votingUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      VOTE NOW →
                    </a>
                  </td>
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
                      Each student may vote once. Your voter ID is personal — do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Voting closes at the time shown above. Results will be announced on ${resultsAnnouncementDate}. If you have trouble accessing the ballot, contact the electoral committee before the deadline.
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