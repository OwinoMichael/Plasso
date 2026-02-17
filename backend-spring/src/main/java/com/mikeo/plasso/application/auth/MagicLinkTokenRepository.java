package com.mikeo.plasso.application.auth;

import com.mikeo.plasso.application.auth.model.magic.MagicLinkToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

// MagicLinkTokenRepository.java
public interface MagicLinkTokenRepository extends JpaRepository<MagicLinkToken, String> {
    Optional<MagicLinkToken> findByToken(String token);

    // Cleanup expired tokens
    @Modifying
    @Query("DELETE FROM MagicLinkToken t WHERE t.expiryTime < :now OR (t.used = true AND t.createdAt < :cutoff)")
    void deleteExpiredTokens(@Param("now") Instant now, @Param("cutoff") Instant cutoff);
}