package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoComment {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private DtoUser user;
}
