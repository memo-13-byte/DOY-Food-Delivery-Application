package com.pingfloyd.doy.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


/*
* Filter layer for all user requests.
*
* */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //Get Bearer Token : Format: Bearer <token>



        String header, token, username;
        String requestStr = request.getHeader("Authorization");

        if (requestStr == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String[] requestComponents = requestStr.split(" ");

        header = requestComponents[0];
        token = requestComponents[1];

        try {
            username = jwtService.getUsernameFromToken(token);
            //if username valid and user not already in security context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                //does username exist in db? if so, get details into userDetails
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails != null && !jwtService.isTokenExpired(token)) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());

                    authentication.setDetails(userDetails);
                    //authorize user
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token expired : " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception : " + e.getMessage());
        }

        //proceed with current state, if authorized, go to controller, else go back
        filterChain.doFilter(request, response);
    }
}
