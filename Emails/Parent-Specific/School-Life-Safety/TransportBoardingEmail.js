import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function TransportBoardingEmail(parentEmail, parentName, childName, gradeLevel, stream, event, date, time, routeName, busNumber, stopName, supervisorName, supervisorPhone, driverName, expectedArrival, parentPickupName, portalUrl) {
  const isBoarding = event === 'boarded';
  const isDrop = event === 'dropped';

  const title = isBoarding
    ? 'BOARDED<br>SAFELY'
    : isDrop
      ? 'DROPPED<br>SAFELY'
      : 'LEFT<br>SCHOOL';

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `${childName} ${isBoarding ? 'boarded' : isDrop ? 'was dropped off' : 'left school'} — ${time}`,
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
                [  TRANSPORT UPDATE ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${title}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${parentName},<br><br>
                This is a quick confirmation that <strong style="color:#f0f0f0;">${childName}</strong> (${gradeLevel}${stream ? ` ${stream}` : ''}) ${isBoarding ? 'has boarded the school bus safely' : isDrop ? 'has been dropped off safely' : 'has left school on transport'}.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      ${isBoarding ? 'BOARDED AT' : isDrop ? 'DROPPED AT' : 'LEFT AT'}
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${time}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DATE</td>
                  <td style="color:#f0f0f0;">${date}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ROUTE</td>
                  <td style="color:#f0f0f0;">${routeName}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">BUS</td>
                  <td style="color:#f0f0f0;">${busNumber}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">STOP</td>
                  <td style="color:#f0f0f0;">${stopName}</td>
                </tr>
                ${driverName ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DRIVER</td>
                  <td style="color:#f0f0f0;">${driverName}</td>
                </tr>` : ''}
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SUPERVISOR</td>
                  <td style="color:#f0f0f0;">${supervisorName} · ${supervisorPhone}</td>
                </tr>
                ${expectedArrival && isBoarding ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ARRIVAL</td>
                  <td style="color:#f0f0f0;">${expectedArrival}</td>
                </tr>` : ''}
                ${parentPickupName && isDrop ? `
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PICKED BY</td>
                  <td style="color:#f0f0f0;">${parentPickupName}</td>
                </tr>` : ''}
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
                      VIEW TRANSPORT LOG →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                ${isBoarding
                  ? 'You will receive another confirmation when your child is dropped off. Reply to this email if a different adult will collect your child today.'
                  : isDrop
                    ? 'This confirms that your child was handed over safely. If the named person does not match your expectation, call the transport hotline immediately.'
                    : 'If your child is expected home and this does not match, contact the transport office.'}
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