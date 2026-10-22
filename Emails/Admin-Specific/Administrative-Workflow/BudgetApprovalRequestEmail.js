import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function BudgetApprovalRequestEmail(approverEmail, approverName, budgetId, department, period, submittedBy, submittedByRole, submittedAt, totalAmount, currency, categories, justification, previousPeriodAmount, variance, attachments, priority, approvalUrl, approvalDeadline, financeDirectorEmail) {
  const categoryRows = (categories || []).map(c => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px;">
        <span style="color:#f0f0f0; display:block; margin-bottom:2px;">${c.name}</span>
        <span style="color:#888; font-size:11px;">${c.note || ''}</span>
      </td>
      <td style="padding:10px 0; border-bottom:1px solid #1a1a1a; text-align:right; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f0f0f0; white-space:nowrap; vertical-align:top;">
        ${currency} ${c.amount}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: approverEmail,
    subject: `[${priority ? priority.toUpperCase() : 'STANDARD'}] Budget Approval — ${department} (${period})`,
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
                [  BUDGET APPROVAL ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:32px; line-height:1; color:#f0f0f0; letter-spacing:-0.02em;">
                BUDGET<br>REQUEST
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${approverName}, a budget request from <strong style="color:#f0f0f0;">${department}</strong> requires your approval.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#111111; border:1px dashed #d4663a; padding:20px 16px;">
                    <p style="margin:0 0 4px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#d4663a;">
                      TOTAL REQUESTED
                    </p>
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:30px; font-weight:900; color:#f0f0f0; letter-spacing:-0.01em;">
                      ${currency} ${totalAmount}
                    </span>
                    <p style="margin:8px 0 0; font-family:'JetBrains Mono',monospace; font-size:11px; color:#888;">
                      ${variance}
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
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">BUDGET ID</td>
                  <td style="color:#f0f0f0;">${budgetId}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">PERIOD</td>
                  <td style="color:#f0f0f0;">${period}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SUBMITTED BY</td>
                  <td style="color:#f0f0f0;">${submittedBy} · ${submittedByRole}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">SUBMITTED</td>
                  <td style="color:#f0f0f0;">${submittedAt}</td>
                </tr>
                <tr>
                  <td style="color:#d4663a; padding-right:16px; vertical-align:top;">APPROVE BY</td>
                  <td style="color:#f0f0f0;">${approvalDeadline}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${categoryRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                BREAKDOWN
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${categoryRows}
              </table>
            </td>
          </tr>` : ''}

          ${justification ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                JUSTIFICATION
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${justification}
              </p>
            </td>
          </tr>` : ''}

          ${attachments ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ATTACHMENTS
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${attachments}
              </p>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#111111; border-left:3px solid #d4663a; padding:16px 20px;">
                    <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#d4663a;">
                      Requests exceeding KES 500,000 require additional sign-off by the Finance Director (${financeDirectorEmail}).
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
                    <a href="${approvalUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      REVIEW BUDGET →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Approve or reject through the portal so the requester is notified automatically. Delayed approval pushes the department's spending into the next period.
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