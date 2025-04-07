package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoExampleEntity;
import com.pingfloyd.doy.dto.DtoExampleEntityIU;
import com.pingfloyd.doy.services.ExampleEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping(path = "/api/example-entity")
public class ExampleEntityController implements IExampleEntityController{
    @Autowired
    ExampleEntityService service; //automatically detect the service class

    @Override
    @GetMapping(path = "/list")
    public List<DtoExampleEntity> getExampleEntities() {
        return service.getExampleEntities();
    }

    @Override
    @PostMapping(path = "/post")
    public void postExampleEntity(DtoExampleEntityIU dto) {
        service.postExampleEntity(dto);
    }
}
