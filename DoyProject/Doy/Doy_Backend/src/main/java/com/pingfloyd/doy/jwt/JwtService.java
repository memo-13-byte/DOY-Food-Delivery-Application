package com.pingfloyd.doy.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/*
* Class for generating user JWT tokens.
* */
@Component
public class JwtService {

    private static final String SECRET_KEY
            = "eyJhbGciOiJIUzI1NiJ9a2V5c2VjcmV0ZXhhbXBsZXNlY3JldGtleQ3jVvNAa3ICVUJyewAYmnH2EHLloqCZIHGAai0RU7x9E";

    /*
    * Generate a JWS token for the provided user.
    * */
    public String generateTokenForUser(UserDetails userDetails) {
        //expires 2 hours from now
        int expirationDateInMilliseconds = 1000 * 60 * 60 * 2;

        return Jwts.builder().setSubject(userDetails.getUsername()).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationDateInMilliseconds))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public <T> T exportToken(String token, Function<Claims, T> claimsFunction) {
        Claims claims = Jwts.parser().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
        return claimsFunction.apply(claims);
    }

    public String getUsernameFromToken(String token) {
        return exportToken(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = exportToken(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    public Key getKey() {
        byte[] bytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(bytes);
    }
}
