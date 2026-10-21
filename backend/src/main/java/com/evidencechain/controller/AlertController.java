package com.evidencechain.controller;

import com.evidencechain.model.SecurityAlert;
import com.evidencechain.repository.SecurityAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final SecurityAlertRepository securityAlertRepository;

    public AlertController(SecurityAlertRepository securityAlertRepository) {
        this.securityAlertRepository = securityAlertRepository;
    }

    @GetMapping
    public ResponseEntity<List<SecurityAlert>> getAllAlerts() {
        return ResponseEntity.ok(securityAlertRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<SecurityAlert>> getUnresolvedAlerts() {
        return ResponseEntity.ok(securityAlertRepository.findByResolvedFalseOrderByTimestampDesc());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id) {
        SecurityAlert alert = securityAlertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        alert.setResolved(true);
        securityAlertRepository.save(alert);
        return ResponseEntity.ok(Map.of("message", "Alert resolved successfully", "alertId", id));
    }
}
