import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function TransportDelayIncidentEmail(parentEmail, parentName, childName, gradeLevel, stream, routeName, busNumber, driverName, driverPhone, supervisorName, supervisorPhone, type, delayMinutes, reason, currentLocation, expectedArrival, stopName, alternativeArrangement, hotlinePhone, portalUrl) {
  const isIncident = type === 'incident';

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: isIncident ? `Transport Incident — Bus ${busNumber} (${routeName})` : `Transport Delay — Bus ${busNumber} (~${delayMinutes} min)`,
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
                [  TRANSPORT ${isIncident ? 'INCIDENT' : 'DELAY'} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${isIncident ? 'TRANSPORT<br>INCIDENT' : 'TRANSPORT<br>DELAY'}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${parentName},<br><br>
                ${isIncident
                  ? `We are writing to inform you of an incident affecting <strong style="color:#f0f0f0;">${childName}</strong>'s school transport route. All students are safe and accounted for.`
                  : `The school transport carrying <strong style="color:#f0f0f0;">${childName}</strong> is currently delayed by approximately <strong style="color:#d4663a;">${delayMinutes} minutes</strong>.`}
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
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ROUTE</td>
                        <td style="color:#f0f0f0;">${routeName}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">BUS</td>
                        <td style="color:#f0f0f0;">${busNumber}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DRIVER</td>
                        <td style="color:#f0f0f0;">${driverName} · ${driverPhone}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SUPERVISOR</td>
                        <td style="color:#f0f0f0;">${supervisorName} · ${supervisorPhone}</td>
                      </tr>
                      ${currentLocation ? `
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">NOW AT</td>
                        <td style="color:#f0f0f0;">${currentLocation}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">EXPECTED ARRIVAL</td>
                        <td style="color:#f0f0f0;">${expectedArrival} · ${stopName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${isIncident ? 'WHAT HAPPENED' : 'REASON FOR DELAY'}
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${reason}
              </p>
            </td>
          </tr>

          ${alternativeArrangement ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      ${alternativeArrangement}
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
                      TRACK LIVE →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                For urgent queries, call the transport hotline on <strong style="color:#f0f0f0;">${hotlinePhone}</strong>. Please do not call the driver directly while the bus is in motion.
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