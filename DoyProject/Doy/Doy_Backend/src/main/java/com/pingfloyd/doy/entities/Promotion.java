package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.PromotionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long promotionId;

    @NotNull
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "promotion_type")
    @Enumerated(EnumType.STRING)
    private PromotionType promotionType;

    @NotNull
    @Column(name = "percentage_or_discount")
    private Double percentageOrDiscount;

    @NotNull
    @Column(name = "active")
    private Boolean active;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
