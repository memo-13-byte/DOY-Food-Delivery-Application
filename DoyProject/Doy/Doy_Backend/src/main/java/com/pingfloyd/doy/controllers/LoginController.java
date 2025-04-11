package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.LoginRequest;
import com.pingfloyd.doy.dto.LoginAuthResponse;
import com.pingfloyd.doy.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping(path = "/api/login")
public class LoginController {

    @Autowired
    private LoginService loginAuthService;

    @PostMapping(path = "/auth")
    public LoginAuthResponse login(@RequestBody LoginRequest loginRequest) {
        return loginAuthService.login(loginRequest);
    }
}
