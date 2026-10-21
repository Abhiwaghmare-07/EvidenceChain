<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EvidenceChain - Judicial Chain of Custody Audit Report</title>
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
            max-width: 1100px;
            margin: 30px auto;
            padding: 0 20px;
        }
        .report-sheet {
            background-color: #ffffff;
            color: #0f172a;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }
        .report-header {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .report-title {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.01em;
            margin: 0 0 6px 0;
        }
        .report-subtitle {
            font-size: 0.9rem;
            color: #475569;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            font-size: 0.88rem;
            margin-bottom: 24px;
            background-color: #f8fafc;
            padding: 16px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            margin-bottom: 24px;
        }
        th {
            background-color: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 10px 12px;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
        }
        tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .filter-bar {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .btn-print {
            background-color: #059669;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .btn-print:hover {
            background-color: #047857;
        }
        .signature-block {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding-top: 20px;
        }
        .sign-line {
            border-top: 1px solid #0f172a;
            padding-top: 8px;
            font-size: 0.82rem;
            font-weight: 700;
        }
        @media print {
            .navbar, .filter-bar {
                display: none !important;
            }
            body {
                background-color: #fff;
                color: #000;
            }
            .report-sheet {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="nav-brand">EvidenceChain Admin Portal</div>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/admin/users">User Management</a>
            <a href="${pageContext.request.contextPath}/admin/audit-report" class="active">Audit Trail Reports</a>
            <a href="${pageContext.request.contextPath}/admin/stats">System Telemetry</a>
            <a href="http://localhost:5173" target="_blank">&larr; Main React App</a>
            <a href="${pageContext.request.contextPath}/admin/logout" style="color: #f87171;">Logout</a>
        </nav>
    </header>

    <main class="container">
        <div class="filter-bar">
            <form action="${pageContext.request.contextPath}/admin/audit-report" method="GET" style="display: flex; gap: 10px; align-items: center;">
                <label style="color: #94a3b8; font-size: 0.88rem; font-weight: 600;">Select Case Identifier:</label>
                <select name="caseNumber" onchange="this.form.submit()" style="padding: 8px 12px; background: #111827; color: #fff; border: 1px solid #334155; border-radius: 6px;">
                    <option value="" ${selectedCase == 'ALL-CASES' ? 'selected' : ''}>-- All Consolidated Cases --</option>
                    <c:forEach items="${distinctCases}" var="c">
                        <option value="${c}" ${selectedCase == c ? 'selected' : ''}>${c}</option>
                    </c:forEach>
                </select>
            </form>

            <button type="button" onclick="window.print()" class="btn-print">
                Print Official Court Report (PDF)
            </button>
        </div>

        <article class="report-sheet">
            <div class="report-header">
                <div class="report-title">JUDICIAL FORENSIC CHAIN OF CUSTODY REPORT</div>
                <div class="report-subtitle">Statutory Compliance Under ISO/IEC 27037 & NIST SP 800-86 Cryptographic Evidence Standards</div>
            </div>

            <div class="meta-grid">
                <div><strong>Selected Case Dossier:</strong> ${selectedCase}</div>
                <div><strong>Report Generation Timestamp:</strong> ${generatedDate}</div>
                <div><strong>Evidence Items Audited:</strong> ${evidenceList.size()}</div>
                <div><strong>Custodial Events Logged:</strong> ${custodyLogs.size()}</div>
            </div>

            <h3 style="font-size: 1.05rem; margin-bottom: 10px; color: #0f172a;">1. Evidentiary Physical Artifacts Registered</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Evidence Title</th>
                        <th>Original File Name</th>
                        <th>Seizure Location</th>
                        <th>SHA-256 Digest (Fingerprint)</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach items="${evidenceList}" var="e">
                        <tr>
                            <td>#${e.id}</td>
                            <td><strong>${e.title}</strong></td>
                            <td>${e.fileName}</td>
                            <td>${e.location}</td>
                            <td style="font-family: monospace; font-size: 0.75rem;">${e.fileHash}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <h3 style="font-size: 1.05rem; margin-bottom: 10px; color: #0f172a;">2. Chronological Chain of Custody Audit Trail</h3>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Custodian</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Node IP</th>
                        <th>Forensic Audit Note</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach items="${custodyLogs}" var="l">
                        <tr>
                            <td>${l.timestamp}</td>
                            <td><strong>${l.username}</strong></td>
                            <td>${l.userRole}</td>
                            <td><strong>${l.action}</strong></td>
                            <td>${l.ipAddress}</td>
                            <td>${l.details}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <div class="signature-block">
                <div>
                    <div style="height: 40px;"></div>
                    <div class="sign-line">Lead Forensic Investigator (Evidence Officer)</div>
                    <div style="font-size: 0.75rem; color: #475569;">State Police Cyber Forensics Directorate</div>
                </div>
                <div>
                    <div style="height: 40px;"></div>
                    <div class="sign-line">Presiding Judicial Registrar / Seal</div>
                    <div style="font-size: 0.75rem; color: #475569;">District High Court Special Cyber Bench</div>
                </div>
            </div>
        </article>
    </main>
</body>
</html>
