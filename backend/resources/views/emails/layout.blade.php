<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $subject ?? 'InveniqLab Notification' }}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #115e59 100%);
      padding: 32px 36px;
      text-align: left;
    }
    .brand-title {
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-highlight {
      color: #2dd4bf;
    }
    .brand-subtitle {
      color: #94a3b8;
      font-size: 11px;
      font-family: monospace;
      letter-spacing: 1px;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .content {
      padding: 36px;
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .action-button-container {
      margin: 28px 0;
      text-align: center;
    }
    .action-button {
      display: inline-block;
      background-color: #0d9488;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(13, 148, 136, 0.25);
    }
    .footer {
      background-color: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      padding: 24px 36px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer a {
      color: #0d9488;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-title">Inveniq<span class="brand-highlight">Lab</span></h1>
        <div class="brand-subtitle">RESEARCH ERP & LAB NOTEBOOK</div>
      </div>
      <div class="content">
        @yield('content')
      </div>
      <div class="footer">
        <p>© {{ date('Y') }} InveniqLab. All rights reserved.<br>
        21 CFR Part 11 Electronic Records Compliant Research Management.</p>
        <p>This is an automated system notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
