package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("REPLY")
@Data
public class Reply extends Comment{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id",referencedColumnName = "comment_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Comment replyTo;
}
