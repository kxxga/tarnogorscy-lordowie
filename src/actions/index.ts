import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2).max(30),
      email: z.string().email(),
      message: z.string().min(5).max(1000),
      phone: z.string().min(9).max(15)
      
    }),
    handler: async (input) => {
      const emailContent = `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Od:</strong> ${input.name} ${input.email} ${input.phone}</p>
        <p><strong>Treść wiadomości:</strong></p>
        <p style="white-space: pre-wrap;">${input.message}</p>
      `;

      const { data, error } = await resend.emails.send({
        from: "Formularz Kontaktowy <noreply@tarnogorscylordowie.pl>",
        to: ["lordowietg@gmail.com"],
        subject: "Nowa wiadomość z formularza kontaktowego",
        html: emailContent,
        replyTo: input.email,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    },
  }),
};
