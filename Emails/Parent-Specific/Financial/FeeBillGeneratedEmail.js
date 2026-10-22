import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function FeeBillGeneratedEmail(parentEmail, parentName, childName, gradeLevel, stream, term, academicYear, invoiceNumber, lineItems, totalAmount, currency, dueDate, paymentMethods, portalUrl, bursarEmail) {
  const lineRows = lineItems.map(item => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#f0f0f0; display:block; margin-bottom:2px;">${item.description}</span>
        <span style="color:#888; font-size:11px;">${item.note || ''}</span>
      </td>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap; vertical-align:top;">
        ${currency} ${item.amount}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `Fee Bill — ${childName} (${term}, ${academicYear})`,
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
                [  FEE BILL ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                FEE<br>BILL
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${parentName},<br><br>
                The fee bill for <strong style="color:#f0f0f0;">${childName}</strong> (${gradeLevel}${stream ? ` ${stream}` : ''}) for <strong style="color:#f0f0f0;">${term}, ${academicYear}</strong> is now available. Please review the breakdown below and settle by the due date.
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
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">INVOICE</td>
                        <td style="color:#f0f0f0;">${invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TERM</td>
                        <td style="color:#f0f0f0;">${term}, ${academicYear}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">DUE BY</td>
                        <td style="color:#f0f0f0;">${dueDate}</td>
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
                BREAKDOWN
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#f0f0f0; display:block; margin-bottom:2px;">${item.description}</span>
        <span style="color:#888; font-size:11px;">${item.note || ''}</span>
      </td>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap; vertical-align:top;">
        ${currency} ${item.amount}
      </td>
    </tr>
                <tr>
                  <td style="padding:14px 0 0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:16px; color:#f0f0f0; letter-spacing:-0.01em;">
                    TOTAL DUE
                  </td>
                  <td style="padding:14px 0 0; text-align:right; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:16px; color:#d4663a; letter-spacing:-0.01em; white-space:nowrap;">
                    ${currency} ${totalAmount}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                PAYMENT METHODS
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${paymentMethods}
              </p>
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
                      VIEW & PAY BILL →
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
                      If fees remain unpaid after the due date, a late payment surcharge may apply. Contact the bursar's office if you need to arrange a payment plan.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Questions about this bill? Contact the bursar at <strong style="color:#f0f0f0;">${bursarEmail}</strong> quoting invoice number <strong style="color:#f0f0f0;">${invoiceNumber}</strong>.
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