package com.evidencechain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminPortalTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Phase 6: Admin login servlet page is publicly accessible")
    public void testAdminLoginPageAccessible() throws Exception {
        mockMvc.perform(get("/admin/login"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Phase 6: Unauthenticated access to /admin/users redirects to /admin/login")
    public void testUnauthenticatedAdminAccessRedirects() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Phase 6: Authenticated ADMIN can view /admin/users portal")
    public void testAdminUserManagementAccess() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("users"))
                .andExpect(model().attributeExists("roles"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Phase 6: Authenticated ADMIN can view /admin/audit-report servlet")
    public void testAdminAuditReportServlet() throws Exception {
        mockMvc.perform(get("/admin/audit-report"))
                .andExpect(status().isOk())
                .andExpect(request().attribute("evidenceList", org.hamcrest.Matchers.notNullValue()))
                .andExpect(request().attribute("custodyLogs", org.hamcrest.Matchers.notNullValue()));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Phase 6: Authenticated ADMIN can view /admin/stats telemetry")
    public void testAdminStatsAccess() throws Exception {
        mockMvc.perform(get("/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("userCount"))
                .andExpect(model().attributeExists("blockCount"))
                .andExpect(model().attributeExists("chainStatus"));
    }
}
