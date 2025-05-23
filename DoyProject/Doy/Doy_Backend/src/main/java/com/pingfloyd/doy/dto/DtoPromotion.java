package com.pingfloyd.doy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoPromotion {
    private Long id;

    @NotBlank(message = "Promotion name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Promotion type is required")
    private String promotionType;

    @NotNull(message = "Discount value is required")
    @Min(value = 0, message = "Discount value must be non-negative")
    private Double discountValue;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private String startDate;

    private String endDate;
}