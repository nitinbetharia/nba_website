<?php

/**
 * Contact Form Handler - N. Betharia & Associates
 * Professional email contact form with validation and security
 */

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set content type for AJAX response
header('Content-Type: application/json');

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
  http_response_code(405);
  echo json_encode(["status" => "error", "message" => "Method not allowed"]);
  exit;
}

// Sanitize and validate input data
function sanitizeInput($data)
{
  return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email)
{
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get and validate form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name)) {
  $errors[] = "Name is required";
}

if (empty($email)) {
  $errors[] = "Email is required";
} elseif (!validateEmail($email)) {
  $errors[] = "Invalid email format";
}

if (empty($subject)) {
  $errors[] = "Subject is required";
}

if (empty($message)) {
  $errors[] = "Message is required";
} elseif (strlen($message) < 10) {
  $errors[] = "Message must be at least 10 characters long";
}

// If there are validation errors, return them
if (!empty($errors)) {
  http_response_code(400);
  echo json_encode([
    "status" => "error",
    "message" => "Validation failed: " . implode(", ", $errors)
  ]);
  exit;
}

// Email configuration
$to = "ca.nbetharia@gmail.com"; // Primary contact email
$from = "noreply@nbetharia.com"; // From address (should be from your domain)

// Email headers
$headers = array(
  'From' => $from,
  'Reply-To' => $email,
  'X-Mailer' => 'PHP/' . phpversion(),
  'MIME-Version' => '1.0',
  'Content-Type' => 'text/html; charset=UTF-8'
);

// Email subject with company prefix
$email_subject = "NBA Contact Form: " . $subject;

// Email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #04523d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { background-color: #eee; padding: 10px; text-align: center; font-size: 12px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #04523d; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>New Contact Form Submission</h2>
        <p>N. Betharia & Associates</p>
    </div>
    
    <div class='content'>
        <div class='field'>
            <span class='label'>Name:</span><br>
            " . htmlspecialchars($name) . "
        </div>
        
        <div class='field'>
            <span class='label'>Email:</span><br>
            " . htmlspecialchars($email) . "
        </div>
        
        <div class='field'>
            <span class='label'>Subject:</span><br>
            " . htmlspecialchars($subject) . "
        </div>
        
        <div class='field'>
            <span class='label'>Message:</span><br>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
        
        <div class='field'>
            <span class='label'>Submitted:</span><br>
            " . date('Y-m-d H:i:s') . "
        </div>
        
        <div class='field'>
            <span class='label'>IP Address:</span><br>
            " . $_SERVER['REMOTE_ADDR'] . "
        </div>
    </div>
    
    <div class='footer'>
        <p>This message was sent from the contact form on the N. Betharia & Associates website.</p>
    </div>
</body>
</html>
";

// Convert headers array to string
$header_string = '';
foreach ($headers as $key => $value) {
  $header_string .= $key . ': ' . $value . "\r\n";
}

// Send email
try {
  if (mail($to, $email_subject, $email_body, $header_string)) {
    // Success response
    echo json_encode([
      "status" => "success",
      "message" => "Thank you! Your message has been sent successfully. We will get back to you soon."
    ]);
  } else {
    // Mail function failed
    throw new Exception("Mail function failed");
  }
} catch (Exception $e) {
  // Log error (in production, log to file instead of displaying)
  error_log("Contact form error: " . $e->getMessage());

  http_response_code(500);
  echo json_encode([
    "status" => "error",
    "message" => "Sorry, there was an error sending your message. Please try again later or contact us directly."
  ]);
}
