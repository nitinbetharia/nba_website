# Hostinger Deployment Troubleshooting Guide
## N. Betharia & Associates Website

### 🔍 Common Issues After Deployment

#### 1. **File Path Issues**
Hostinger servers are **case-sensitive**. Ensure all file paths match exactly:
- `assets/css/style.css` (not `Assets/CSS/style.css`)
- `assets/img/hero-bg.jpg` (not `assets/img/Hero-bg.jpg`)

#### 2. **Missing Files Checklist**
Verify these critical files are uploaded:

**CSS Files:**
- ✅ `assets/css/style.css`
- ✅ `assets/vendor/bootstrap/css/bootstrap.min.css`
- ✅ `assets/vendor/boxicons/css/boxicons.min.css`
- ✅ `assets/vendor/bootstrap-icons/bootstrap-icons.css`
- ✅ `assets/vendor/aos/aos.css`
- ✅ `assets/vendor/glightbox/css/glightbox.min.css`
- ✅ `assets/vendor/remixicon/remixicon.css`
- ✅ `assets/vendor/swiper/swiper-bundle.min.css`

**Font Files:**
- ✅ `assets/fonts/STENCIL.TTF`
- ✅ `assets/vendor/boxicons/fonts/` (entire folder)
- ✅ `assets/vendor/bootstrap-icons/fonts/` (entire folder)
- ✅ `assets/vendor/remixicon/` (font files)

**JavaScript Files:**
- ✅ `assets/js/main.js`
- ✅ `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`
- ✅ `assets/vendor/aos/aos.js`
- ✅ All other vendor JS files

#### 3. **Directory Structure**
Ensure this exact structure on Hostinger:
```
public_html/
├── index.html
├── privacy-policy.html
├── sitemap.xml
├── robots.txt
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── img/
│   │   ├── hero-bg.jpg
│   │   ├── favicon.png
│   │   └── [other images]
│   ├── fonts/
│   │   └── STENCIL.TTF
│   └── vendor/
│       ├── bootstrap/
│       ├── boxicons/
│       ├── bootstrap-icons/
│       └── [other vendors]
├── services/
├── resources/
└── forms/
```

#### 4. **File Permissions**
Set correct permissions on Hostinger:
- **Folders:** 755
- **HTML/CSS/JS files:** 644
- **PHP files:** 644

#### 5. **PHP Configuration**
For contact forms, ensure PHP is enabled:
- Contact form: `forms/contact.php`
- Newsletter: `forms/newsletter.php`

### 🛠 Quick Fixes

#### Fix 1: Add .htaccess for Better Compatibility
Create `.htaccess` file in root directory:
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set proper MIME types
AddType text/css .css
AddType application/javascript .js
AddType font/ttf .ttf
AddType font/woff .woff
AddType font/woff2 .woff2

# Cache control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

#### Fix 2: Fallback CSS (Add to head if issues persist)
```html
<!-- Fallback Bootstrap from CDN -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

<!-- Fallback Icons from CDN -->
<link href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
```

### 🔧 Debugging Steps

#### Step 1: Check Browser Console
1. Open website in browser
2. Press F12 → Console tab
3. Look for errors like:
   - `Failed to load resource: 404` (missing files)
   - `MIME type error` (server configuration)
   - `Font loading failed` (font path issues)

#### Step 2: Verify File Paths
Check if these URLs work directly:
- `https://yoursite.com/assets/css/style.css`
- `https://yoursite.com/assets/vendor/bootstrap/css/bootstrap.min.css`
- `https://yoursite.com/assets/fonts/STENCIL.TTF`

#### Step 3: Test Individual Components
1. If layout is broken → Bootstrap CSS issue
2. If icons missing → Boxicons/Bootstrap-icons issue  
3. If custom fonts not loading → Font path issue
4. If animations not working → AOS library issue

### 📞 Hostinger-Specific Solutions

#### Enable PHP (if contact forms not working)
1. Login to Hostinger control panel
2. Go to "Advanced" → "PHP Configuration"
3. Ensure PHP 7.4+ is selected
4. Enable required extensions:
   - `mail` function
   - `curl` (for external requests)

#### File Manager Upload
Use Hostinger File Manager:
1. Compress entire website as `.zip`
2. Upload to `public_html`
3. Extract using File Manager
4. Verify all files extracted correctly

#### Database (if needed later)
For future enhancements requiring database:
1. Create MySQL database in Hostinger panel
2. Note credentials for future use

### 🚨 Emergency Fixes

If website is completely broken, add this to `<head>` section:
```html
<!-- Emergency CDN Fallbacks -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/boxicons@2.0.9/css/boxicons.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

<!-- Custom CSS should still load after -->
<link href="assets/css/style.css" rel="stylesheet">
```

### ✅ Final Checklist

Before contacting support:
- [ ] All files uploaded to correct directories
- [ ] File permissions set correctly (755/644)
- [ ] .htaccess file created
- [ ] Browser console checked for errors
- [ ] Direct file URLs tested
- [ ] PHP enabled (for contact forms)
- [ ] SSL certificate active

**Need help?** Check browser console errors and share specific error messages for targeted troubleshooting.
