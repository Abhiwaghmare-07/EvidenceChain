package com.evidencechain.repository;

import com.evidencechain.model.CustodyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustodyLogRepository extends JpaRepository<CustodyLog, Long> {
    List<CustodyLog> findByEvidenceIdOrderByTimestampDesc(Long evidenceId);
    List<CustodyLog> findByCaseNumberOrderByTimestampDesc(String caseNumber);
    List<CustodyLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<CustodyLog> findAllByOrderByTimestampDesc();
    long countByUserIdAndActionAndTimestampAfter(Long userId, com.evidencechain.model.CustodyAction action, LocalDateTime after);
}
