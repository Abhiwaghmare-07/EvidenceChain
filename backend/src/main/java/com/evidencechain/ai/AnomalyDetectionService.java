package com.evidencechain.ai;

import com.evidencechain.model.*;
import com.evidencechain.repository.CustodyLogRepository;
import com.evidencechain.repository.SecurityAlertRepository;
import com.evidencechain.repository.UserActivityStatRepository;
import com.evidencechain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * AI Anomaly Detection & Behavioral Lockout Engine.
 * Combines deterministic rule-based checks (night access, download floods, repeated verification failures)
 * with a statistical Z-Score algorithm calculating deviations from the investigator's hourly baseline.
 * If the aggregated risk score exceeds the configured threshold, the account is automatically locked.
 */
@Service
public class AnomalyDetectionService {

    private static final Logger logger = LoggerFactory.getLogger(AnomalyDetectionService.class);

    private final UserRepository userRepository;
    private final CustodyLogRepository custodyLogRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final UserActivityStatRepository userActivityStatRepository;

    @Value("${evidencechain.anomaly.lockout-threshold:75}")
    private int lockoutThreshold;

    @Value("${evidencechain.anomaly.max-downloads-window-mins:10}")
    private int downloadWindowMins;

    @Value("${evidencechain.anomaly.max-downloads-allowed:5}")
    private int maxDownloadsAllowed;

    @Value("${evidencechain.anomaly.max-failed-verifications:3}")
    private int maxFailedVerifications;

    public AnomalyDetectionService(UserRepository userRepository,
                                   CustodyLogRepository custodyLogRepository,
                                   SecurityAlertRepository securityAlertRepository,
                                   UserActivityStatRepository userActivityStatRepository) {
        this.userRepository = userRepository;
        this.custodyLogRepository = custodyLogRepository;
        this.securityAlertRepository = securityAlertRepository;
        this.userActivityStatRepository = userActivityStatRepository;
    }

    public static class RiskAssessment {
        private final int riskScore;
        private final boolean locked;
        private final List<String> violations;

        public RiskAssessment(int riskScore, boolean locked, List<String> violations) {
            this.riskScore = riskScore;
            this.locked = locked;
            this.violations = violations;
        }

        public int getRiskScore() {
            return riskScore;
        }

        public boolean isLocked() {
            return locked;
        }

        public List<String> getViolations() {
            return violations;
        }
    }

    /**
     * Records an action into the user's hourly activity bucket for statistical baseline tracking.
     */
    @Transactional
    public void recordUserAction(Long userId) {
        String currentHourBucket = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH"));
        UserActivityStat stat = userActivityStatRepository.findByUserIdAndHourBucket(userId, currentHourBucket)
                .orElse(new UserActivityStat(userId, currentHourBucket, 0));
        stat.setActionCount(stat.getActionCount() + 1);
        userActivityStatRepository.save(stat);
    }

