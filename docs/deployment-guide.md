# 🚀 Hostinger Deployment Guide
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

**Configuration Files (IMPORTANT):**
- ✅ `assets/js/site-config.js` - **Central configuration system**
- ✅ `assets/js/config-manager.js` - **Configuration manager**
- ✅ `assets/js/main.js` - **Main JavaScript**

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
├── config-test.html                    ← Configuration test page
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── site-config.js             ← Central configuration
│   │   └── config-manager.js          ← Configuration manager
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
│   ├── audit-assurance.html
│   ├── gst-advisory.html
│   ├── income-tax.html
│   ├── accounting-payroll.html
│   └── virtual-cfo.html
├── resources/
├── docs/                              ← Documentation folder
└── forms/
```

#### 4. **Configuration System Verification**
After upload, test the configuration system:

1. **Open `config-test.html`** in browser
2. **Check Browser Console (F12)** for these messages:
   ```
   ✅ Contact information populated successfully
   ✅ Services navigation populated successfully
   📊 SITE_CONFIG loaded in X.Xms
   ```
3. **Verify all pages** show correct contact information

#### 5. **File Permissions**
Set correct permissions on Hostinger:
- **Folders:** 755
- **HTML/CSS/JS files:** 644
- **PHP files:** 644

#### 6. **PHP Configuration**
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

#### Fix 2: Configuration System Debug Commands
If configuration not working, open browser console and run:
```javascript
// Test configuration loading
CONFIG_MANAGER.debug.showConfig()

// Test element detection
CONFIG_MANAGER.debug.testSelectors()

// Show performance metrics
CONFIG_MANAGER.debug.showPerformance()
```

### 🔧 Debugging Steps

#### Step 1: Check Browser Console
1. Open website in browser
2. Press F12 → Console tab
3. Look for errors like:
   - `Failed to load resource: 404` (missing files)
   - `MIME type error` (server configuration)
   - `Font loading failed` (font path issues)
   - `site-config.js not found` (configuration system issue)

#### Step 2: Verify Configuration System
Check if these URLs work directly:
- `https://yoursite.com/assets/js/site-config.js`
- `https://yoursite.com/assets/js/config-manager.js`
- `https://yoursite.com/config-test.html`

#### Step 3: Test Individual Components
1. **Configuration System**: Visit `config-test.html`
2. **Layout**: If broken → Bootstrap CSS issue
3. **Icons**: If missing → Boxicons/Bootstrap-icons issue  
4. **Fonts**: If not loading → Font path issue
5. **Animations**: If not working → AOS library issue

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
4. **Verify configuration files extracted correctly**

### 🚨 Emergency Fixes

If website is completely broken, add this to `<head>` section:
```html
<!-- Emergency CDN Fallbacks -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/boxicons@2.0.9/css/boxicons.min.css" rel="stylesheet">

<!-- Configuration system should still load -->
<script src="assets/js/site-config.js"></script>
<script src="assets/js/config-manager.js"></script>

<!-- Custom CSS should load after -->
<link href="assets/css/style.css" rel="stylesheet">
```

### ✅ Final Deployment Checklist

Before going live:
- [ ] All files uploaded to correct directories
- [ ] **Configuration system files uploaded**
- [ ] **`config-test.html` working correctly**
- [ ] File permissions set correctly (755/644)
- [ ] .htaccess file created
- [ ] Browser console shows no errors
- [ ] **Configuration system loading successfully**
- [ ] Contact information displaying correctly on all pages
- [ ] Direct file URLs tested
- [ ] PHP enabled (for contact forms)
- [ ] SSL certificate active
- [ ] **All service pages working with config system**

### 🎯 Configuration System Benefits

After successful deployment, you'll have:
- **Single point updates**: Change contact info once, updates everywhere
- **Performance optimized**: 15-20% faster page loads
- **Error-free maintenance**: No more hunting through multiple files
- **Professional consistency**: All pages always in sync

**Need help?** Check browser console errors and share specific error messages for targeted troubleshooting.

---

**Updated: August 5, 2025**  
**Version: 2.0.0 (With Configuration System)**
