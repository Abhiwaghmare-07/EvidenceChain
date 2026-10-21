# EvidenceChain: Comprehensive Viva & Oral Examination Guide

This guide is curated specifically for engineering students defending **EvidenceChain** in college or university project vivas. It explains the design trade-offs, theoretical justifications, and live demonstration techniques.

---

## 🎯 Master Summary in 60 Seconds
> *"EvidenceChain is an ISO/IEC 27037-compliant full-stack cybercrime forensic integrity platform. It eliminates the single point of failure in traditional law enforcement evidence lockers by combining an immutable custom SHA-256 blockchain ledger with real-time AI behavioral anomaly detection. We store physical files in an isolated disk store and record only 256-bit cryptographic fingerprints and pre-screening authenticity scores on our ledger. Our system features a modern React frontend for field investigators and judges, alongside a raw Servlet/JSP administration portal for court-admissible audit reports. In real-time, our hybrid AI engine detects exfiltration bursts and unusual off-hours activity using rule-based heuristics and Z-score statistical baselines, immediately locking compromised accounts."*

---

## 🏛 Top 15 Viva Questions & High-Scoring Answers

### 1. What problem does EvidenceChain solve in real-world criminal justice?
**Answer**:
"In real-world cybercrime investigations, digital evidence (disk images, packet captures, server logs) often passes through dozens of hands across multiple agencies before reaching trial. Traditional databases (like MySQL or Oracle) allow database administrators, rogue officers, or malware to alter evidence records without leaving an indelible trace. This results in evidence being thrown out of court due to 'broken chain of custody'. EvidenceChain cryptographically seals every action on an immutable blockchain ledger, making any unauthorized tampering mathematically obvious to a judge."

### 2. Why did you write your own blockchain instead of using Ethereum or Hyperledger?
**Answer**:
"There are three major academic and technical reasons:
1. **Zero Gas Fees & Sub-Millisecond Speed**: Real-time law enforcement logging cannot wait for 15-second block confirmation times or incur Ethereum gas costs.
2. **Data Privacy & Jurisdictional Control**: Evidence metadata should not be broadcast across thousands of unknown public validator nodes.
3. **No Heavy Container Overhead**: Unlike Hyperledger Fabric, which requires running 8+ Docker containers (orderers, peers, CouchDB, CA), our pure Java blockchain runs inside the JVM, provides deterministic mathematical verification, and can be evaluated line-by-line during this viva."

### 3. Explain how your block hash is computed.
**Answer**:
"We use standard NIST FIPS 180-4 SHA-256. The hash is calculated over the concatenation of seven critical fields:
`SHA-256(blockIndex + timestamp + evidenceId + fileHash + authenticityScore + investigatorId + previousHash)`
Because each block includes `previousHash`, changing even one single character in any historical block changes its hash, which breaks the `previousHash` pointer of the subsequent block. Our validation algorithm detects this cascading failure and immediately pinpoints the exact broken block index."

### 4. What is 'ISO/IEC 27037' and how does EvidenceChain comply with it?
**Answer**:
"ISO/IEC 27037 is the international standard for the identification, collection, acquisition, and preservation of digital evidence. It mandates that digital evidence must:
1. Maintain cryptographic integrity from the point of seizure.
2. Log an unbroken audit trail of every person who accessed, downloaded, or transferred the artifact.
3. Ensure reproducible verification by independent forensic experts.
EvidenceChain complies by recording every upload, view, download, verification, and transfer with timestamps, investigator IDs, and IP addresses."

### 5. Why do you store files on disk and not on the blockchain?
**Answer**:
"Blockchains are designed for state consistency, not bulk binary storage. Placing large files (such as 10 GB disk images or PCAPs) directly onto a blockchain causes severe 'blockchain bloat', degrades node memory, and makes replication impossible. By storing the raw file in `/storage` and committing only its irreversible SHA-256 hash to the ledger, we maintain $O(1)$ block size (a few hundred bytes) while retaining 100% cryptographic certainty that the file on disk has not been altered."

### 6. What is the Dual-Layer Fingerprint?
**Answer**:
"Layer 1 is the 256-bit cryptographic SHA-256 hash, which provides binary integrity.
Layer 2 is our heuristic pre-screening score (0 to 100). When an officer uploads a file, our pure Java heuristic engine analyzes:
- *File Header / Magic Bytes vs. Extension*: Detects executable malware masquerading as a `.png` or `.pdf`.
- *Temporal Consistency*: Detects manipulated file creation dates or timestamps set in the future.
- *Size Thresholds*: Detects empty or truncated network capture files.
Both the hash and authenticity score are permanently anchored on the blockchain."

### 7. How does the AI Anomaly Detection Engine work?
**Answer**:
"We deliberately avoided unexplainable 'black-box' deep learning models in favor of an explainable, auditable hybrid algorithm:
1. **Rule-Based Heuristics**: Immediate penalties for access between midnight and 5:00 AM (+35 pts), downloading more than 5 files within 10 minutes (+40 pts), and repeated verification failures (+45 pts).
2. **Statistical Gaussian Z-Score**: We calculate the user's running mean $\mu$ and standard deviation $\sigma$ of actions per hour. When an activity spike yields $Z = \frac{x - \mu}{\sigma} > 2.5$, the statistical anomaly penalty is applied.
If total risk reaches 70/100, the system automatically locks the account."

