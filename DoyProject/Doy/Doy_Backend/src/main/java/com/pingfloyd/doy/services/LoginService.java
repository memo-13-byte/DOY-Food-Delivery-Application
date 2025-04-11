package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.dto.LoginRequest;
import com.pingfloyd.doy.repositories.UserRepository;
import com.pingfloyd.doy.dto.LoginAuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

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

            return new LoginAuthResponse(dbCustomer.getEmail(), token);
        } catch (Exception exception) {
            System.out.println("Wrong username or password");
        }
        return null;
    }
}
