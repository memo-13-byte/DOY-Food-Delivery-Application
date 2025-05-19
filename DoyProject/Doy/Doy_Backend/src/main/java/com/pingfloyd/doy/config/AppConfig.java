
package com.pingfloyd.doy.config;


import com.pingfloyd.doy.entities.Admin;
import com.pingfloyd.doy.entities.Customer;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.jwt.JwtAuthFilter;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.repositories.CustomerRepository;
import com.pingfloyd.doy.repositories.UserRepository;
import com.pingfloyd.doy.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class AppConfig {

    @Autowired
    UserRepository userRepository;

    final String ADMIN_EMAIL = "baris.byildiz@gmail.com";
    final String ADMIN_PASSWORD = "By=12341234";

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                Optional<User> customerOptional = userRepository.findByEmail(username);
                return customerOptional.orElse(null);
            }
        };
    }

    @Bean
    public User createAdmin() {
        Optional<User> user =userRepository.findByEmail(ADMIN_EMAIL);
        if (user.isPresent()) return user.get();

        Admin admin = new Admin();
        admin.setRole(UserRoles.ADMIN);
        admin.setEmail(ADMIN_EMAIL);
        admin.setPasswordHash(bCryptPasswordEncoder().encode(ADMIN_PASSWORD));
        admin.setFirstname("ADMIN");
        admin.setLastname("ADMIN");
        admin.setIsEnabled(true);
        userRepository.save(admin);
        return admin;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(bCryptPasswordEncoder());

        return authProvider;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtService jwtService() {
        return new JwtService();
    }


}
