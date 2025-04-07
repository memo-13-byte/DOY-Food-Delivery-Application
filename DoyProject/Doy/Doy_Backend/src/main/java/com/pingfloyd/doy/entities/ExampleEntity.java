package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "example_table_name")
@Getter //lombok creates getters, setters etc automatically
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExampleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // automatically add values that increment by 1
    @Column
    private Long id;

    @Column
    private String attr_1;

    @Column
    private String attr_2;

    @Column
    private String attr_3;
}
