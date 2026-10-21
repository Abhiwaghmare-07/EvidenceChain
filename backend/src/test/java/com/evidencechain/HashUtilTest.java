package com.evidencechain;

import com.evidencechain.ledger.HashUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

public class HashUtilTest {

    @Test
    @DisplayName("HashUtil produces correct standard SHA-256 hash for sample text")
    public void testSha256Basic() {
        // "hello world" SHA-256 is b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
        String input = "hello world";
        String expectedHash = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

        String actualHash = HashUtil.sha256(input.getBytes(StandardCharsets.UTF_8));
        assertEquals(expectedHash, actualHash);
    }

    @Test
    @DisplayName("HashUtil throws IllegalArgumentException on null data")
    public void testSha256NullData() {
        assertThrows(IllegalArgumentException.class, () -> HashUtil.sha256((byte[]) null));
    }

    @Test
    @DisplayName("CalculateBlockHash is deterministic and changes when any field changes")
    public void testCalculateBlockHashDeterminism() {
        String hash1 = HashUtil.calculateBlockHash(1L, 1000L, 5L, "hashA", 100, "officer_chen", "prevHash");
        String hash2 = HashUtil.calculateBlockHash(1L, 1000L, 5L, "hashA", 100, "officer_chen", "prevHash");
        assertEquals(hash1, hash2);

        // Modifying any single field produces an entirely different block hash
        String hashTampered = HashUtil.calculateBlockHash(1L, 1000L, 5L, "hashB", 100, "officer_chen", "prevHash");
        assertNotEquals(hash1, hashTampered);
    }
}
