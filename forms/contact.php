<?php
if ($_POST) {
  $name = strip_tags(trim($_POST["name"]));
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $subject = strip_tags(trim($_POST["subject"]));
  $message = trim($_POST["message"]);

  // Check that data was sent to the mailer.
  if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please fill out all fields and enter a valid email address.";
    exit;
  }

  // Set the recipient email address.
  $recipient = "ca.nbetharia@gmail.com";

  // Build the email content.
  $email_content = "Name: $name\n";
  $email_content .= "Email: $email\n\n";
  $email_content .= "Message:\n$message\n";

  // Build the email headers.
  $email_headers = "From: $name <$email>";

  // Send the email.
  if (mail($recipient, $subject, $email_content, $email_headers)) {
    http_response_code(200);
    echo "Thank You! Your message has been sent.";
  } else {
    http_response_code(500);
    echo "Oops! Something went wrong and we couldn't send your message.";
  }
} else {
  http_response_code(403);
  echo "There was a problem with your submission, please try again.";
}
?>
'password' => 'pass',
'port' => '587'
);
*/

$contact->add_message( $_POST['name'], 'From');
$contact->add_message( $_POST['email'], 'Email');
$contact->add_message( $_POST['message'], 'Message', 10);

echo $contact->send();