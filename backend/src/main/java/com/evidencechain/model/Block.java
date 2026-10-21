package com.evidencechain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ledger_blocks")
public class Block {

    @Id
    @Column(name = "block_index", nullable = false)
    private Long blockIndex;

    @Column(nullable = false)
    private Long timestamp;

    @Column(name = "evidence_id")
    private Long evidenceId;

    @Column(name = "file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name = "authenticity_score", nullable = false)
    private Integer authenticityScore;

    @Column(name = "investigator_id", nullable = false, length = 50)
    private String investigatorId;

    @Column(name = "previous_hash", nullable = false, length = 64)
    private String previousHash;

    @Column(name = "block_hash", nullable = false, length = 64)
    private String blockHash;

    public Block() {
    }

    public Block(Long blockIndex, Long timestamp, Long evidenceId, String fileHash, Integer authenticityScore, String investigatorId, String previousHash, String blockHash) {
        this.blockIndex = blockIndex;
        this.timestamp = timestamp;
        this.evidenceId = evidenceId;
        this.fileHash = fileHash;
        this.authenticityScore = authenticityScore;
        this.investigatorId = investigatorId;
        this.previousHash = previousHash;
        this.blockHash = blockHash;
    }

    public Long getBlockIndex() {
        return blockIndex;
    }

    public void setBlockIndex(Long blockIndex) {
        this.blockIndex = blockIndex;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Long evidenceId) {
        this.evidenceId = evidenceId;
    }

    public String getFileHash() {
        return fileHash;
    }

    public void setFileHash(String fileHash) {
        this.fileHash = fileHash;
    }

    public Integer getAuthenticityScore() {
        return authenticityScore;
    }

    public void setAuthenticityScore(Integer authenticityScore) {
        this.authenticityScore = authenticityScore;
    }

    public String getInvestigatorId() {
        return investigatorId;
    }

    public void setInvestigatorId(String investigatorId) {
        this.investigatorId = investigatorId;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getBlockHash() {
        return blockHash;
    }

    public void setBlockHash(String blockHash) {
        this.blockHash = blockHash;
    }
}
