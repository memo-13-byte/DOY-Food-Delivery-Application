package com.pingfloyd.doy.jwt;

import com.pingfloyd.doy.entities.UserRoles;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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
                .claim("role", userDetails.getAuthorities().iterator().next().getAuthority()) //embed role to token
                .setExpiration(new Date(System.currentTimeMillis() + expirationDateInMilliseconds))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    public <T> T exportToken(String token, Function<Claims, T> claimsFunction) {
        Claims claims = getClaimsFromToken(token);
        return claimsFunction.apply(claims);
    }

    public String getUsernameFromToken(String token) {
        return exportToken(token, Claims::getSubject);
    }

    public Object getClaimFromToken(String token, String claim) {
        return getClaimsFromToken(token).get(claim);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = exportToken(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    public Key getKey() {
        byte[] bytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(bytes);
    }

    public boolean checkIfUserRole(UserRoles... roles) {
        Collection<?> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        if (authorities == null || authorities == AuthorityUtils.NO_AUTHORITIES) {
            return false;
        }

        SimpleGrantedAuthority simpleGrantedAuthority = ((SimpleGrantedAuthority)authorities.iterator().next());
        if (simpleGrantedAuthority == null) return false;

        String userRole = simpleGrantedAuthority.getAuthority();

        for (UserRoles role: roles) {
            if (role.value.equals(userRole)) return true;
        }
        return false;
    }

    public String getUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }
}
