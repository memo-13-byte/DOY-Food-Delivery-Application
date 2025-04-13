package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.LoginRequest;
import com.pingfloyd.doy.dto.LoginAuthResponse;
import com.pingfloyd.doy.services.LoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping(path = "/api/login")
@CrossOrigin(origins = "http://localhost:3001")
public class LoginController {

    @Autowired
    private LoginService loginAuthService;

    @PostMapping(path = "/auth")
    public LoginAuthResponse login(@RequestBody @Valid LoginRequest loginRequest) {
        return loginAuthService.login(loginRequest);
    }
}
