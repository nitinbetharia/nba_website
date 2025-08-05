<?php

/**
 * PHP Information & Test Script
 * Use this to verify PHP is working on your Hostinger hosting
 * 
 * IMPORTANT: Delete this file after testing for security!
 */

echo "<h1>PHP Test - N. Betharia & Associates</h1>";
echo "<p><strong>Current Date/Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";

// Test mail function availability
if (function_exists('mail')) {
  echo "<p><strong>Mail Function:</strong> ✅ Available</p>";
} else {
  echo "<p><strong>Mail Function:</strong> ❌ Not Available</p>";
}

// Test form submission
if ($_POST) {
  echo "<h2>Form Test Results:</h2>";
  echo "<p><strong>Form submitted successfully!</strong></p>";
  echo "<pre>";
  print_r($_POST);
  echo "</pre>";
}

// Display PHP configuration (comment out in production)
echo "<h2>PHP Configuration:</h2>";
echo "<p><strong>Upload Max Filesize:</strong> " . ini_get('upload_max_filesize') . "</p>";
echo "<p><strong>Post Max Size:</strong> " . ini_get('post_max_size') . "</p>";
echo "<p><strong>Max Execution Time:</strong> " . ini_get('max_execution_time') . " seconds</p>";
echo "<p><strong>Memory Limit:</strong> " . ini_get('memory_limit') . "</p>";

?>

<hr>
<h2>Test Form Submission</h2>
<form method="POST" action="">
  <p>
    <label>Name: <input type="text" name="test_name" value="Test User"></label>
  </p>
  <p>
    <label>Email: <input type="email" name="test_email" value="test@example.com"></label>
  </p>
  <p>
    <label>Message: <textarea name="test_message">This is a test message.</textarea></label>
  </p>
  <p>
    <input type="submit" value="Test PHP Form Processing">
  </p>
</form>

<hr>
<p><strong style="color: red;">⚠️ SECURITY NOTICE:</strong> Delete this file (phpinfo.php) after testing!</p>