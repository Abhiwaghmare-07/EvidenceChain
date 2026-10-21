package com.evidencechain.repository;

import com.evidencechain.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByCaseNumber(String caseNumber);
    List<Evidence> findByInvestigatorId(String investigatorId);
    List<Evidence> findByCurrentOwnerId(Long currentOwnerId);
    Optional<Evidence> findByFileHash(String fileHash);
    List<Evidence> findAllByOrderByUploadedAtDesc();
}
