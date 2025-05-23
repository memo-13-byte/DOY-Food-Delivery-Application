package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.exception.InvalidLoginAttemptException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.dto.LoginRequest;
import com.pingfloyd.doy.repositories.UserRepository;
import com.pingfloyd.doy.dto.LoginAuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class LoginService {

    @Autowired
    AuthenticationProvider authenticationProvider;

    @Autowired
    JwtService jwtService;
    @Autowired
    UserRepository userRepository;
//    @Autowired
//    CustomerRepository customerRepository;

    public LoginAuthResponse login(LoginRequest loginRequest) {
        try {
            //search db for username and password
            UsernamePasswordAuthenticationToken authToken
                    = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
            authenticationProvider.authenticate(authToken);

            //find user from db, cannot fail, already checked in auth.
            //Customer dbCustomer = customerRepository.findByUsername(loginRequest.getUsername()).get();
            User dbCustomer = userRepository.findByEmail(loginRequest.getUsername()).get();
            //create token for user, will ask user the token every time a request is made.
            String token = jwtService.generateTokenForUser(dbCustomer);
            String role = jwtService.getClaimFromToken(token, "role").toString();
            return new LoginAuthResponse(dbCustomer.getEmail(), token, role);
        } catch (Exception exception) {
            throw new InvalidLoginAttemptException("Wrong username or password");
        }
    }
}
