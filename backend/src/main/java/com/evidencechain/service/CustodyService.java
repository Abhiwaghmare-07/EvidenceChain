package com.evidencechain.service;

import com.evidencechain.model.*;
import com.evidencechain.repository.CustodyLogRepository;
import com.evidencechain.repository.EvidenceRepository;
import com.evidencechain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustodyService {

    private static final Logger logger = LoggerFactory.getLogger(CustodyService.class);

    private final CustodyLogRepository custodyLogRepository;
    private final EvidenceRepository evidenceRepository;
    private final UserRepository userRepository;

    public CustodyService(CustodyLogRepository custodyLogRepository,
                          EvidenceRepository evidenceRepository,
                          UserRepository userRepository) {
        this.custodyLogRepository = custodyLogRepository;
        this.evidenceRepository = evidenceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CustodyLog logAction(Long evidenceId, String caseNumber, Long userId, String username,
                                String userRole, CustodyAction action, String ipAddress, String details) {
        CustodyLog log = new CustodyLog(evidenceId, caseNumber, userId, username, userRole, action, ipAddress, details);
        return custodyLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<CustodyLog> getCustodyLogsByEvidence(Long evidenceId) {
        return custodyLogRepository.findByEvidenceIdOrderByTimestampDesc(evidenceId);
    }

    @Transactional(readOnly = true)
    public List<CustodyLog> getCustodyLogsByCase(String caseNumber) {
        return custodyLogRepository.findByCaseNumberOrderByTimestampDesc(caseNumber);
    }

    @Transactional(readOnly = true)
    public List<CustodyLog> getRecentCustodyLogs() {
        return custodyLogRepository.findAllByOrderByTimestampDesc();
    }

    @Transactional
    public Evidence transferCustody(Long evidenceId, String targetUsername, String note, User currentUser, String ipAddress) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found with id: " + evidenceId));

        // Ensure caller has authority (current owner, or admin)
        if (currentUser.getRole() != Role.ADMIN && !ObjectsEquals(evidence.getCurrentOwnerId(), currentUser.getId())) {
            throw new IllegalArgumentException("Unauthorized: Only the current custodian or an Administrator can transfer evidence custody.");
        }

        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("Target custodian user not found: " + targetUsername));

        Long oldOwnerId = evidence.getCurrentOwnerId();
        String oldOwnerName = oldOwnerId != null ?
                userRepository.findById(oldOwnerId).map(User::getFullName).orElse("Officer #" + oldOwnerId) : "Initial Intake";

        evidence.setCurrentOwnerId(targetUser.getId());
        Evidence updated = evidenceRepository.save(evidence);

        String transferDetails = String.format("Custody transfer from '%s' (%s) to '%s' (%s - %s). Reason: %s",
                oldOwnerName, currentUser.getRole().name(),
                targetUser.getFullName(), targetUser.getRole().name(), targetUser.getAgency(),
                note);

        CustodyLog log = new CustodyLog(
                evidence.getId(),
                evidence.getCaseNumber(),
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getRole().name(),
                CustodyAction.TRANSFER,
                ipAddress,
                transferDetails
        );
        custodyLogRepository.save(log);

        logger.info("Evidence #{} transferred to user {}: {}", evidenceId, targetUsername, transferDetails);
        return updated;
    }

    private boolean ObjectsEquals(Object a, Object b) {
        return a == b || (a != null && a.equals(b));
    }
}
