package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoExampleEntity;
import com.pingfloyd.doy.dto.DtoExampleEntityIU;

import java.util.List;

public interface IExampleEntityService {
    public List<DtoExampleEntity> getExampleEntities();
    public void postExampleEntity(DtoExampleEntityIU dto);
}
