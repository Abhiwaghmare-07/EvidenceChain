package com.evidencechain.controller;

import com.evidencechain.model.CustodyLog;
import com.evidencechain.service.CustodyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/custody")
public class CustodyController {

    private final CustodyService custodyService;

    public CustodyController(CustodyService custodyService) {
        this.custodyService = custodyService;
    }

    @GetMapping("/evidence/{evidenceId}")
    public ResponseEntity<List<CustodyLog>> getLogsByEvidence(@PathVariable Long evidenceId) {
        return ResponseEntity.ok(custodyService.getCustodyLogsByEvidence(evidenceId));
    }

    @GetMapping("/case/{caseNumber}")
    public ResponseEntity<List<CustodyLog>> getLogsByCase(@PathVariable String caseNumber) {
        return ResponseEntity.ok(custodyService.getCustodyLogsByCase(caseNumber));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<CustodyLog>> getRecentLogs() {
        return ResponseEntity.ok(custodyService.getRecentCustodyLogs());
    }
}
