package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Ban;
import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.BanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SuspensionService {

    private final BanRepository banRepository;

    @Autowired
    public SuspensionService(BanRepository banRepository){
        this.banRepository = banRepository;
    }

    public void SaveBanRequest(Ban ban){
        banRepository.save(ban);
    }
    public void RemoveBan(Ban ban){
        banRepository.delete(ban);
    }

    public Ban isUserBanned(User user){
        Optional<Ban> ban = banRepository.findBanByUser(user);
        return ban.orElse(null);
    }
    public Ban findBanByUser(User user){
        return banRepository.findBanByUser(user).orElse(null);
    }

}
