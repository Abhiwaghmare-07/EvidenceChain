package com.evidencechain;

import com.evidencechain.service.ForensicTextAnalysisService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ForensicTextAnalysisTest {

    private final ForensicTextAnalysisService textAnalysisService = new ForensicTextAnalysisService();

    @Test
    @DisplayName("Should successfully redact emails, phone numbers, SSNs, and credit cards")
    void testRedaction() {
        String sensitiveText = "Suspect email is suspect.cyber@darknet.org and phone is 415-555-0199. " +
                "National ID: 123-45-6789. Card used: 4111111111111111.";

        String redacted = textAnalysisService.redactSensitiveData(sensitiveText);

        assertFalse(redacted.contains("suspect.cyber@darknet.org"), "Email should be redacted");
        assertFalse(redacted.contains("415-555-0199"), "Phone should be redacted");
        assertFalse(redacted.contains("123-45-6789"), "SSN should be redacted");
        assertFalse(redacted.contains("4111111111111111"), "Credit card should be redacted");

        assertTrue(redacted.contains("[REDACTED_EMAIL]"));
        assertTrue(redacted.contains("[REDACTED_PHONE]"));
        assertTrue(redacted.contains("[REDACTED_GOV_ID]"));
        assertTrue(redacted.contains("[REDACTED_FINANCIAL_CARD]"));
    }

    @Test
    @DisplayName("Should extract network IPs, emails, timestamps, and top keywords")
    void testSmartSummaryExtraction() {
        String logText = "2026-10-18 03:14:22 [ALERT] Unauthorized brute-force attempt from IP 192.168.1.105 targeting root.\n" +
                "2026-10-18 03:14:25 Secondary probe originating from 10.0.0.45.\n" +
                "Operator email admin-alerts@sec-corp.gov received ransom note from extortionist@blackhat.net.\n" +
                "Malware payload ransomware trojan ransomware payload detected.";

        ForensicTextAnalysisService.SmartSummary summary = textAnalysisService.generateSmartSummary(logText);

        assertNotNull(summary);
        assertTrue(summary.getExtractedIps().contains("192.168.1.105"));
        assertTrue(summary.getExtractedIps().contains("10.0.0.45"));

        assertTrue(summary.getExtractedEmails().contains("admin-alerts@sec-corp.gov"));
        assertTrue(summary.getExtractedEmails().contains("extortionist@blackhat.net"));

        assertEquals(2, summary.getExtractedTimestamps().size());
        assertTrue(summary.getExtractedTimestamps().contains("2026-10-18 03:14:22"));

        assertFalse(summary.getTopKeywords().isEmpty());
    }
}
