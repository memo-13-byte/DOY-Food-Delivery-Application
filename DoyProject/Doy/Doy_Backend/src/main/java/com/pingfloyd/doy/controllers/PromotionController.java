package com.pingfloyd.doy.controllers;
import com.pingfloyd.doy.dto.DtoPromotion;
import com.pingfloyd.doy.dto.DtoPromotionIU;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.DistrictService;
import com.pingfloyd.doy.services.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotion")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PromotionController {
    private final JwtService jwtService;
    private final PromotionService promotionService;
    @Autowired
    public PromotionController(JwtService jwtService, PromotionService promotionService){
        this.jwtService = jwtService;
        this.promotionService = promotionService;
    }

    @PostMapping("/post")
    public ResponseEntity<DtoPromotion> postPromotion(@RequestBody @Valid DtoPromotionIU promotion){
        if(!jwtService.checkIfUserRole(UserRoles.ADMIN)) {
            throw new UnauthorizedRequestException();
        }
        return ResponseEntity.ok(promotionService.postPromotion(promotion));
    }
}

