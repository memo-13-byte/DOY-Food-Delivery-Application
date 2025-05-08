package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoReply extends DtoComment {
    private Long replyTo;
}
