package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Customer;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
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


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Email can not be found!"));
    }
}
