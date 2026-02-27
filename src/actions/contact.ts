'use server';
// T069 — Server Action contact form

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContact(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Save to DB
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('contacts') as any).insert({ name, email, message });
  if (error) throw new Error(error.message);

  // Send notification email
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) return;

  const { error: emailError } = await resend.emails.send({
    from: 'Proxiwave <contact@proxiwave.com>',
    to,
    replyTo: email,
    subject: `Nouveau message de ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#111;margin-bottom:16px">Nouveau message via proxiwave.com</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr>
            <td style="padding:8px 0;color:#666;width:80px;vertical-align:top">Nom</td>
            <td style="padding:8px 0;font-weight:600">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;vertical-align:top">Email</td>
            <td style="padding:8px 0"><a href="mailto:${email}" style="color:#7c5cfc">${email}</a></td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 16px"/>
        <p style="color:#333;line-height:1.6;white-space:pre-wrap;margin:0">${message}</p>
      </div>
    `,
  });

  if (emailError) {
    console.error('[Resend] Erreur envoi email:', emailError);
    // On ne throw pas — le message est quand même enregistré en DB
  }
}
