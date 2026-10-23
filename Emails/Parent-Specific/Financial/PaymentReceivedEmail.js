import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PaymentReceivedEmail(parentEmail, parentName, childName, gradeLevel, stream, term, academicYear, invoiceNumber, receiptNumber, amountPaid, currency, paymentMethod, paymentReference, paidAt, previousBalance, newBalance, receivedBy, receiptUrl, bursarEmail) {
  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: parentEmail,
    subject: `Payment Received — Receipt ${receiptNumber}`,
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
                [  PAYMENT RECEIVED ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                PAYMENT<br>RECEIVED
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hello ${parentName},<br><br>
                We have received your payment for <strong style="color:#f0f0f0;">${childName}</strong>. Thank you — this email is your official receipt.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      AMOUNT RECEIVED
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:30px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${currency} ${amountPaid}
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      on ${paidAt}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RECEIPT</td>
                  <td style="color:#f0f0f0;">${receiptNumber}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">INVOICE</td>
                  <td style="color:#f0f0f0;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">CHILD</td>
                  <td style="color:#f0f0f0;">${childName} (${gradeLevel}${stream ? ` ${stream}` : ''})</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TERM</td>
                  <td style="color:#f0f0f0;">${term}, ${academicYear}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">METHOD</td>
                  <td style="color:#f0f0f0;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">REFERENCE</td>
                  <td style="color:#f0f0f0;">${paymentReference}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RECEIVED BY</td>
                  <td style="color:#f0f0f0;">${receivedBy}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:20px 24px; background-color:#111111;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">Previous balance</td>
                        <td style="font-family:'JetBrains Mono',monospace; font-size:12px; color:#888; text-align:right;">${currency} ${previousBalance}</td>
                      </tr>
                      <tr>
                        <td style="font-family:'JetBrains Mono',monospace; font-size:12px; color:#888; padding-top:8px;">Payment received</td>
                        <td style="font-family:'JetBrains Mono',monospace; font-size:12px; color:#d4663a; text-align:right; padding-top:8px;">− ${currency} ${amountPaid}</td>
                      </tr>
                      <tr>
                        <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:14px; color:#f0f0f0; padding-top:12px; border-top:1px solid #2a2a2a; letter-spacing:-0.01em;">New balance</td>
                        <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:14px; color:#f0f0f0; text-align:right; padding-top:12px; border-top:1px solid #2a2a2a; letter-spacing:-0.01em;">${currency} ${newBalance}</td>
                      </tr>
                    </table>
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
                    <a href="${receiptUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      DOWNLOAD RECEIPT →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Keep this receipt for your records. If any details are incorrect, contact the bursar at <strong style="color:#f0f0f0;">${bursarEmail}</strong> within 7 days quoting receipt <strong style="color:#f0f0f0;">${receiptNumber}</strong>.
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