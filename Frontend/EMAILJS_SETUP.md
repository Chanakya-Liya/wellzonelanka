# EmailJS Setup Instructions for WellZone Lanka Contact Form

## Overview
This contact form uses EmailJS to send emails directly from the client-side without requiring a backend server.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

**Template Name**: `contact_form`

**Subject**: `New Contact Form Submission - {{subject}}`

**Content**:
```
Hello,

You have received a new message from your WellZone Lanka contact form:

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the WellZone Lanka website contact form.
```

4. Note down the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to "Account" settings in your EmailJS dashboard
2. Find your **Public Key** (e.g., `your_public_key_here`)

### 5. Update Configuration
Replace the placeholder values in `app/contact/page.tsx`:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Replace with your Public Key
```

### 6. Test the Contact Form
1. Fill out the contact form on your website
2. Submit the form
3. Check your email for the message
4. Verify all form fields are included correctly

## Template Variables
The following variables are sent to EmailJS:
- `{{from_name}}` - First name + Last name
- `{{from_email}}` - User's email address
- `{{phone}}` - User's phone number
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_email}}` - Your business email (wellzonelanka@gmail.com)

## Security Notes
- EmailJS public key is safe to expose in client-side code
- EmailJS has built-in rate limiting to prevent spam
- Consider enabling reCAPTCHA in EmailJS settings for additional protection

## Troubleshooting
- Make sure all IDs are correctly copied from EmailJS dashboard
- Check browser console for error messages
- Verify email service is properly connected in EmailJS
- Test template in EmailJS dashboard first

## Alternative Setup (Environment Variables)
For better security, you can also store these values as environment variables:

Create `.env.local`:
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Then update the code to use:
```typescript
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
```