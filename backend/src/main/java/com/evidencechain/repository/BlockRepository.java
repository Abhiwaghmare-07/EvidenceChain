package com.evidencechain.repository;

import com.evidencechain.model.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findTopByOrderByBlockIndexDesc();
    Optional<Block> findByEvidenceId(Long evidenceId);
    Optional<Block> findByFileHash(String fileHash);
    List<Block> findAllByOrderByBlockIndexAsc();
    List<Block> findAllByOrderByBlockIndexDesc();
}
