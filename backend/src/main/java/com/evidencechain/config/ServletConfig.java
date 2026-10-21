package com.evidencechain.config;

import com.evidencechain.repository.CustodyLogRepository;
import com.evidencechain.repository.EvidenceRepository;
import com.evidencechain.servlet.AdminLoginServlet;
import com.evidencechain.servlet.AuditReportServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Boot configuration registering raw HttpServlets via ServletRegistrationBean.
 */
@Configuration
public class ServletConfig {

    private final EvidenceRepository evidenceRepository;
    private final CustodyLogRepository custodyLogRepository;

    public ServletConfig(EvidenceRepository evidenceRepository, CustodyLogRepository custodyLogRepository) {
        this.evidenceRepository = evidenceRepository;
        this.custodyLogRepository = custodyLogRepository;
    }

    @Bean
    public ServletRegistrationBean<AdminLoginServlet> adminLoginServletRegistration() {
        ServletRegistrationBean<AdminLoginServlet> registration =
                new ServletRegistrationBean<>(new AdminLoginServlet(), "/admin/login");
        registration.setName("AdminLoginServlet");
        registration.setLoadOnStartup(1);
        return registration;
    }

    @Bean
    public ServletRegistrationBean<AuditReportServlet> auditReportServletRegistration() {
        ServletRegistrationBean<AuditReportServlet> registration =
                new ServletRegistrationBean<>(new AuditReportServlet(evidenceRepository, custodyLogRepository), "/admin/audit-report");
        registration.setName("AuditReportServlet");
        registration.setLoadOnStartup(2);
        return registration;
    }
}
