package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.ConfirmationToken;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.repositories.ConfirmationTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ConfirmationTokenService {
    private final ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    public ConfirmationTokenService(ConfirmationTokenRepository confirmationTokenRepository){
        this.confirmationTokenRepository = confirmationTokenRepository;
    }

    public void saveConfirmationToken(ConfirmationToken token){
        confirmationTokenRepository.save(token);
    }
    public Optional<ConfirmationToken> getToken(String token){
        return confirmationTokenRepository.findConfirmationTokenByToken(token);
    }

    public ConfirmationToken GenerateToken(User user , int validTime){
        String tokenId = UUID.randomUUID().toString();
        ConfirmationToken token  = new ConfirmationToken(
                tokenId,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(validTime),
                false,
                user
        );
        confirmationTokenRepository.save(token);
        return token;
    }

    @Transactional
    public User confirmToken(String token) {
        ConfirmationToken confirmationToken = getToken(token)
                .orElseThrow(() -> new IllegalStateException("Token not found"));
        LocalDateTime expiredAt = confirmationToken.getExpiredAt();
        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expired");
        }
        confirmationToken.setConfirmed(true); // Mark token as confirmed
        return confirmationToken.getUser();
    }
}
