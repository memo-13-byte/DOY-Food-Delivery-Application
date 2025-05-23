package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.services.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/district")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DistrictController {
    private final DistrictService districtService;

    @Autowired
    public DistrictController(DistrictService districtService){
        this.districtService = districtService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> GetAllCities(){
        return ResponseEntity.ok(districtService.GetAllCities());
    }
    @GetMapping("/{city}")
    public ResponseEntity<List<String>> GetAllDistrictsByCity(@PathVariable(name = "city") String city ){
        return ResponseEntity.ok(districtService.GetAllDistrictByCity(city));
    }








}
