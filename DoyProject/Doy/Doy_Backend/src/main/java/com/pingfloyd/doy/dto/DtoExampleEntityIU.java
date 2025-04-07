package com.pingfloyd.doy.dto;

// Provide as argument to POST mapping methods. IU = insert update

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter //lombok creates getters, setters etc automatically
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoExampleEntityIU {
    private String attr_2;
    private String attr_3; //only update some fields of actual entity
}
