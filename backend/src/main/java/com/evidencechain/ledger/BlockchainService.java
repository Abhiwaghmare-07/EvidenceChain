package com.evidencechain.ledger;

import com.evidencechain.dto.ChainValidationDto;
import com.evidencechain.model.Block;
import com.evidencechain.repository.BlockRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Custom Blockchain Ledger Service.
 * Implements cryptographic immutability and provenance tracking for evidence files.
 * Every piece of cybercrime evidence uploaded creates an immutable block linked
 * cryptographically to the preceding block via SHA-256 digests.
 */
@Service
public class BlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainService.class);

    public static final String GENESIS_PREV_HASH = "0";
    public static final String GENESIS_FILE_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
    public static final long GENESIS_TIMESTAMP = 1704067200000L; // 2024-01-01T00:00:00Z

    private final BlockRepository blockRepository;

    public BlockchainService(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    /**
     * Initializes the Genesis Block (Index 0) on application startup if the ledger is empty.
     */
    @PostConstruct
    @Transactional
    public synchronized void initGenesisBlock() {
        if (blockRepository.count() == 0) {
            String genesisHash = HashUtil.calculateBlockHash(
                    0L,
                    GENESIS_TIMESTAMP,
                    0L,
                    GENESIS_FILE_HASH,
                    100,
                    "SYSTEM_GENESIS",
                    GENESIS_PREV_HASH
            );
            Block genesisBlock = new Block(
                    0L,
                    GENESIS_TIMESTAMP,
                    0L,
                    GENESIS_FILE_HASH,
                    100,
                    "SYSTEM_GENESIS",
                    GENESIS_PREV_HASH,
                    genesisHash
            );
            blockRepository.save(genesisBlock);
            logger.info("Genesis block minted successfully: Index 0, Hash: {}", genesisHash);
        }
    }

    /**
     * Mints a new block for an uploaded evidence item.
     * The new block points to the hash of the latest block in the database,
     * maintaining the unforgeable cryptographic chain.
     */
    @Transactional
    public synchronized Block mintBlock(Long evidenceId, String fileHash, Integer authenticityScore, String investigatorId) {
        Block latestBlock = blockRepository.findTopByOrderByBlockIndexDesc()
                .orElseGet(() -> {
                    initGenesisBlock();
                    return blockRepository.findTopByOrderByBlockIndexDesc().orElseThrow();
                });

        long newIndex = latestBlock.getBlockIndex() + 1;
        long timestamp = System.currentTimeMillis();
        String previousHash = latestBlock.getBlockHash();

        String blockHash = HashUtil.calculateBlockHash(
                newIndex,
                timestamp,
                evidenceId,
                fileHash,
                authenticityScore,
                investigatorId,
                previousHash
        );

        Block newBlock = new Block(
                newIndex,
                timestamp,
                evidenceId,
                fileHash,
                authenticityScore,
                investigatorId,
                previousHash,
                blockHash
        );

        Block saved = blockRepository.save(newBlock);
        logger.info("Minted Block #{}: EvidenceId={}, Hash={}, PrevHash={}", newIndex, evidenceId, blockHash, previousHash);
        return saved;
    }

    /**
     * Full chain validation algorithm:
     * 1. Validates the Genesis block's previous hash ("0") and internal SHA-256 integrity.
     * 2. Iterates consecutively through blocks 1 to N, verifying:
     *    a. Sequence index continuity (i == previous + 1).
     *    b. Previous-hash linkage (block[i].previousHash == block[i-1].blockHash).
     *    c. Block hash integrity (re-calculating SHA-256 over all fields of block[i]).
     *
     * Reports the exact block index of the first broken link or data tamper.
     */
    @Transactional(readOnly = true)
    public ChainValidationDto validateChain() {
        List<Block> blocks = blockRepository.findAllByOrderByBlockIndexAsc();
        if (blocks.isEmpty()) {
            return new ChainValidationDto(false, 0, null, "Ledger is empty, no genesis block found", null);
        }

        // 1. Validate Genesis Block
        Block genesis = blocks.get(0);
        if (!GENESIS_PREV_HASH.equals(genesis.getPreviousHash())) {
            return new ChainValidationDto(false, blocks.size(), 0L,
                    "Genesis block previous hash is corrupted. Expected '0' but got: " + genesis.getPreviousHash(),
                    genesis.getBlockHash());
        }

        String recalculatedGenesis = HashUtil.calculateBlockHash(
                genesis.getBlockIndex(),
                genesis.getTimestamp(),
                genesis.getEvidenceId(),
                genesis.getFileHash(),
                genesis.getAuthenticityScore(),
                genesis.getInvestigatorId(),
                genesis.getPreviousHash()
        );

        if (!recalculatedGenesis.equals(genesis.getBlockHash())) {
            return new ChainValidationDto(false, blocks.size(), 0L,
                    "Genesis block payload tampered. Computed hash does not match stored block hash.",
                    genesis.getBlockHash());
        }

        // 2. Validate all chained blocks
        for (int i = 1; i < blocks.size(); i++) {
            Block prevBlock = blocks.get(i - 1);
            Block currentBlock = blocks.get(i);

            // Verify sequential index
            if (currentBlock.getBlockIndex() != i) {
                return new ChainValidationDto(false, blocks.size(), currentBlock.getBlockIndex(),
                        String.format("Block index sequence error at position %d: found index %d", i, currentBlock.getBlockIndex()),
                        currentBlock.getBlockHash());
            }

            // Verify previous hash pointer
            if (!currentBlock.getPreviousHash().equals(prevBlock.getBlockHash())) {
                return new ChainValidationDto(false, blocks.size(), currentBlock.getBlockIndex(),
                        String.format("Broken cryptographic chain at Block #%d: previousHash does not match Block #%d blockHash",
                                currentBlock.getBlockIndex(), prevBlock.getBlockIndex()),
                        currentBlock.getBlockHash());
            }

            // Verify internal field hash integrity
            String calculatedCurrent = HashUtil.calculateBlockHash(
                    currentBlock.getBlockIndex(),
                    currentBlock.getTimestamp(),
                    currentBlock.getEvidenceId(),
                    currentBlock.getFileHash(),
                    currentBlock.getAuthenticityScore(),
                    currentBlock.getInvestigatorId(),
                    currentBlock.getPreviousHash()
            );

            if (!calculatedCurrent.equals(currentBlock.getBlockHash())) {
                return new ChainValidationDto(false, blocks.size(), currentBlock.getBlockIndex(),
                        String.format("Data tamper detected in Block #%d: stored hash (%s) does not match recalculated hash (%s)",
                                currentBlock.getBlockIndex(), currentBlock.getBlockHash(), calculatedCurrent),
                        currentBlock.getBlockHash());
            }
        }

        Block latest = blocks.get(blocks.size() - 1);
        return new ChainValidationDto(true, blocks.size(), null,
                "Blockchain integrity fully verified across all nodes. All block hashes and chain links are valid.",
                latest.getBlockHash());
    }

    public List<Block> getAllBlocks() {
        return blockRepository.findAllByOrderByBlockIndexAsc();
    }

    public List<Block> getBlocksDesc() {
        return blockRepository.findAllByOrderByBlockIndexDesc();
    }

    public Optional<Block> getBlockByEvidenceId(Long evidenceId) {
        return blockRepository.findByEvidenceId(evidenceId);
    }
}