    /**
     * Evaluates security risk score (0 - 100) and triggers automated behavioral lockout if threshold is exceeded.
     */
    @Transactional
    public RiskAssessment evaluateUserRisk(User user, String triggerContext) {
        int riskScore = 0;
        List<String> violations = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Always update hourly activity count
        recordUserAction(user.getId());

        // --- RULE 1: Off-Hours Midnight Access Check (00:00 to 05:00) ---
        int currentHour = now.getHour();
        if (currentHour >= 0 && currentHour < 5) {
            riskScore += 30;
            violations.add("OFF_HOURS_ACCESS: System access during suspicious nighttime window (00:00 - 05:00)");
        }

        // --- RULE 2: Rapid Download Flood Spike in Rolling Window ---
        LocalDateTime downloadWindowStart = now.minusMinutes(downloadWindowMins);
        long recentDownloads = custodyLogRepository.countByUserIdAndActionAndTimestampAfter(
                user.getId(), CustodyAction.DOWNLOAD, downloadWindowStart);

        if (recentDownloads >= maxDownloadsAllowed) {
            riskScore += 40;
            violations.add(String.format("DOWNLOAD_BURST: Exceeded threshold with %d raw evidence downloads in last %d minutes",
                    recentDownloads, downloadWindowMins));
        }

        // --- RULE 3: Repeated Failed Cryptographic Verifications ---
        LocalDateTime verifyWindowStart = now.minusMinutes(15);
        List<CustodyLog> recentLogs = custodyLogRepository.findByUserIdOrderByTimestampDesc(user.getId());
        long failedVerifications = recentLogs.stream()
                .filter(l -> l.getTimestamp().isAfter(verifyWindowStart))
                .filter(l -> l.getAction() == CustodyAction.VERIFY && l.getDetails() != null && l.getDetails().contains("TAMPER"))
                .count();

        if (failedVerifications >= maxFailedVerifications) {
            riskScore += 45;
            violations.add(String.format("VERIFICATION_FAILURES: %d failed cryptographic integrity verifications in 15 minutes",
                    failedVerifications));
        }

        // --- RULE 4: Statistical Z-Score Anomaly vs. User Baseline ---
        // Z = (x - mean) / stdDev over historical hourly activity buckets
        List<UserActivityStat> historicalStats = userActivityStatRepository.findByUserId(user.getId());
        if (historicalStats.size() >= 3) {
            double sum = 0.0;
            for (UserActivityStat s : historicalStats) {
                sum += s.getActionCount();
            }
            double mean = sum / historicalStats.size();

            double varianceSum = 0.0;
            for (UserActivityStat s : historicalStats) {
                varianceSum += Math.pow(s.getActionCount() - mean, 2);
            }
            double stdDev = Math.sqrt(varianceSum / historicalStats.size());

            String currentHourBucket = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH"));
            int currentHourActions = userActivityStatRepository.findByUserIdAndHourBucket(user.getId(), currentHourBucket)
                    .map(UserActivityStat::getActionCount).orElse(1);

            if (stdDev > 0.001) {
                double zScore = (currentHourActions - mean) / stdDev;
                if (zScore > 2.5) {
                    riskScore += 35;
                    violations.add(String.format("BEHAVIORAL_SPIKE: High statistical anomaly detected (Z-Score = %.2f > 2.5)", zScore));
                } else if (zScore > 1.8) {
                    riskScore += 20;
                    violations.add(String.format("BEHAVIORAL_ELEVATION: Moderate activity elevation (Z-Score = %.2f > 1.8)", zScore));
                }
            }
        }

        // Direct context triggers (e.g. simulation or external unassigned case access)
        if ("UNASSIGNED_CASE_ACCESS".equalsIgnoreCase(triggerContext)) {
            riskScore += 25;
            violations.add("UNASSIGNED_ACCESS: Attempted inquiry into unassigned external jurisdiction case file");
        } else if ("SIMULATED_ATTACK".equalsIgnoreCase(triggerContext)) {
            riskScore = Math.max(riskScore, 90);
            violations.add("SIMULATED_CYBER_ATTACK: High-frequency brute data exfiltration & tamper simulation pattern");
        }

        // Clamp risk score to [0, 100]
        int finalRiskScore = Math.min(100, riskScore);

        boolean shouldLock = finalRiskScore >= lockoutThreshold;
        if (shouldLock && !user.isAccountLocked()) {
            user.setAccountLocked(true);
            userRepository.save(user);

            String violationSummary = String.join(" | ", violations);
            SecurityAlert alert = new SecurityAlert(
                    user.getId(),
                    user.getUsername(),
                    "BEHAVIORAL_ANOMALY_LOCKOUT",
                    finalRiskScore,
                    String.format("User automatically locked. Risk Score: %d (Threshold: %d). Triggers: %s",
                            finalRiskScore, lockoutThreshold, violationSummary)
            );
            securityAlertRepository.save(alert);

            logger.warn("SECURITY ALERT: User {} account locked due to risk score {}/100. Violations: {}",
                    user.getUsername(), finalRiskScore, violationSummary);
        } else if (finalRiskScore >= 40 && !violations.isEmpty()) {
            // Log security warning alert for medium risk
            String violationSummary = String.join(" | ", violations);
            SecurityAlert alert = new SecurityAlert(
                    user.getId(),
                    user.getUsername(),
                    "SECURITY_RISK_WARNING",
                    finalRiskScore,
                    String.format("Elevated security risk warning (%d/100): %s", finalRiskScore, violationSummary)
            );
            securityAlertRepository.save(alert);
        }

        return new RiskAssessment(finalRiskScore, user.isAccountLocked(), violations);
    }

    /**
     * Periodic scheduled evaluation running every 60 seconds to detect idle threshold breaches.
     */
    @Scheduled(fixedRate = 60000)
    public void scheduledAnomalyScan() {
        List<User> activeUsers = userRepository.findAll();
        for (User u : activeUsers) {
            if (!u.isAccountLocked() && u.getRole() != Role.ADMIN) {
                // Background scan checks for rapid downloads or failed verifications
                try {
                    evaluateUserRisk(u, "SCHEDULED_SCAN");
                } catch (Exception e) {
                    logger.error("Error evaluating scheduled anomaly for user: {}", u.getUsername(), e);
                }
            }
        }
    }
}
