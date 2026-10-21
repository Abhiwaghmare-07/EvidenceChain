package com.evidencechain.dto;

import jakarta.validation.constraints.NotBlank;

public class TransferRequestDto {

    @NotBlank(message = "Target username is required")
    private String targetUsername;

    @NotBlank(message = "Transfer note or justification is required")
    private String transferNote;

    public TransferRequestDto() {
    }

    public TransferRequestDto(String targetUsername, String transferNote) {
        this.targetUsername = targetUsername;
        this.transferNote = transferNote;
    }

    public String getTargetUsername() {
        return targetUsername;
    }

    public void setTargetUsername(String targetUsername) {
        this.targetUsername = targetUsername;
    }

    public String getTransferNote() {
        return transferNote;
    }

    public void setTransferNote(String transferNote) {
        this.transferNote = transferNote;
    }
}
