# Frontend - AWS Serverless Registration App

Simple HTML/CSS/JavaScript frontend for the AWS Serverless Registration App.

## 📁 Files

```
frontend/
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── register.js
│   ├── login.js
│   └── home.js
├── index.html
├── register.html
├── login.html
├── home.html
└── README.md
```

## 🚀 Setup

1. **Update API Endpoint**
   
   Edit `js/config.js` and update the `BASE_URL`:
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'https://your-api-gateway-url.amazonaws.com/dev',
       // or for local testing:
       // BASE_URL: 'http://localhost:3000',
       ...
   };
   ```

2. **Run Locally**
   
   Simply open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. **Access the App**
   
   Open `http://localhost:8000` in your browser

## 🎯 Features

- Clean, modern UI with gradient design
- Responsive layout
- Form validation
- Loading states
- Success/Error alerts
- JWT token storage
- Protected routes

## 📝 Usage Flow

1. Start at `index.html` (landing page)
2. Register a new account at `register.html`
3. Login at `login.html`
4. View profile at `home.html`
5. Logout returns to login page

## 🔒 Authentication

- JWT token stored in localStorage
- Token sent with API requests
- Protected routes check for token
- Logout clears token and user data
