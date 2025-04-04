package com.pingfloyd.Doy.services;

import com.pingfloyd.Doy.dto.DtoExampleEntity;
import com.pingfloyd.Doy.dto.DtoExampleEntityIU;

import java.util.List;

public interface IExampleEntityService {
    public List<DtoExampleEntity> getExampleEntities();
    public void postExampleEntity(DtoExampleEntityIU dto);
}
