package com.evidencechain.servlet;

import com.evidencechain.model.CustodyLog;
import com.evidencechain.model.Evidence;
import com.evidencechain.repository.CustodyLogRepository;
import com.evidencechain.repository.EvidenceRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Raw HttpServlet generating case-specific printable forensic audit reports.
 * Registered via ServletRegistrationBean.
 */
public class AuditReportServlet extends HttpServlet {

    private final EvidenceRepository evidenceRepository;
    private final CustodyLogRepository custodyLogRepository;

    public AuditReportServlet(EvidenceRepository evidenceRepository, CustodyLogRepository custodyLogRepository) {
        this.evidenceRepository = evidenceRepository;
        this.custodyLogRepository = custodyLogRepository;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String caseNumber = request.getParameter("caseNumber");

        List<Evidence> evidenceList;
        List<CustodyLog> logs;

        if (caseNumber != null && !caseNumber.trim().isEmpty()) {
            caseNumber = caseNumber.trim();
            evidenceList = evidenceRepository.findByCaseNumber(caseNumber);
            logs = custodyLogRepository.findByCaseNumberOrderByTimestampDesc(caseNumber);
        } else {
            caseNumber = "ALL-CASES";
            evidenceList = evidenceRepository.findAll();
            logs = custodyLogRepository.findAllByOrderByTimestampDesc();
        }

        request.setAttribute("selectedCase", caseNumber);
        request.setAttribute("evidenceList", evidenceList);
        request.setAttribute("custodyLogs", logs);
        request.setAttribute("generatedDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // Also pass all distinct case numbers for the dropdown filter
        List<String> distinctCases = evidenceRepository.findAll().stream()
                .map(Evidence::getCaseNumber)
                .distinct()
                .toList();
        request.setAttribute("distinctCases", distinctCases);

        request.getRequestDispatcher("/WEB-INF/jsp/admin-audit-report.jsp").forward(request, response);
    }
}
