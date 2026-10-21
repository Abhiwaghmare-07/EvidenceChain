package com.evidencechain.repository;

import com.evidencechain.model.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityAlertRepository extends JpaRepository<SecurityAlert, Long> {
    List<SecurityAlert> findAllByOrderByTimestampDesc();
    List<SecurityAlert> findByUserIdOrderByTimestampDesc(Long userId);
    List<SecurityAlert> findByResolvedFalseOrderByTimestampDesc();
}
