package com.evidencechain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_number", nullable = false, length = 100)
    private String caseNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false, length = 100)
    private String fileType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name = "stored_path", nullable = false, length = 500)
    private String storedPath;

    @Column(name = "authenticity_score", nullable = false)
    private Integer authenticityScore = 100;

    @Column(name = "heuristic_flags", length = 500)
    private String heuristicFlags;

    @Column(name = "auto_tags", length = 255)
    private String autoTags;

    @Column(name = "investigator_id", nullable = false, length = 50)
    private String investigatorId;

    @Column(name = "investigator_name", length = 100)
    private String investigatorName;

    @Column(nullable = false)
    private String location;

    @Column(name = "collection_timestamp", nullable = false)
    private LocalDateTime collectionTimestamp;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column(name = "current_owner_id")
    private Long currentOwnerId;

    @Column(name = "is_tampered", nullable = false)
    private boolean isTampered = false;

    public Evidence() {
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

    public String getStoredPath() {
        return storedPath;
    }

    public void setStoredPath(String storedPath) {
        this.storedPath = storedPath;
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

    public boolean isTampered() {
        return isTampered;
    }

    public void setTampered(boolean tampered) {
        isTampered = tampered;
    }
}
