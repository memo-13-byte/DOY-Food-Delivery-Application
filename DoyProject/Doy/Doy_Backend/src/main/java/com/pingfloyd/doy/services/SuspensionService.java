package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Ban;
import com.pingfloyd.doy.repositories.BanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
