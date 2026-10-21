package com.evidencechain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_alerts")
public class SecurityAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(name = "rule_violated", nullable = false, length = 100)
    private String ruleViolated;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false)
    private boolean resolved = false;

    public SecurityAlert() {
    }

    public SecurityAlert(Long userId, String username, String ruleViolated, Integer riskScore, String details) {
        this.userId = userId;
        this.username = username;
        this.ruleViolated = ruleViolated;
        this.riskScore = riskScore;
        this.details = details;
        this.timestamp = LocalDateTime.now();
        this.resolved = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRuleViolated() {
        return ruleViolated;
    }

    public void setRuleViolated(String ruleViolated) {
        this.ruleViolated = ruleViolated;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }
}
