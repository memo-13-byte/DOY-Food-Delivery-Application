package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoExampleEntity;
import com.pingfloyd.doy.dto.DtoExampleEntityIU;

import java.util.List;

public interface IExampleEntityController {
    public List<DtoExampleEntity> getExampleEntities();
    public void postExampleEntity(DtoExampleEntityIU dto);
}
