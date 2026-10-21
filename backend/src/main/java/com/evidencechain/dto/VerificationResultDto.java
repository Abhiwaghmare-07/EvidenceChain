package com.evidencechain.dto;

import java.time.LocalDateTime;

public class VerificationResultDto {

    private Long evidenceId;
    private String caseNumber;
    private String fileName;
    private String status; // "MATCH" or "TAMPERED"
    private boolean verified;
    private String expectedHash;
    private String actualHash;
    private Long blockIndex;
    private String blockHash;
    private boolean chainValid;
    private String chainValidationMessage;
    private String details;
    private String verifiedBy;
    private LocalDateTime verifiedAt;

    public VerificationResultDto() {
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Long evidenceId) {
        this.evidenceId = evidenceId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getExpectedHash() {
        return expectedHash;
    }

    public void setExpectedHash(String expectedHash) {
        this.expectedHash = expectedHash;
    }

    public String getActualHash() {
        return actualHash;
    }

    public void setActualHash(String actualHash) {
        this.actualHash = actualHash;
    }

    public Long getBlockIndex() {
        return blockIndex;
    }

    public void setBlockIndex(Long blockIndex) {
        this.blockIndex = blockIndex;
    }

    public String getBlockHash() {
        return blockHash;
    }

    public void setBlockHash(String blockHash) {
        this.blockHash = blockHash;
    }

    public boolean isChainValid() {
        return chainValid;
    }

    public void setChainValid(boolean chainValid) {
        this.chainValid = chainValid;
    }

    public String getChainValidationMessage() {
        return chainValidationMessage;
    }

    public void setChainValidationMessage(String chainValidationMessage) {
        this.chainValidationMessage = chainValidationMessage;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
