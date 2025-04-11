package com.pingfloyd.doy.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoItemIU {
    private String name;
    private String description;
    private int price;
    private Image image;
}
