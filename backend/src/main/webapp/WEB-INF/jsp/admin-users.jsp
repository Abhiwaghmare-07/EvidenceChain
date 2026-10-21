<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EvidenceChain Admin - Officer & User Management</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
            margin: 0;
            padding: 0;
        }
        .navbar {
            background-color: #111827;
            border-bottom: 1px solid #1e293b;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .nav-brand {
            font-weight: 800;
            font-size: 1.2rem;
            color: #fff;
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .nav-links a {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 6px;
        }
        .nav-links a:hover, .nav-links a.active {
            color: #fff;
            background-color: #1e293b;
        }
        .container {
            max-width: 1200px;
            margin: 32px auto;
            padding: 0 20px;
        }
        .card {
            background-color: #111827;
            border: 1px solid #1e293b;
            border-radius: 10px;
            padding: 24px;
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        th {
            background-color: #0f172a;
            color: #94a3b8;
            text-align: left;
            padding: 12px 16px;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #1e293b;
        }
        td {
            padding: 14px 16px;
            border-bottom: 1px solid #1e293b;
        }
        tr:hover td {
            background-color: #182234;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
        }
        .badge-active {
            background-color: rgba(16, 185, 129, 0.2);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .badge-locked {
            background-color: rgba(239, 68, 68, 0.2);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .btn {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
        }
        .btn-lock {
            background-color: #dc2626;
            color: #fff;
        }
        .btn-unlock {
            background-color: #059669;
            color: #fff;
        }
        .btn-update {
            background-color: #2563eb;
            color: #fff;
        }
        select {
            background-color: #070a12;
            color: #fff;
            border: 1px solid #334155;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
        }
        .alert-success {
            background-color: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34d399;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-error {
            background-color: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #f87171;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="nav-brand">EvidenceChain Admin Portal</div>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/admin/users" class="active">User Management</a>
            <a href="${pageContext.request.contextPath}/admin/audit-report">Audit Trail Reports</a>
            <a href="${pageContext.request.contextPath}/admin/stats">System Telemetry</a>
            <a href="http://localhost:5173" target="_blank">&larr; Main React App</a>
            <a href="${pageContext.request.contextPath}/admin/logout" style="color: #f87171;">Logout</a>
        </nav>
    </header>

    <main class="container">
        <c:if test="${not empty successMessage}">
            <div class="alert-success">${successMessage}</div>
        </c:if>
        <c:if test="${not empty errorMessage}">
            <div class="alert-error">${errorMessage}</div>
        </c:if>

        <div class="card">
            <div class="card-header">
                <div>
                    <h1 style="font-size: 1.3rem; margin: 0 0 4px 0;">Investigator & Officer Accounts</h1>
                    <div style="font-size: 0.85rem; color: #94a3b8;">Manage statutory roles, unlock compromised accounts, and govern agency permissions.</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Officer / Investigator</th>
                        <th>Current Role</th>
                        <th>Agency & Department</th>
                        <th>Account Status</th>
                        <th>Change Role</th>
                        <th>Lock / Unlock Action</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach items="${users}" var="u">
                        <tr>
                            <td>
                                <strong style="color: #fff;">${u.fullName}</strong>
                                <div style="font-size: 0.75rem; color: #64748b;">@${u.username} | Badge: ${u.badgeNumber}</div>
                            </td>
                            <td>
                                <strong style="color: #38bdf8;">${u.role}</strong>
                            </td>
                            <td>
                                <div>${u.agency}</div>
                                <div style="font-size: 0.75rem; color: #64748b;">${u.department}</div>
                            </td>
                            <td>
                                <c:choose>
                                    <c:when test="${u.accountLocked}">
                                        <span class="badge badge-locked">LOCKED</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="badge badge-active">ACTIVE</span>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>
                                <form action="${pageContext.request.contextPath}/admin/users/${u.id}/change-role" method="POST" style="display: flex; gap: 6px; align-items: center;">
                                    <select name="role">
                                        <c:forEach items="${roles}" var="r">
                                            <option value="${r}" ${u.role == r ? 'selected' : ''}>${r}</option>
                                        </c:forEach>
                                    </select>
                                    <button type="submit" class="btn btn-update">Save</button>
                                </form>
                            </td>
                            <td>
                                <c:choose>
                                    <c:when test="${u.role == 'ADMIN'}">
                                        <span style="font-size: 0.78rem; color: #64748b;">Protected Root</span>
                                    </c:when>
                                    <c:when test="${u.accountLocked}">
                                        <form action="${pageContext.request.contextPath}/admin/users/${u.id}/toggle-lock" method="POST">
                                            <button type="submit" class="btn btn-unlock">Unlock Account</button>
                                        </form>
                                    </c:when>
                                    <c:otherwise>
                                        <form action="${pageContext.request.contextPath}/admin/users/${u.id}/toggle-lock" method="POST">
                                            <button type="submit" class="btn btn-lock">Lock Account</button>
                                        </form>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
