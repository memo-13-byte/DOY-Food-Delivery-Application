package com.pingfloyd.doy.entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("COMPLAINT")
public class Complaint extends Comment {
}
