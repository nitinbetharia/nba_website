<?php

/**
 * Newsletter Subscription Handler
 * Simple newsletter subscription form handler
 */

// Email address to receive newsletter subscriptions
$receiving_email_address = 'nitinbetharia@gmail.com';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])) {

  // Get and sanitize email
  $subscriber_email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

  // Validate email
  if (!filter_var($subscriber_email, FILTER_VALIDATE_EMAIL)) {
    die('Invalid email address');
  }

  // Email subject and message
  $subject = 'New Newsletter Subscription - N. Betharia & Associates';
  $message = "New newsletter subscription request:\n\n";
  $message .= "Email: " . $subscriber_email . "\n";
  $message .= "Date: " . date('Y-m-d H:i:s') . "\n";
  $message .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

  // Email headers
  $headers = "From: Newsletter Subscription <noreply@nbetharia.com>\r\n";
  $headers .= "Reply-To: " . $subscriber_email . "\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Send email
  if (mail($receiving_email_address, $subject, $message, $headers)) {
    echo 'Thank you for subscribing to our newsletter!';
  } else {
    echo 'Error: Unable to process your subscription. Please try again later.';
  }
} else {
  echo 'Error: No email address provided.';
}
