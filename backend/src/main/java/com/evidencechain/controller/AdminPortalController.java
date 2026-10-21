package com.evidencechain.controller;

import com.evidencechain.dto.ChainValidationDto;
import com.evidencechain.ledger.BlockchainService;
import com.evidencechain.model.Role;
import com.evidencechain.model.User;
import com.evidencechain.repository.CustodyLogRepository;
import com.evidencechain.repository.EvidenceRepository;
import com.evidencechain.repository.SecurityAlertRepository;
import com.evidencechain.repository.UserRepository;
import com.evidencechain.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminPortalController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final EvidenceRepository evidenceRepository;
    private final BlockchainService blockchainService;
    private final CustodyLogRepository custodyLogRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final com.evidencechain.servlet.AuditReportServlet auditReportServlet;

    public AdminPortalController(UserRepository userRepository,
                                 UserService userService,
                                 EvidenceRepository evidenceRepository,
                                 BlockchainService blockchainService,
                                 CustodyLogRepository custodyLogRepository,
                                 SecurityAlertRepository securityAlertRepository) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.evidenceRepository = evidenceRepository;
        this.blockchainService = blockchainService;
        this.custodyLogRepository = custodyLogRepository;
        this.securityAlertRepository = securityAlertRepository;
        this.auditReportServlet = new com.evidencechain.servlet.AuditReportServlet(evidenceRepository, custodyLogRepository);
    }

    @GetMapping("/login")
    public void showAdminLogin(jakarta.servlet.http.HttpServletRequest req, jakarta.servlet.http.HttpServletResponse res) throws Exception {
        new com.evidencechain.servlet.AdminLoginServlet().service(req, res);
    }

    @GetMapping("/audit-report")
    public void showAuditReport(jakarta.servlet.http.HttpServletRequest req, jakarta.servlet.http.HttpServletResponse res) throws Exception {
        auditReportServlet.service(req, res);
    }

    @GetMapping("/users")
    public String showUserManagement(Model model,
                                     @RequestParam(required = false) String success,
                                     @RequestParam(required = false) String error) {
        List<User> users = userRepository.findAll();
        model.addAttribute("users", users);
        model.addAttribute("roles", Role.values());
        model.addAttribute("successMessage", success);
        model.addAttribute("errorMessage", error);
        return "admin-users";
    }

    @PostMapping("/users/{id}/toggle-lock")
    public String toggleUserLock(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user.getRole() == Role.ADMIN) {
            return "redirect:/admin/users?error=Cannot+lock+system+administrator+account";
        }
        if (user.isAccountLocked()) {
            userService.unlockUser(id);
            return "redirect:/admin/users?success=User+account+unlocked+successfully";
        } else {
            userService.lockUser(id);
            return "redirect:/admin/users?success=User+account+locked+successfully";
        }
    }

    @PostMapping("/users/{id}/change-role")
    public String changeUserRole(@PathVariable Long id, @RequestParam("role") String roleStr) {
        Role role = Role.valueOf(roleStr);
        userService.updateUserRole(id, role);
        return "redirect:/admin/users?success=User+role+updated+to+" + role.name();
    }

    @GetMapping("/stats")
    public String showSystemStats(Model model) {
        long userCount = userRepository.count();
        long evidenceCount = evidenceRepository.count();
        long blockCount = blockchainService.getAllBlocks().size();
        long logCount = custodyLogRepository.count();
        long alertCount = securityAlertRepository.count();
        ChainValidationDto chainStatus = blockchainService.validateChain();

        model.addAttribute("userCount", userCount);
        model.addAttribute("evidenceCount", evidenceCount);
        model.addAttribute("blockCount", blockCount);
        model.addAttribute("logCount", logCount);
        model.addAttribute("alertCount", alertCount);
        model.addAttribute("chainStatus", chainStatus);

        // JVM metrics
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long usedMemory = totalMemory - freeMemory;
        model.addAttribute("totalMemory", totalMemory);
        model.addAttribute("usedMemory", usedMemory);
        model.addAttribute("freeMemory", freeMemory);

        return "admin-stats";
    }
}
