package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoPromotion;
import com.pingfloyd.doy.dto.DtoPromotionIU;
import com.pingfloyd.doy.entities.Promotion;
import com.pingfloyd.doy.repositories.PromotionRepository;
import com.pingfloyd.doy.enums.PromotionType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // In PromotionService.java
    public DtoPromotion postPromotion(DtoPromotionIU dtoPromotionIU) {
        Promotion promotion = new Promotion();

        promotion.setName(dtoPromotionIU.getName());
        promotion.setDescription(dtoPromotionIU.getDescription());
        promotion.setActive(dtoPromotionIU.getActive());

        if (dtoPromotionIU.getPromotionType() != null && !dtoPromotionIU.getPromotionType().isEmpty()) {
            promotion.setPromotionType(PromotionType.valueOf(dtoPromotionIU.getPromotionType()));
        } else {
            throw new IllegalArgumentException("Promotion type is required.");
        }

        if (dtoPromotionIU.getStartDate() != null && !dtoPromotionIU.getStartDate().isEmpty()) {
            promotion.setStartDate(LocalDate.parse(dtoPromotionIU.getStartDate()));
        } else {
            promotion.setStartDate(null);
        }
        if (dtoPromotionIU.getEndDate() != null && !dtoPromotionIU.getEndDate().isEmpty()) {
            promotion.setEndDate(LocalDate.parse(dtoPromotionIU.getEndDate()));
        } else {
            promotion.setEndDate(null);
        }

        if (dtoPromotionIU.getDiscountValue() != null) {
            promotion.setPercentageOrDiscount(dtoPromotionIU.getDiscountValue());
        } else {
            throw new IllegalArgumentException("Discount value is required.");
        }

        Promotion savedPromotion = promotionRepository.save(promotion);

        DtoPromotion dtoPromotion = new DtoPromotion();

        dtoPromotion.setId(savedPromotion.getPromotionId());
        dtoPromotion.setName(savedPromotion.getName());
        dtoPromotion.setDescription(savedPromotion.getDescription());
        dtoPromotion.setActive(savedPromotion.getActive());

        if (savedPromotion.getPromotionType() != null) {
            dtoPromotion.setPromotionType(savedPromotion.getPromotionType().name());
        }

        dtoPromotion.setStartDate(savedPromotion.getStartDate() == null ? null : savedPromotion.getStartDate().toString());
        dtoPromotion.setEndDate(savedPromotion.getEndDate() == null ? null : savedPromotion.getEndDate().toString());

        dtoPromotion.setDiscountValue(savedPromotion.getPercentageOrDiscount());

        return dtoPromotion;
    }}


