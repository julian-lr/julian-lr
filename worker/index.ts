interface Env {
  RESEND_API_KEY: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  })
}

// Handles POST /api/contact submissions using the Resend API
async function handleContact(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData()

    const name = formData.get('name')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const phone = formData.get('phone')?.toString().trim() || ''
    const subject = formData.get('subject')?.toString().trim() || ''
    const message = formData.get('message')?.toString().trim() || ''

    if (!name || !email || !subject || !message) {
      return jsonResponse(
        { success: false, message: 'Name, email, subject, and message are required.' },
        400
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return jsonResponse({ success: false, message: 'Please enter a valid email address.' }, 400)
    }

    const resendApiKey = env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable not set')
      return jsonResponse(
        { success: false, message: 'Server configuration error. Please try again later.' },
        500
      )
    }

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Sent from julianlr.com contact form</em></p>
    `

    const emailText = `
New Contact Form Submission

From: ${name} (${email})
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}

---
Sent from julianlr.com contact form
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@julianlr.com',
        to: ['hi@julianlr.com'],
        reply_to: email,
        subject: `Contact Form: ${subject}`,
        html: emailHtml,
        text: emailText,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      return jsonResponse(
        { success: false, message: 'Failed to send email. Please try again later.' },
        500
      )
    }

    return jsonResponse(
      { success: true, message: "Thank you for your message! I'll get back to you soon." },
      200
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return jsonResponse(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
      500
    )
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/contact') {
      if (request.method === 'POST') return handleContact(request, env)
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: CORS_HEADERS })
      }
    }

    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>
