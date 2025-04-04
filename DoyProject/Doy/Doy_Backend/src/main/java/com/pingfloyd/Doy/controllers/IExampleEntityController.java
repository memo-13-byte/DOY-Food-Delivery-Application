package com.pingfloyd.Doy.controllers;

import com.pingfloyd.Doy.dto.DtoExampleEntity;
import com.pingfloyd.Doy.dto.DtoExampleEntityIU;

import java.util.List;

public interface IExampleEntityController {
    public List<DtoExampleEntity> getExampleEntities();
    public void postExampleEntity(DtoExampleEntityIU dto);
}
