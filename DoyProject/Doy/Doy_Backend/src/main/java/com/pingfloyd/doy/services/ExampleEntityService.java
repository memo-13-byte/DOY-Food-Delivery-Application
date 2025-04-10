package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoExampleEntity;
import com.pingfloyd.doy.dto.DtoExampleEntityIU;
import com.pingfloyd.doy.repositories.ExampleEntityRepository;
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