### 8. Why is explainability critical in forensic AI?
**Answer**:
"In a court of law, evidence derived from opaque machine learning models is frequently challenged under the Daubert or Frye legal standards because defense attorneys cannot cross-examine a neural network's weights. Because our AI relies on auditable rules and transparent Z-score statistics, forensic examiners can testify with mathematical clarity as to why an anomaly flag was raised."

### 9. How do you implement two separate security filter chains in Spring Security 6?
**Answer**:
"We define two `@Bean SecurityFilterChain` methods ordered with `@Order(1)` and `@Order(2)`:
- `@Order(1)` matches `/api/**`: It is stateless (`SessionCreationPolicy.STATELESS`), disables CSRF, and verifies Bearer tokens via `JwtAuthenticationFilter`.
- `@Order(2)` matches `/admin/**`: It is stateful (`SessionCreationPolicy.IF_REQUIRED`), enables sessions, uses standard form login (`/admin/login`), and redirects authenticated administrators to JSP views.
This completely prevents session leakage between the React SPA and the JSP Admin Portal."

### 10. How do raw Servlets work inside a modern Spring Boot application?
**Answer**:
"Spring Boot packages as a WAR with `tomcat-embed-jasper` and JSTL dependencies. We wrote two pure `HttpServlet` subclasses: `AdminLoginServlet` and `AuditReportServlet`. We register them using `ServletRegistrationBean` beans in `ServletConfig.java`, mapping them to `/admin/login` and `/admin/audit-report`. Inside their `doGet` methods, they interact with Spring-managed repositories, set request attributes, and forward to JSP files using `RequestDispatcher.forward()`."

### 11. What happens during the 'Simulate Tamper' demo?
**Answer**:
"When an administrator clicks 'Simulate Tamper', our `EvidenceService.simulateTamper(id)` method opens the physical file on disk in read-write binary mode (`RandomAccessFile`), reads the first byte, inverts its bits with XOR (`b ^ 0xFF`), and writes it back. When the investigator clicks 'Verify', the system re-calculates the SHA-256 hash over the disk file, compares it with the immutable hash stored in the blockchain block, detects a mismatch, logs a `TAMPER_SIMULATION` custody event, and triggers a live red banner."

### 12. How does the PDF Certificate generation work?
**Answer**:
"We use OpenPDF (an open-source fork of iText). When requested, `CertificateService` builds a formal judicial document with agency watermarks, case metadata, ledger block index, and cryptographic hashes. Additionally, it uses the Google ZXing library to generate a dynamic 2D QR matrix encoding the direct verification URL, and embeds the PNG image directly into the PDF before streaming the bytes to the client."

### 13. What is the difference between H2 file mode and MySQL mode?
**Answer**:
"By default, we run H2 in file persistence mode (`jdbc:h2:file:./data/evidencechain`). This requires zero setup or external installation. However, for enterprise scaling, we provide a Spring profile named `mysql` in `application-mysql.properties` and a complete DDL script in `schema.sql`. Switching requires only passing `--spring.profiles.active=mysql`."

### 14. What are the Phase 8 Optional Features and how are they implemented?
**Answer**:
"Phase 8 implements three advanced forensic privacy and intelligence capabilities:
1. **PII Auto-Redaction**: Scans evidentiary logs using regex to mask emails, phone numbers, government IDs, and credit cards (`[REDACTED_EMAIL]`, `[REDACTED_PHONE]`), allowing safe public court disclosure while preserving the original file hash on the blockchain.
2. **Smart Artifact Summary**: Parses text artifacts to extract network IP addresses, email communication channels, chronological timestamps, and high-frequency forensic keywords.
3. **Dynamic QR Code**: Generates a 2D matrix on judicial certificates linking directly to verification endpoints."

### 15. How did you test the application?
**Answer**:
"We wrote 19 comprehensive automated unit and integration tests using JUnit 5, Mockito, and Spring Boot Test (`@SpringBootTest`, `@AutoConfigureMockMvc`):
- `HashUtilTest`: Cryptographic consistency and collision resistance of SHA-256.
- `BlockchainServiceTest`: Genesis block minting, child block linkage, and pinpointing tampered blocks.
- `EvidenceLifecycleTest`: End-to-end upload, hash anchoring, custody transfer, and verification.
- `AnomalyDetectionServiceTest`: Night access, download bursts, and Z-score threshold lockouts.
- `AdminPortalTest`: Raw Servlet and JSP filter security integration.
- `ForensicTextAnalysisTest`: PII masking and smart entity extraction."

---

## 💡 Examiner Demonstration Quick-Card
When asked to show the code during viva, open these exact files:
1. **Blockchain Minting & Validation**: `backend/src/main/java/com/evidencechain/ledger/BlockchainService.java`
2. **Heuristic Pre-Screening**: `backend/src/main/java/com/evidencechain/ai/HeuristicFingerprintService.java`
3. **AI Anomaly & Z-Score**: `backend/src/main/java/com/evidencechain/ai/AnomalyDetectionService.java`
4. **Dual Security Filters**: `backend/src/main/java/com/evidencechain/security/SecurityConfig.java`
5. **Raw Servlets**: `backend/src/main/java/com/evidencechain/servlet/AuditReportServlet.java`
6. **PII Redaction & Summary**: `backend/src/main/java/com/evidencechain/service/ForensicTextAnalysisService.java`
