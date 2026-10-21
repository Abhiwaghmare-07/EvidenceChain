package com.evidencechain.dto;

import com.evidencechain.model.Evidence;

import java.time.LocalDateTime;

public class EvidenceResponse {

    private Long id;
    private String caseNumber;
    private String title;
    private String description;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String fileHash;
    private Integer authenticityScore;
    private String heuristicFlags;
    private String autoTags;
    private String investigatorId;
    private String investigatorName;
    private String location;
    private LocalDateTime collectionTimestamp;
    private LocalDateTime uploadedAt;
    private Long currentOwnerId;
    private String currentOwnerName;
    private boolean isTampered;
    private Long blockIndex;
    private String blockHash;

    public EvidenceResponse() {
    }

    public static EvidenceResponse fromEntity(Evidence evidence, Long blockIndex, String blockHash, String currentOwnerName) {
        EvidenceResponse dto = new EvidenceResponse();
        dto.setId(evidence.getId());
        dto.setCaseNumber(evidence.getCaseNumber());
        dto.setTitle(evidence.getTitle());
        dto.setDescription(evidence.getDescription());
        dto.setFileName(evidence.getFileName());
        dto.setFileType(evidence.getFileType());
        dto.setFileSize(evidence.getFileSize());
        dto.setFileHash(evidence.getFileHash());
        dto.setAuthenticityScore(evidence.getAuthenticityScore());
        dto.setHeuristicFlags(evidence.getHeuristicFlags());
        dto.setAutoTags(evidence.getAutoTags());
        dto.setInvestigatorId(evidence.getInvestigatorId());
        dto.setInvestigatorName(evidence.getInvestigatorName());
        dto.setLocation(evidence.getLocation());
        dto.setCollectionTimestamp(evidence.getCollectionTimestamp());
        dto.setUploadedAt(evidence.getUploadedAt());
        dto.setCurrentOwnerId(evidence.getCurrentOwnerId());
        dto.setCurrentOwnerName(currentOwnerName);
        dto.setTampered(evidence.isTampered());
        dto.setBlockIndex(blockIndex);
        dto.setBlockHash(blockHash);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
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

    public String getHeuristicFlags() {
        return heuristicFlags;
    }

    public void setHeuristicFlags(String heuristicFlags) {
        this.heuristicFlags = heuristicFlags;
    }

    public String getAutoTags() {
        return autoTags;
    }

    public void setAutoTags(String autoTags) {
        this.autoTags = autoTags;
    }

    public String getInvestigatorId() {
        return investigatorId;
    }

    public void setInvestigatorId(String investigatorId) {
        this.investigatorId = investigatorId;
    }

    public String getInvestigatorName() {
        return investigatorName;
    }

    public void setInvestigatorName(String investigatorName) {
        this.investigatorName = investigatorName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getCollectionTimestamp() {
        return collectionTimestamp;
    }

    public void setCollectionTimestamp(LocalDateTime collectionTimestamp) {
        this.collectionTimestamp = collectionTimestamp;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Long getCurrentOwnerId() {
        return currentOwnerId;
    }

    public void setCurrentOwnerId(Long currentOwnerId) {
        this.currentOwnerId = currentOwnerId;
    }

    public String getCurrentOwnerName() {
        return currentOwnerName;
    }

    public void setCurrentOwnerName(String currentOwnerName) {
        this.currentOwnerName = currentOwnerName;
    }

    public boolean isTampered() {
        return isTampered;
    }

    public void setTampered(boolean tampered) {
        isTampered = tampered;
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
}
