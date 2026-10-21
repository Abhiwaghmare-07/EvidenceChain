package com.evidencechain.ai;

import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

/**
 * AI-assisted automated tagging service for forensic artifacts.
 * Classifies evidence by file extension, MIME type, and header keywords.
 */
@Service
public class AutoTaggingService {

    public String generateTags(String fileName, String fileType, byte[] sampleHeaderBytes, String textSnippet) {
        Set<String> tags = new LinkedHashSet<>();
        String lowerName = (fileName != null) ? fileName.toLowerCase(Locale.ROOT) : "";
        String lowerType = (fileType != null) ? fileType.toLowerCase(Locale.ROOT) : "";
        String lowerSnippet = (textSnippet != null) ? textSnippet.toLowerCase(Locale.ROOT) : "";

        // 1. Log / System Event classification
        if (lowerName.endsWith(".log") || lowerName.endsWith(".txt") || lowerType.contains("text/plain")) {
            if (lowerSnippet.contains("error") || lowerSnippet.contains("warn") || lowerSnippet.contains("failed")
                    || lowerSnippet.contains("session") || lowerSnippet.contains("timestamp") || lowerSnippet.contains("ip")) {
                tags.add("LOG");
                tags.add("SERVER_EVENT");
            } else {
                tags.add("LOG");
            }
        }

        // 2. Image classification
        if (lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")
                || lowerName.endsWith(".gif") || lowerName.endsWith(".bmp") || lowerName.endsWith(".webp")
                || lowerName.endsWith(".tiff") || lowerType.startsWith("image/")) {
            tags.add("IMAGE");
            tags.add("VISUAL_FORENSIC");
        }

        // 3. Email classification
        if (lowerName.endsWith(".eml") || lowerName.endsWith(".msg")
                || lowerSnippet.contains("from:") || lowerSnippet.contains("subject:") || lowerSnippet.contains("to:")) {
            tags.add("EMAIL");
            tags.add("COMMUNICATION");
        }

        // 4. Network Capture classification
        if (lowerName.endsWith(".pcap") || lowerName.endsWith(".pcapng") || lowerName.endsWith(".cap")
                || lowerSnippet.contains("wireshark") || lowerSnippet.contains("tcp") || lowerSnippet.contains("packet")) {
            tags.add("NETWORK_CAPTURE");
            tags.add("TRAFFIC_FLOW");
        }

        // 5. Document classification
        if (lowerName.endsWith(".pdf") || lowerName.endsWith(".doc") || lowerName.endsWith(".docx")
                || lowerName.endsWith(".xlsx") || lowerName.endsWith(".csv") || lowerType.contains("pdf")
                || lowerType.contains("document") || lowerType.contains("sheet")) {
            tags.add("DOCUMENT");
            tags.add("RECORD");
        }

        // Default forensic fallback tag
        if (tags.isEmpty()) {
            tags.add("DIGITAL_EVIDENCE");
            tags.add("UNCLASSIFIED");
        }

        return String.join(", ", tags);
    }
}
