package com.evidencechain.controller;

import com.evidencechain.dto.ChainValidationDto;
import com.evidencechain.ledger.BlockchainService;
import com.evidencechain.model.Block;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
public class LedgerController {

    private final BlockchainService blockchainService;

    public LedgerController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    @GetMapping("/blocks")
    public ResponseEntity<List<Block>> getAllBlocks() {
        return ResponseEntity.ok(blockchainService.getAllBlocks());
    }

    @GetMapping("/validate")
    public ResponseEntity<ChainValidationDto> validateBlockchain() {
        return ResponseEntity.ok(blockchainService.validateChain());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getLedgerStats() {
        List<Block> blocks = blockchainService.getAllBlocks();
        ChainValidationDto validation = blockchainService.validateChain();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBlocks", blocks.size());
        stats.put("isValid", validation.isValid());
        stats.put("latestBlockHash", validation.getLatestBlockHash());
        stats.put("brokenBlockIndex", validation.getBrokenBlockIndex());
        stats.put("reason", validation.getReason());
        if (!blocks.isEmpty()) {
            stats.put("genesisBlockHash", blocks.get(0).getBlockHash());
        }

        return ResponseEntity.ok(stats);
    }
}
