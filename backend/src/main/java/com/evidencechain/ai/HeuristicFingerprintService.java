package com.evidencechain.ai;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Heuristic Pre-Screening Service.
 * Evaluates dual-layer authenticity score (0-100) by inspecting file magic bytes,
 * extension consistency, and temporal metadata integrity without external ML.
 */
@Service
public class HeuristicFingerprintService {

    public static class FingerprintResult {
        private final int authenticityScore;
        private final String heuristicFlags;

        public FingerprintResult(int authenticityScore, String heuristicFlags) {
            this.authenticityScore = authenticityScore;
            this.heuristicFlags = heuristicFlags;
        }

        public int getAuthenticityScore() {
            return authenticityScore;
        }

        public String getHeuristicFlags() {
            return heuristicFlags;
        }
    }

    /**
     * Conducts heuristic pre-screening over file bytes, filename, and collection timestamp.
     */
    public FingerprintResult evaluate(String fileName, byte[] headerBytes, long fileSize, LocalDateTime collectionTime) {
        int score = 100;
        List<String> flags = new ArrayList<>();
        String lowerName = (fileName != null) ? fileName.toLowerCase(Locale.ROOT) : "";

        // 1. Check file size anomalies
        if (fileSize <= 0) {
            score -= 50;
            flags.add("CRITICAL_ANOMALY: Empty or zero-byte file detected");
        } else if (fileSize < 16) {
            score -= 30;
            flags.add("WARNING: File size abnormally small (< 16 bytes)");
        }

        // 2. Magic byte header verification against declared file extension
        if (headerBytes != null && headerBytes.length >= 4) {
            if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
                if (!matchesJpeg(headerBytes)) {
                    score -= 40;
                    flags.add("MISMATCH: JPEG extension declared but magic bytes (FF D8 FF) missing");
                }
            } else if (lowerName.endsWith(".png")) {
                if (!matchesPng(headerBytes)) {
                    score -= 40;
                    flags.add("MISMATCH: PNG extension declared but PNG header missing");
                }
            } else if (lowerName.endsWith(".pdf")) {
                if (!matchesPdf(headerBytes)) {
                    score -= 40;
                    flags.add("MISMATCH: PDF extension declared but '%PDF' magic signature missing");
                }
            } else if (lowerName.endsWith(".docx") || lowerName.endsWith(".xlsx") || lowerName.endsWith(".zip")) {
                if (!matchesZip(headerBytes)) {
                    score -= 35;
                    flags.add("MISMATCH: ZIP/Office container declared but 'PK..' header missing");
                }
            } else if (lowerName.endsWith(".pcap") || lowerName.endsWith(".pcapng")) {
                if (!matchesPcap(headerBytes)) {
                    score -= 35;
                    flags.add("MISMATCH: PCAP capture declared but PCAP magic header missing");
                }
            }
        }

        // 3. Temporal anomaly check
        LocalDateTime now = LocalDateTime.now();
        if (collectionTime != null) {
            if (collectionTime.isAfter(now.plusMinutes(5))) {
                score -= 30;
                flags.add("TEMPORAL_ANOMALY: Collection timestamp is in the future");
            } else if (collectionTime.isBefore(now.minusYears(15))) {
                score -= 15;
                flags.add("TEMPORAL_ANOMALY: Collection timestamp exceeds 15-year archival window");
            }
        } else {
            score -= 20;
            flags.add("WARNING: No collection timestamp declared by investigator");
        }

        // Clamp authenticity score between 0 and 100
        int finalScore = Math.max(0, Math.min(100, score));

        if (flags.isEmpty()) {
            flags.add("VERIFIED_CONSISTENT: Pre-screening detected no header or temporal anomalies");
        }

        return new FingerprintResult(finalScore, String.join("; ", flags));
    }

    private boolean matchesJpeg(byte[] b) {
        return b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
    }

    private boolean matchesPng(byte[] b) {
        return b.length >= 4 && (b[0] & 0xFF) == 0x89 && (b[1] & 0xFF) == 0x50 && (b[2] & 0xFF) == 0x4E && (b[3] & 0xFF) == 0x47;
    }

    private boolean matchesPdf(byte[] b) {
        return b.length >= 4 && (b[0] & 0xFF) == 0x25 && (b[1] & 0xFF) == 0x50 && (b[2] & 0xFF) == 0x44 && (b[3] & 0xFF) == 0x46; // %PDF
    }

    private boolean matchesZip(byte[] b) {
        return b.length >= 4 && (b[0] & 0xFF) == 0x50 && (b[1] & 0xFF) == 0x4B && (b[2] & 0xFF) == 0x03 && (b[3] & 0xFF) == 0x04; // PK..
    }

    private boolean matchesPcap(byte[] b) {
        if (b.length < 4) return false;
        // Standard PCAP microsecond: d4 c3 b2 a1 or a1 b2 c3 d4; PCAPNG: 0a 0d 0d 0a
        boolean standardPcap = ((b[0] & 0xFF) == 0xD4 && (b[1] & 0xFF) == 0xC3 && (b[2] & 0xFF) == 0xB2 && (b[3] & 0xFF) == 0xA1)
                || ((b[0] & 0xFF) == 0xA1 && (b[1] & 0xFF) == 0xB2 && (b[2] & 0xFF) == 0xC3 && (b[3] & 0xFF) == 0xD4);
        boolean pcapNg = (b[0] & 0xFF) == 0x0A && (b[1] & 0xFF) == 0x0D && (b[2] & 0xFF) == 0x0D && (b[3] & 0xFF) == 0x0A;
        return standardPcap || pcapNg;
    }
}
