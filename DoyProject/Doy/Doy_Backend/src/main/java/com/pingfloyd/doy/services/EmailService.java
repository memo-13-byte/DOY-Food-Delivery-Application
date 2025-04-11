package com.pingfloyd.doy.services;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    @Async
    public void send(String to, String subject, String emailBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(emailBody, true); // true = enable HTML
            helper.setTo(to);
            helper.setSubject(subject);
            String fromAddress = "saidcetin93@gmail.com";
            helper.setFrom(fromAddress); // Use configured 'from' address
            mailSender.send(mimeMessage);
            LOGGER.info("Confirmation email sent successfully to {}", to);
        } catch (MessagingException e) {
            LOGGER.error("Failed to send email to {}: {}", to, e.getMessage());
            // Consider throwing a custom exception or implementing retry logic
            throw new IllegalStateException("Failed to send email");
        }
    }
}
