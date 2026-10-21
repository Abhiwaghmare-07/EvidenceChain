<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EvidenceChain - Administrative Terminal Login</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-card {
            background-color: #111827;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 36px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 6px;
        }
        .subtitle {
            font-size: 0.85rem;
            color: #94a3b8;
            margin-bottom: 24px;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-size: 0.82rem;
            font-weight: 600;
            color: #94a3b8;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px 14px;
            background-color: #070a12;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #fff;
            box-sizing: border-box;
            outline: none;
            font-size: 0.95rem;
        }
        input:focus {
            border-color: #38bdf8;
        }
        .btn-submit {
            width: 100%;
            padding: 12px;
            background-color: #dc2626;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.95rem;
            margin-top: 10px;
        }
        .btn-submit:hover {
            background-color: #b91c1c;
        }
        .alert {
            padding: 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            margin-bottom: 20px;
        }
        .alert-error {
            background-color: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
        }
        .alert-success {
            background-color: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #86efac;
        }
        .demo-box {
            margin-top: 24px;
            padding-top: 18px;
            border-top: 1px solid #1e293b;
            font-size: 0.8rem;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="title">Administrative Terminal</div>
        <div class="subtitle">Session-authenticated JEE Servlet portal for user governance and judicial audit printing.</div>

        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="alert alert-error">
                <%= request.getAttribute("errorMessage") %>
            </div>
        <% } %>

        <% if (request.getAttribute("logoutMessage") != null) { %>
            <div class="alert alert-success">
                <%= request.getAttribute("logoutMessage") %>
            </div>
        <% } %>

        <form action="<%= request.getContextPath() %>/admin/login-process" method="POST">
            <div class="form-group">
                <label for="username">Admin Username</label>
                <input type="text" id="username" name="username" value="admin" required autofocus />
            </div>

            <div class="form-group">
                <label for="password">Security Password</label>
                <input type="password" id="password" name="password" value="AdminPassword123!" required />
            </div>

            <button type="submit" class="btn-submit">Sign In to Admin Console</button>
        </form>

        <div class="demo-box">
            <div>Default Admin Credentials:</div>
            <div>Username: <strong style="color: #38bdf8;">admin</strong></div>
            <div>Password: <strong style="color: #38bdf8;">AdminPassword123!</strong></div>
            <div style="margin-top: 8px;"><a href="http://localhost:5173" style="color: #38bdf8; text-decoration: none;">&larr; Return to React Web Client</a></div>
        </div>
    </div>
</body>
</html>
