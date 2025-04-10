package com.pingfloyd.doy.dto;

//Returnee type as a result of requests such as GET. We don't ever return objects of the actual entity class.

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter //lombok creates getters, setters etc automatically
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoExampleEntity {
    private String attr_1;
    private String attr_2; //only return some fields of actual entity.
}
