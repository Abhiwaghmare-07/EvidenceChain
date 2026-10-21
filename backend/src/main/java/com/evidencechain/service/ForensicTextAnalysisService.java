package com.evidencechain.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Optional Phase 8 Forensic Text Analysis & Privacy Protection Service.
 * Provides automated PII redaction and smart artifact summarization without altering original hashes.
 */
@Service
public class ForensicTextAnalysisService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b");
    private static final Pattern SSN_OR_ID_PATTERN = Pattern.compile("\\b(?:\\d{3}-\\d{2}-\\d{4}|ID:[A-Z0-9-]{6,})\\b");
    private static final Pattern CC_PATTERN = Pattern.compile("\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\b");
    private static final Pattern IP_PATTERN = Pattern.compile("\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b");
    private static final Pattern TIMESTAMP_PATTERN = Pattern.compile("\\b\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\b");

    private static final Set<String> STOPWORDS = Set.of(
            "the", "and", "for", "with", "from", "that", "this", "have", "were", "been", "will", "would",
            "server", "system", "file", "user", "access", "unauthorized", "data"
    );

    public static class SmartSummary {
        private final List<String> extractedIps;
        private final List<String> extractedEmails;
        private final List<String> extractedTimestamps;
        private final List<String> topKeywords;

        public SmartSummary(List<String> extractedIps, List<String> extractedEmails,
                            List<String> extractedTimestamps, List<String> topKeywords) {
            this.extractedIps = extractedIps;
            this.extractedEmails = extractedEmails;
            this.extractedTimestamps = extractedTimestamps;
            this.topKeywords = topKeywords;
        }

        public List<String> getExtractedIps() {
            return extractedIps;
        }

        public List<String> getExtractedEmails() {
            return extractedEmails;
        }

        public List<String> getExtractedTimestamps() {
            return extractedTimestamps;
        }

        public List<String> getTopKeywords() {
            return topKeywords;
        }
    }

    /**
     * Redacts PII (emails, phone numbers, SSNs, credit cards) while leaving the original file hash untouched.
     */
    public String redactSensitiveData(String originalText) {
        if (originalText == null) return "";
        String text = originalText;
        text = EMAIL_PATTERN.matcher(text).replaceAll("[REDACTED_EMAIL]");
        text = PHONE_PATTERN.matcher(text).replaceAll("[REDACTED_PHONE]");
        text = SSN_OR_ID_PATTERN.matcher(text).replaceAll("[REDACTED_GOV_ID]");
        text = CC_PATTERN.matcher(text).replaceAll("[REDACTED_FINANCIAL_CARD]");
        return text;
    }

    /**
     * Extracts structured intelligence: network IPs, emails, timestamps, and high-frequency forensic terms.
     */
    public SmartSummary generateSmartSummary(String text) {
        if (text == null) {
            return new SmartSummary(Collections.emptyList(), Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
        }

        Set<String> ips = new LinkedHashSet<>();
        Matcher ipMatcher = IP_PATTERN.matcher(text);
        while (ipMatcher.find()) {
            ips.add(ipMatcher.group());
        }

        Set<String> emails = new LinkedHashSet<>();
        Matcher emailMatcher = EMAIL_PATTERN.matcher(text);
        while (emailMatcher.find()) {
            emails.add(emailMatcher.group());
        }

        Set<String> timestamps = new LinkedHashSet<>();
        Matcher tsMatcher = TIMESTAMP_PATTERN.matcher(text);
        while (tsMatcher.find()) {
            timestamps.add(tsMatcher.group());
        }

        // Top keywords
        Map<String, Integer> wordCounts = new HashMap<>();
        String[] words = text.toLowerCase(Locale.ROOT).split("[^a-z0-9_-]+");
        for (String w : words) {
            if (w.length() >= 4 && !STOPWORDS.contains(w) && !w.matches("\\d+")) {
                wordCounts.put(w, wordCounts.getOrDefault(w, 0) + 1);
            }
        }

        List<String> topKeywords = wordCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(8)
                .map(e -> e.getKey() + " (" + e.getValue() + ")")
                .collect(Collectors.toList());

        return new SmartSummary(new ArrayList<>(ips), new ArrayList<>(emails), new ArrayList<>(timestamps), topKeywords);
    }
}
