package com.pingfloyd.doy.services;


import com.fasterxml.jackson.databind.util.BeanUtil;
import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.exception.ApiError;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.CourierRepository;
import com.pingfloyd.doy.repositories.CustomerRepository;
import com.pingfloyd.doy.repositories.RestaurantOwnerRepository;
import com.pingfloyd.doy.repositories.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements UserDetailsService, IUserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final CourierRepository courierRepository;
    private final RestaurantOwnerRepository restaurantOwnerRepository;

    @Autowired
    public UserService(UserRepository userRepository, CustomerRepository customerRepository, BCryptPasswordEncoder bCryptPasswordEncoder
    , CourierRepository courierRepository, RestaurantOwnerRepository restaurantOwnerRepository){
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.courierRepository = courierRepository;
        this.restaurantOwnerRepository = restaurantOwnerRepository;
    }


    public String SignUpCustomer(User user, UserRoles role){
        user.setPasswordHash(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole(role);
        userRepository.save(user);
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
    public Optional<User> loadUserByEmail(String email){
        return userRepository.findByEmail(email);
    }
    @Override
    public List<DtoUser> getAllUsers() {
        List<User> dbUsers = userRepository.findAll();
        List<DtoUser> dtoUsers = new ArrayList<>();

        for (User user : dbUsers) {
            DtoUser dtoUser = new DtoUser();
            BeanUtils.copyProperties(user, dtoUser);
            dtoUsers.add(dtoUser);
        }
        return dtoUsers;
    }

    @Override
    public List<DtoRestaurantOwner> getAllRestaurantOwners() {
        List<RestaurantOwner> dbRestaurantOwners = restaurantOwnerRepository.findAll();
        List<DtoRestaurantOwner> dtoRestaurantOwners = new ArrayList<>();

        for (RestaurantOwner restaurantOwner: dbRestaurantOwners) {
            DtoRestaurantOwner dtoRestaurantOwner = new DtoRestaurantOwner();
            BeanUtils.copyProperties(restaurantOwner, dtoRestaurantOwner);
            dtoRestaurantOwners.add(dtoRestaurantOwner);
        }
        return dtoRestaurantOwners;
    }

    @Override
    public List<DtoCourier> getAllCouriers() {
        List<Courier> dbCouriers = courierRepository.findAll();
        List<DtoCourier>dtoCouriers = new ArrayList<>();

        for (Courier courier: dbCouriers) {
            DtoCourier dtoCourier = new DtoCourier();
            BeanUtils.copyProperties(courier, dtoCourier);
            dtoCouriers.add(dtoCourier);
        }
        return dtoCouriers;

    }

    @Override
    public List<DtoCustomer> getAllCustomers() {
        List<Customer> dbCustomers = customerRepository.findAll();
        List<DtoCustomer> dtoCustomers = new ArrayList<>();

        for (Customer customer: dbCustomers) {
            DtoCustomer dtoCustomer = new DtoCustomer();
            BeanUtils.copyProperties(customer, dtoCustomer);
            dtoCustomers.add(dtoCustomer);
        }
        return dtoCustomers;
    }

    @Override
    public DtoUser getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User with given id doesn't exist!");
        }
        DtoUser dtoUser = new DtoUser();
        BeanUtils.copyProperties(user.get(), dtoUser);
        return dtoUser;
    }

    @Override
    public DtoUser getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User with given email doesn't exist");
        }
        DtoUser dtoUser = new DtoUser();
        BeanUtils.copyProperties(user.get(), dtoUser);
        return dtoUser;
    }

    @Override
    public DtoCustomer getCustomerByEmail(String email) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            throw new UserNotFoundException("Customer with given email doesn't exist");
        }
        DtoCustomer dtoCustomer = new DtoCustomer();
        BeanUtils.copyProperties(customer.get(), dtoCustomer);
        return dtoCustomer;
    }

    @Override
    public DtoRestaurantOwner getRestaurantOwnerByEmail(String email) {
        Optional<RestaurantOwner> restaurantOwner = restaurantOwnerRepository.findByEmail(email);
        if (restaurantOwner.isEmpty()) {
            throw new UserNotFoundException("Restaurant Owner with given email doesn't exist");
        }
        DtoRestaurantOwner dtoRestaurantOwner  = new DtoRestaurantOwner();
        BeanUtils.copyProperties(restaurantOwner.get(), dtoRestaurantOwner);
        return dtoRestaurantOwner;
    }

    @Override
    public DtoCourier getCourierByEmail(String email) {
        Optional<Courier> courier = courierRepository.findByEmail(email);
        if (courier.isEmpty()) {
            throw new UserNotFoundException("Courier with given email doesn't exist");
        }
        DtoCourier dtoCourier  = new DtoCourier();
        BeanUtils.copyProperties(courier.get(), dtoCourier);
        return dtoCourier;
    }

    @Override
    public DtoCustomer putCustomer(String email, DtoCustomerIU dtoCustomerIU) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            throw new UserNotFoundException("Customer with given email doesn't exist");
        }
        Customer savedCustomer = customer.get();
        BeanUtils.copyProperties(dtoCustomerIU, savedCustomer);
        savedCustomer = customerRepository.save(savedCustomer);
        DtoCustomer dtoCustomer = new DtoCustomer();
        BeanUtils.copyProperties(savedCustomer, dtoCustomer);
        return dtoCustomer;
    }

    @Override
    public DtoCourier putCourier(String email, DtoCourierIU dtoCourierIU) {
        Optional<Courier> courier = courierRepository.findByEmail(email);
        if (courier.isEmpty()) {
            throw new UserNotFoundException("Courier with given email doesn't exist");
        }
        Courier savedCourier = courier.get();
        BeanUtils.copyProperties(dtoCourierIU, savedCourier);
        savedCourier = courierRepository.save(savedCourier);
        DtoCourier dtoCourier = new DtoCourier();
        BeanUtils.copyProperties(savedCourier, dtoCourier);
        return dtoCourier;
    }

    @Override
    public DtoRestaurantOwner putRestaurantOwner(String email, DtoRestaurantOwnerIU dtoRestaurantOwnerIU) {
        Optional<RestaurantOwner> restaurantOwner = restaurantOwnerRepository.findByEmail(email);
        if (restaurantOwner.isEmpty()) {
            throw new UserNotFoundException("Restaurant owner with given email doesn't exist");
        }
        RestaurantOwner savedRestaurantOwner = restaurantOwner.get();
        BeanUtils.copyProperties(dtoRestaurantOwnerIU, savedRestaurantOwner);
        savedRestaurantOwner = restaurantOwnerRepository.save(savedRestaurantOwner);
        DtoRestaurantOwner dtoRestaurantOwner = new DtoRestaurantOwner();
        BeanUtils.copyProperties(savedRestaurantOwner, dtoRestaurantOwner);
        return dtoRestaurantOwner;
    }
}
