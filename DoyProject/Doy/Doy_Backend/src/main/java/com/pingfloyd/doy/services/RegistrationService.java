package com.pingfloyd.doy.services;



import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.exception.UserAlreadyExistException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Data
@Service
public class RegistrationService {

    //private UserRepository userRepository;
   // private ConfirmationTokenService confirmationTokenService;
    //private BCryptPasswordEncoder passwordEncoder;
    private UserService userService;
    private RestaurantOwnerService restaurantOwnerService;
    private CourierService courierService;
    private ConfirmationTokenService confirmationTokenService;
    private EmailService emailService;
    private DistrictService districtService;
    @Value("${app.confirm-url.base}") // Inject base URL from properties
    private String confirmUrlBase;

    @Autowired
    public RegistrationService(UserService userService, EmailService emailService,
                               ConfirmationTokenService confirmationTokenService,DistrictService districtService
    ,RestaurantOwnerService restaurantOwnerService ,CourierService courierService ) {
        this.userService = userService;
        this.emailService = emailService;
        this.confirmationTokenService = confirmationTokenService;
        this.districtService = districtService;
        this.restaurantOwnerService = restaurantOwnerService;
        this.courierService = courierService;

    }

    public Customer CustomerRegister(@Valid @RequestBody RegistrationRequest request) throws UserAlreadyExistException{
        if(userService.loadUserByEmail(request.getEmail()).isPresent()){
            throw new UserAlreadyExistException("Customer with given email already exist!") ;
        }
        Customer user = new Customer(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber()
        );
        user.setRole(UserRoles.CUSTOMER); //add user roles like this
        String success = userService.SignUpCustomer(user);
        ConfirmationToken token = confirmationTokenService.GenerateToken(user , 15);
        String link = confirmUrlBase + "/api/registration/confirm?token=" + token.getToken();
        String emailBody = buildEmail(user.getUsername() , link);
        emailService.send(user.getEmail() , "Confirm your Email for Food Delivery App", emailBody);
        return user;
    }

    @Transactional
    public RestaurantOwner RestaurantOwnerRegister(RestaurantOwnerRegistrationRequest request , DtoRestaurantIU restaurant , DtoAddress address) throws UserAlreadyExistException{
        if(userService.loadUserByEmail(request.getEmail()).isPresent()){
            throw new UserAlreadyExistException("Restaurant owner with given email already exist!") ;
        }
        if(restaurantOwnerService.GetByGovernmentId(request.getGovernmentId()).isPresent()){
            throw new UserAlreadyExistException("Restaurant owner with given government id already exist!");
        }
        RestaurantOwner restaurantOwner = CreateRestaurantOwner(request);
        Restaurant restaurantDb = CreateRestaurant(restaurant , restaurantOwner);
        Address addressDb = CreateAddress(address);

        districtService.SaveAddress(addressDb);
        restaurantDb.setAddress(addressDb);
        restaurantOwner.setRestaurant(restaurantDb);
        restaurantDb.setRestaurantOwner(restaurantOwner);
        userService.SignUpCustomer(restaurantOwner);

        String emailBody = buildInformationEmail(restaurantOwner.getFirstname()+" "+restaurantOwner.getLastname());
        emailService.send(restaurantOwner.getEmail() , "Registration for Doy" , emailBody);
        return restaurantOwner;
    }

    @Transactional
    public Courier CourierRegister(CourierRegistrationRequest request){
        if(userService.loadUserByEmail(request.getEmail()).isPresent()){
            throw new UserAlreadyExistException("Restaurant owner with given email already exist!") ;
        }
        if(courierService.GetByGovernmentId(request.getGovernmentId()).isPresent()){
            throw new UserAlreadyExistException("Restaurant owner with given government id already exist!");
        }
        Courier courier = CreateCourier(request);
        userService.SignUpCustomer(courier);
        String emailBody = buildInformationEmail(courier.getFirstname()+" "+courier.getLastname());
        emailService.send(courier.getEmail() , "Registration for Doy" , emailBody);
        return courier;
    }


    @Transactional
    public String confirmToken(String token) {
        User user = confirmationTokenService.confirmToken(token);
        user.setIsEnabled(true);
        userService.SaveUser(user);
        return "User Has Been Confirmed";
    }

    private Address CreateAddress(DtoAddress address){
        Address addressDb = new Address();
        addressDb.setCityEnum(address.getCity());
        addressDb.setAvenue(address.getAvenue());
        addressDb.setStreet(address.getStreet());
        addressDb.setNeighborhood(address.getNeighborhood());
        addressDb.setBuildingNumber(String.valueOf(address.getBuildingNumber()));
        addressDb.setApartment_number(String.valueOf(address.getApartmentNumber()));
        District district = districtService.GetDistrict(address.getCity() , address.getDistrict());
        addressDb.setDistrict(district);
        return addressDb;
    }
    private Restaurant CreateRestaurant(DtoRestaurantIU restaurant, RestaurantOwner restaurantOwner){
        Restaurant restaurantDb = new Restaurant();
        restaurantDb.setRestaurantOwner(restaurantOwner);
        restaurantDb.setRestaurantName(restaurant.getRestaurantName());
        restaurantDb.setRestaurantCategory(restaurant.getRestaurantCategory());
        restaurantDb.setDescription(restaurant.getDescription());
        restaurantDb.setRestaurantPhone(restaurant.getRestaurantPhone());
        restaurantDb.setMinOrderPrice(restaurant.getMinOrderPrice());
        return restaurantDb;

    }
    private Courier CreateCourier(CourierRegistrationRequest request){
        Courier courier = new Courier(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber()
        );
        courier.setGovernmentId(request.getGovernmentId());
        courier.setRole(UserRoles.COURIER);
        courier.setIsEnabled(false);
        District district = districtService.GetDistrict(request.getCity() , request.getName());
        courier.setDistrict(district);
        district.getCouriers().add(courier);
        //districtService.SaveDistrict(district);
        courier.setCreatedAt(LocalDateTime.now());
        return courier;
    }
    private RestaurantOwner CreateRestaurantOwner(RestaurantOwnerRegistrationRequest request){
        RestaurantOwner restaurantOwner = new RestaurantOwner(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber()
        );

        restaurantOwner.setGovernmentId(request.getGovernmentId());
        restaurantOwner.setRole(UserRoles.RESTAURANT_OWNER);
        restaurantOwner.setIsEnabled(false);
        restaurantOwner.setCreatedAt(LocalDateTime.now());
       return restaurantOwner;
    }

    private String buildEmail(String name, String link) {
        // Create a nice HTML email template
        return "<p>Hi " + name + ",</p>" +
                "<p>Thank you for registering. Please click on the below link to activate your account:</p>" +
                "<p><a href=\"" + link + "\">Activate Now</a></p>" +
                "<p>Link will expire in 15 minutes.</p>";
    }
    private String buildInformationEmail(String name){
        return "<p>Hi " + name + ",</p>" +
                "<p>Thank you for registering.</p>" +
                "<p>Your account information has been sent for admin approval.</p>"+
                "<p>After approval or rejection you will be informed via email.</p>";
    }

}
