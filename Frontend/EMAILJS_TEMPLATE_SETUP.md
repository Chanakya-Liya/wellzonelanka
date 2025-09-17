# EmailJS Template Setup Guide

## Current Issue
You're getting "Invalid template or service configuration" error. This means the EmailJS template structure doesn't match the parameters being sent.

## Step-by-Step Fix

### 1. Go to EmailJS Dashboard
- Visit [EmailJS.com](https://www.emailjs.com/)
- Log in to your account
- Go to "Email Templates"

### 2. Edit Your Template (template_ake4niy)
Click on your existing template and replace the content with this exact structure:

**Subject Line:**
```
New Contact Form - {{subject}}
```

**Email Body:**
```
Hello WellZone Lanka Team,

You have received a new message from your website contact form:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
Please reply to: {{reply_to}}

This message was sent from the WellZone Lanka contact form.
Best regards,
WellZone Lanka Website
```

### 3. Template Settings
- **Template Name**: Contact Form Submission
- **Template ID**: template_ake4niy (keep existing)
- **To Email**: Make sure this is set to your email (thevinu2005@gmail.com)

### 4. Variable Mapping
Make sure these variables are properly mapped in your template:
- `{{from_name}}` - Contact person's full name
- `{{from_email}}` - Contact person's email
- `{{phone}}` - Contact person's phone number
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_name}}` - Your business name
- `{{to_email}}` - Your business email
- `{{reply_to}}` - Contact person's email for replies

### 5. Test Template
1. In EmailJS dashboard, click "Test Template"
2. Fill in sample data for all variables
3. Send test email to verify it works

### 6. Service Configuration
Make sure your email service (service_zoxf3sq) is:
- Properly connected to your Gmail account
- Has the correct "From Name" set
- Has proper authentication

### 7. Alternative: Create New Template
If the above doesn't work, create a completely new template:

1. Go to "Email Templates" → "Create New Template"
2. Use the template content above
3. Save and get the new template ID
4. Update your .env.local file with the new template ID

## Common Issues & Solutions

**400 Error - Invalid Configuration:**
- Template variables don't match
- Service not properly configured
- Authentication issues

**401 Error - Unauthorized:**
- Invalid public key
- Service not connected to email account

**403 Error - Forbidden:**
- Email service quota exceeded
- Account not verified

**404 Error - Not Found:**
- Wrong service ID or template ID
- Template deleted

## Debug Steps
1. Check console logs for the exact parameters being sent
2. Verify all IDs match your EmailJS dashboard
3. Test template independently in EmailJS dashboard
4. Check email service connection status

## Current Configuration
- Service ID: service_zoxf3sq
- Template ID: template_ake4niy
- Public Key: Xsp1gQRGxnYEATnWB

Make sure these match exactly in your EmailJS dashboard.