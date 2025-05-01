package com.pingfloyd.doy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DtoBanRequest {
    @NotNull(message = "Id cannot be null!")
    private Long id;
    @NotNull(message = "Suspension duration can not be empty!")
    private Integer banDuration;
    @Size(max = 100 ,message = "Description length cannot be more than 100!")
    private String description;

}
