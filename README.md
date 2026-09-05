# OAOA Style Framework & Global CDN

> **Neo-Brutalist Light Monochrome Design System & UI Architecture**  
> Unified across [oaoa.dev](https://oaoa.dev). Zero border-radius, high-contrast black & white ink, hard offset shadows, and functional typography.

---

## 🌐 Public Edge CDN (`styles.oaoa.dev`)

When deployed to Cloudflare Pages on `styles.oaoa.dev`, you can hotlink styles and scripts directly into any website, platform, or portal without local installs:

### 1. Latest Production Assets (Auto-Updated)
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">

<!-- OAOA Brutalist CSS -->
<link rel="stylesheet" href="https://styles.oaoa.dev/framework.min.css">

<!-- OAOA Interactive JS (ESM) -->
<script type="module" src="https://styles.oaoa.dev/framework.min.js"></script>
```

### 2. Version-Pinned Assets (`/v1/`)
```html
<link rel="stylesheet" href="https://styles.oaoa.dev/v1/framework.min.css">
<script type="module" src="https://styles.oaoa.dev/v1/framework.min.js"></script>
```

### 3. Living Component Showcase
Navigate to **`https://styles.oaoa.dev/`** to view the interactive documentation, token reference, and live UI components.

---

## ☁️ Cloudflare Pages Setup (`styles.oaoa.dev`)

Cloudflare Pages supports **multiple independent projects** on the same account and domain. You can run `oaoa.dev` on one Pages project and `styles.oaoa.dev` on another without conflict:

1. **Push this repository to GitHub** (e.g. `github.com/your-org/oaoa-style-framework`).
2. In the **Cloudflare Dashboard**:
   - Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
   - Select the `oaoa-style-framework` repository.
3. **Build & Output Settings**:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Custom Domain**:
   - In your newly created Pages project, go to **Custom domains** → **Set up a custom domain**.
   - Enter `styles.oaoa.dev`.
   - Cloudflare will automatically add the CNAME DNS record and activate SSL.
5. **CORS & Compression**:
   - The included [`_headers`](./_headers) file is automatically read by Cloudflare Pages to set `Access-Control-Allow-Origin: *` and long-term immutable edge caching.

---

## 📦 Package Contents & Structure

```
/projects/oaoa-style-framework/
├── framework.css           # Primary unminified CSS framework & tokens
├── framework.js            # ESM interactive components (modals, dialogs, toasts, nav)
├── index.html              # Interactive living styleguide & component showcase
├── _headers                # Cloudflare Pages CORS & caching rules
├── DESIGN_SYSTEM.md        # Architectural brief, typography scale, rules & checklist
├── package.json            # NPM package configuration (@oaoa/style-framework)
├── Dockerfile              # Production-ready Nginx alpine container
├── nginx.conf              # Preconfigured Nginx with gzip/brotli & CORS headers
├── .gitignore              # Standard git exclusion rules
├── .github/workflows/ci.yml# Automated build validation workflow
├── dist/                   # Production-ready distribution bundle (served by CDN)
│   ├── framework.css / framework.min.css (and pre-compressed .gz / .br)
│   ├── framework.js  / framework.min.js  (and pre-compressed .gz / .br)
│   ├── index.html                        (and pre-compressed .gz / .br)
│   ├── _headers                          (Cloudflare edge configuration)
│   └── v1/                               (Version-pinned immutable assets)
└── scripts/
    ├── build.js            # Node.js automated minification & compression builder (npm run build)
    ├── build.py            # Python 3 fallback builder
    ├── serve.js            # Node.js local preview server
    └── serve.py            # Python 3 preview server
```

---

## 🚀 Framework Integration Recipes

### ASP.NET Core (.NET MVC / Razor / Blazor)

In `_Layout.cshtml`:
```html
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
    
    <!-- Option A: Via CDN -->
    <link rel="stylesheet" href="https://styles.oaoa.dev/framework.min.css" />

    <!-- Option B: Local Drop-in -->
    <!-- <link rel="stylesheet" href="~/styles-guide/framework.min.css" asp-append-version="true" /> -->
</head>
<body>
    @RenderBody()
    <script type="module" src="https://styles.oaoa.dev/framework.min.js"></script>
</body>
```

### NPM / Modern Frontend (React, Vite, Next.js, Astro)

```bash
npm install /projects/oaoa-style-framework
# or when published
npm install @oaoa/style-framework
```

In your main entry file (`main.tsx` or `index.js`):
```javascript
import '@oaoa/style-framework/css';
import { openModal, confirmDialog } from '@oaoa/style-framework';
```

---

## 🔨 Development & Build Commands

- **Local Preview Server**:
  ```bash
  python3 scripts/serve.py
  # Preview at http://localhost:8080 or http://0.0.0.0:8080
  ```
- **Rebuild & Pre-Compress Assets**:
  ```bash
  python3 scripts/build.py
  ```
