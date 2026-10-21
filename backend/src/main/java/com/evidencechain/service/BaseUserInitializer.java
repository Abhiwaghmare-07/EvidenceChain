package com.evidencechain.service;

import com.evidencechain.model.Role;
import com.evidencechain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class BaseUserInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(BaseUserInitializer.class);

    private final UserRepository userRepository;
    private final UserService userService;

    public BaseUserInitializer(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        seedUserIfMissing("officer_chen", "Password123!", "chen@metropolice.gov",
                "Inspector David Chen", Role.POLICE, "Cybercrime Division", "Metropolitan Police", "MP-8491");

        seedUserIfMissing("agent_miller", "Password123!", "miller@fedbureau.gov",
                "Special Agent Sarah Miller", Role.FEDERAL, "National Cyber Forensics", "Federal Investigation Agency", "FIA-2049");

        seedUserIfMissing("judge_vance", "Password123!", "vance@judiciary.gov",
                "Hon. Judge Raymond Vance", Role.JUDGE, "Cyber Appellate Bench", "District High Court", "JD-102");

        seedUserIfMissing("admin", "AdminPassword123!", "admin@evidencechain.gov",
                "System Administrator", Role.ADMIN, "IT & Infrastructure Security", "EvidenceChain HQ", "ADM-001");

        logger.info("Base users initialized successfully for all four roles: POLICE, FEDERAL, JUDGE, ADMIN.");
    }

    private void seedUserIfMissing(String username, String password, String email, String fullName,
                                   Role role, String department, String agency, String badgeNumber) {
        if (!userRepository.existsByUsername(username)) {
            userService.createUser(username, password, email, fullName, role, department, agency, badgeNumber);
            logger.info("Created base user: {} with role: {}", username, role);
        }
    }
}
