package com.evidencechain.repository;

import com.evidencechain.model.UserActivityStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserActivityStatRepository extends JpaRepository<UserActivityStat, Long> {
    Optional<UserActivityStat> findByUserIdAndHourBucket(Long userId, String hourBucket);
    List<UserActivityStat> findByUserId(Long userId);
}
