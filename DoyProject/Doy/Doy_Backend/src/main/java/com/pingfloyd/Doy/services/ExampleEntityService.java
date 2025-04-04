package com.pingfloyd.Doy.services;

import com.pingfloyd.Doy.dto.DtoExampleEntity;
import com.pingfloyd.Doy.dto.DtoExampleEntityIU;
import com.pingfloyd.Doy.repositories.ExampleEntityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExampleEntityService implements IExampleEntityService {
    ExampleEntityRepository repository;

    @Override
    public List<DtoExampleEntity> getExampleEntities() {
        return null;
    }

    @Override
    public void postExampleEntity(DtoExampleEntityIU dto) {

    }
}
