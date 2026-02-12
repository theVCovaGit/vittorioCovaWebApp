import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "studio@vittoriocova.com";
const FROM_EMAIL = process.env.RESEND_FROM ?? "Art Inquiries <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND;
    if (!apiKey) {
      console.error("Art inquiry: RESEND API key is not set");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }
    const resend = new Resend(apiKey);

    const body = await req.json();
    const { name, email, phone, comments, artpiece } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const subject = `art inquiry ${name}`;
    const contact = [email, phone].filter(Boolean).join(" or ");
    let text = `Hey Vittorio!\n\n${name} wants to know more about ${artpiece ?? "an artwork"} please reach out at ${contact}`;
    if (comments?.trim()) {
      text += `\n\nComments:\n${comments.trim()}`;
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
  } catch (err) {
    console.error("Art inquiry error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
