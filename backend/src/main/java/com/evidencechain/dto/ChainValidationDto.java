package com.evidencechain.dto;

import java.time.LocalDateTime;

public class ChainValidationDto {

    private boolean valid;
    private int totalBlocks;
    private Long brokenBlockIndex;
    private String reason;
    private String latestBlockHash;
    private LocalDateTime checkedAt;

    public ChainValidationDto() {
    }

    public ChainValidationDto(boolean valid, int totalBlocks, Long brokenBlockIndex, String reason, String latestBlockHash) {
        this.valid = valid;
        this.totalBlocks = totalBlocks;
        this.brokenBlockIndex = brokenBlockIndex;
        this.reason = reason;
        this.latestBlockHash = latestBlockHash;
        this.checkedAt = LocalDateTime.now();
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public int getTotalBlocks() {
        return totalBlocks;
    }

    public void setTotalBlocks(int totalBlocks) {
        this.totalBlocks = totalBlocks;
    }

    public Long getBrokenBlockIndex() {
        return brokenBlockIndex;
    }

    public void setBrokenBlockIndex(Long brokenBlockIndex) {
        this.brokenBlockIndex = brokenBlockIndex;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getLatestBlockHash() {
        return latestBlockHash;
    }

    public void setLatestBlockHash(String latestBlockHash) {
        this.latestBlockHash = latestBlockHash;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }
}
