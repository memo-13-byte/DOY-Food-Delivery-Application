package com.pingfloyd.doy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoCommentIU {

    @NotBlank
    private String content;

    private Long userId;
}
