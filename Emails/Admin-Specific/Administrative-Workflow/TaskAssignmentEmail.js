import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function TaskAssignmentEmail(assigneeEmail, assigneeName, taskId, taskTitle, taskDescription, priority, assignedBy, assignedByRole, assignedAt, dueDate, dueTime, category, relatedTo, checklist, attachments, estimatedEffort, taskUrl, contactPerson, contactEmail) {
  const checklistRows = (checklist || []).map((c, i) => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #1a1a1a; font-family:'JetBrains Mono',monospace; font-size:12px; color:#888;">
        <span style="color:#d4663a; display:inline-block; min-width:20px;">○</span> ${c}
      </td>
    </tr>`).join('');

  return await resend.emails.send({
    from: 'onboarding@ordochao.tech',
    to: assigneeEmail,
    subject: `[${priority ? priority.toUpperCase() : 'TASK'}] ${taskTitle}`,
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
                [  TASK ASSIGNED · ${priority ? priority.toUpperCase() : 'STANDARD'} ]
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <h1 style="margin:0; font-family:'Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:28px; line-height:1.1; color:#f0f0f0; letter-spacing:-0.02em;">
                ${taskTitle}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0 28px;">
              <p style="margin:0; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                ${category ? category.toUpperCase() + ' · ' : ''}DUE ${dueDate.toUpperCase()} ${dueTime ? '· ' + dueTime : ''}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                Hi ${assigneeName}, ${assignedBy} has assigned you the following task.
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
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">TASK ID</td>
                        <td style="color:#f0f0f0;">${taskId}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ASSIGNED BY</td>
                        <td style="color:#f0f0f0;">${assignedBy} · ${assignedByRole}</td>
                      </tr>
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">ASSIGNED AT</td>
                        <td style="color:#f0f0f0;">${assignedAt}</td>
                      </tr>
                      ${relatedTo ? `
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">RELATED TO</td>
                        <td style="color:#f0f0f0;">${relatedTo}</td>
                      </tr>` : ''}
                      ${estimatedEffort ? `
                      <tr>
                        <td style="color:#d4663a; padding-right:16px; vertical-align:top;">EFFORT</td>
                        <td style="color:#f0f0f0;">${estimatedEffort}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                DESCRIPTION
              </p>
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#888;">
                ${taskDescription}
              </p>
            </td>
          </tr>

          ${checklistRows ? `
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0 0 8px; font-family:'Courier New',monospace; font-size:10px; letter-spacing:2px; color:#555;">
                CHECKLIST
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${checklistRows}
              </table>
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
            <td style="padding:32px 28px 0 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f0f0f0; border:1px solid #f0f0f0;">
                    <a href="${taskUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:bold; letter-spacing:1px; color:#0a0a0a; text-decoration:none;">
                      OPEN TASK →
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
                      Mark the task complete in the portal when finished. If you cannot complete by ${dueDate}, notify ${contactPerson} before the deadline.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 0 28px;">
              <p style="margin:0; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:#666;">
                Questions about this task? Reply to ${contactPerson} at <strong style="color:#f0f0f0;">${contactEmail}</strong>. All task activity is tracked in the audit log.
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