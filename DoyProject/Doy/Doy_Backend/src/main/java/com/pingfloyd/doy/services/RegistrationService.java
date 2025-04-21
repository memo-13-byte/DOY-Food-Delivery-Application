package com.pingfloyd.doy.services;



import com.pingfloyd.doy.dto.RegistrationRequest;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.exception.UserAlreadyExistException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Data
@Service
public class RegistrationService {

    //private UserRepository userRepository;
   // private ConfirmationTokenService confirmationTokenService;
    //private BCryptPasswordEncoder passwordEncoder;
    private UserService userService;
    private ConfirmationTokenService confirmationTokenService;
    private EmailService emailService;
    @Value("${app.confirm-url.base}") // Inject base URL from properties
    private String confirmUrlBase;

    @Autowired
    public RegistrationService(UserService userService, EmailService emailService,ConfirmationTokenService confirmationTokenService) {
        this.userService = userService;
        this.emailService = emailService;
        this.confirmationTokenService = confirmationTokenService;

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
    public String confirmToken(String token) {
        User user = confirmationTokenService.confirmToken(token);
        user.setIsEnabled(true);
        userService.SaveUser(user);
        return "User Has Been Confirmed";
    }



    private String buildEmail(String name, String link) {
        // Create a nice HTML email template
        return "<p>Hi " + name + ",</p>" +
                "<p>Thank you for registering. Please click on the below link to activate your account:</p>" +
                "<p><a href=\"" + link + "\">Activate Now</a></p>" +
                "<p>Link will expire in 15 minutes.</p>";
    }

}
