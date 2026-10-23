import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function WeeklyFeeCollectionEmail(adminEmail, adminName, weekStart, weekEnd, currency, totalBilled, totalCollected, collectionRate, outstanding, byMethod, byClass, topDebtors, newInvoices, paymentCount, reportUrl, bursarName, bursarEmail) {
  const methodRows = (byMethod || []).map(m => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${m.method}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">${m.count}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap;">${currency} ${m.amount}</td>
    </tr>`).join('');

  const classRows = (byClass || []).map(c => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">${c.class}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap;">${currency} ${c.collected}</td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a; white-space:nowrap;">${currency} ${c.outstanding}</td>
    </tr>`).join('');

  const debtorRows = (topDebtors || []).map(d => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0;">
        ${d.name}<br>
        <span style="color:#888; font-size:11px;">${d.class}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a; white-space:nowrap;">
        ${currency} ${d.outstanding}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: adminEmail,
    subject: `Weekly Fee Collection — ${weekStart} to ${weekEnd} (${collectionRate}%)`,
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
                [  WEEKLY FEE REPORT ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                COLLECTION<br>REPORT
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${weekStart.toUpperCase()} → ${weekEnd.toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${adminName}, here is the weekly fee collection summary.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      COLLECTED THIS WEEK
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:28px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${currency} ${totalCollected}
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${paymentCount} payments · ${collectionRate}% of billed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:50%; padding-right:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#888;">BILLED</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:16px; font-weight:900; color:#f0f0f0;">${currency} ${totalBilled}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:50%; padding-left:6px; vertical-align:top;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #d4663a;">
                      <tr>
                        <td style="padding:14px; background-color:#111111; text-align:center;">
                          <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:9px; letter-spacing:1px; color:#d4663a;">OUTSTANDING</p>
                          <p style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:16px; font-weight:900; color:#d4663a;">${currency} ${outstanding}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${methodRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY METHOD
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${methodRows}
              </table>
            </td>
          </tr>` : ''}

          ${classRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BY CLASS
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${classRows}
              </table>
            </td>
          </tr>` : ''}

          ${debtorRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                TOP OUTSTANDING BALANCES
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${debtorRows}
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      ${newInvoices} new invoices were issued this week. ${collectionRate < 70 ? 'Collection rate is below 70% — escalate to bursar for follow-up.' : 'Collection is on track for the week.'}
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
                Prepared by <strong style="color:#f0f0f0;">${bursarName}</strong>. Queries: <strong style="color:#f0f0f0;">${bursarEmail}</strong>.
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