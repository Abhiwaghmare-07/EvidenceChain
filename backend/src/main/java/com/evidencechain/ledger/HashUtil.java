package com.evidencechain.ledger;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility for cryptographic SHA-256 calculations used in evidence verification
 * and blockchain block hashing.
 */
public final class HashUtil {

    private HashUtil() {
    }

    /**
     * Computes the SHA-256 hex digest for a given byte array.
     */
    public static String sha256(byte[] data) {
        if (data == null) {
            throw new IllegalArgumentException("Data cannot be null for hashing");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data);
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Computes SHA-256 hex digest from an InputStream efficiently with a 8KB buffer.
     */
    public static String sha256(InputStream inputStream) {
        if (inputStream == null) {
            throw new IllegalArgumentException("InputStream cannot be null for hashing");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
            return bytesToHex(digest.digest());
        } catch (Exception e) {
            throw new RuntimeException("Error computing SHA-256 hash from stream", e);
        }
    }

    /**
     * Ledger block hash calculation:
     * Hashes all immutable fields together: index, timestamp, evidenceId, fileHash,
     * authenticityScore, investigatorId, and previousHash.
     * Any change to any of these fields in the block immediately invalidates the block hash.
     */
    public static String calculateBlockHash(Long blockIndex, Long timestamp, Long evidenceId,
                                            String fileHash, Integer authenticityScore,
                                            String investigatorId, String previousHash) {
        String payload = String.format("%d|%d|%d|%s|%d|%s|%s",
                blockIndex != null ? blockIndex : 0L,
                timestamp != null ? timestamp : 0L,
                evidenceId != null ? evidenceId : 0L,
                fileHash != null ? fileHash : "",
                authenticityScore != null ? authenticityScore : 0,
                investigatorId != null ? investigatorId : "",
                previousHash != null ? previousHash : "0"
        );
        return sha256(payload.getBytes(StandardCharsets.UTF_8));
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
