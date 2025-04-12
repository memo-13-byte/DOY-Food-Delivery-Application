package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Customer;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.repositories.CustomerRepository;
import com.pingfloyd.doy.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, CustomerRepository customerRepository, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    public String SignUpCustomer(Customer customer){
        customer.setPasswordHash(bCryptPasswordEncoder.encode(customer.getPassword()));
        userRepository.save(customer);
        return "User Signed Up Successfully";
    }

    public void SaveUser(User user){
        userRepository.save(user);
    }

    public Customer SearchCustomer(String email){
        Optional<Customer> customer = customerRepository.findByEmail(email);
        return customer.orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Email can not be found!"));
    }
}
