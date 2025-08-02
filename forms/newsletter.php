<?php
if ($_POST && isset($_POST['email'])) {
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please enter a valid email address.";
    exit;
  }

  // Here you would typically save to database or send to email service
  // For now, we'll just log to a file
  $logEntry = date('Y-m-d H:i:s') . " - Newsletter signup: " . $email . "\n";
  file_put_contents('newsletter_signups.log', $logEntry, FILE_APPEND | LOCK_EX);

  http_response_code(200);
  echo "Thank you for subscribing to our newsletter!";
} else {
  http_response_code(400);
  echo "Invalid request.";
}
