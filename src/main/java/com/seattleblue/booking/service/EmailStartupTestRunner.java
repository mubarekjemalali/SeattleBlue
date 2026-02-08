//package com.seattleblue.booking.service;
//
//import com.seattleblue.booking.domain.Booking;
//import com.seattleblue.booking.domain.BookingStatus;
//import com.seattleblue.booking.domain.VehicleType;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.context.annotation.Profile;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//
///**
// * DEV ONLY:
// * Sends a real test email on application startup so we can verify Brevo integration.
// *
// * Safe guards:
// *  - runs ONLY in "dev" profile
// *  - runs ONLY when app.email.testOnStartup=true
// *
// * Remove this class (or disable the flag) after testing.
// */
//@Slf4j
//@Component
//@Profile("dev")
//@RequiredArgsConstructor
//public class EmailStartupTestRunner implements ApplicationRunner {
//
//    private final EmailService emailService;
//
//    @Value("${app.email.test-on-startup:false}")
//    private boolean testOnStartup;
//
//    @Value("${app.email.test-to-email:}")
//    private String testToEmail;
//
//    @Override
//    public void run(ApplicationArguments args) {
//        if (!testOnStartup) {
//            log.info("EmailStartupTestRunner: testOnStartup is false. Skipping test email.");
//            return;
//        }
//
//        if (testToEmail == null || testToEmail.isBlank()) {
//            log.warn("EmailStartupTestRunner: app.email.testToEmail is blank. Skipping test email.");
//            return;
//        }
//
//        // Build dummy booking data (not saved to DB)
////        Booking booking = new Booking();
////        booking.setId(999999L);
////        booking.setStatus(BookingStatus.CREATED);
////
////        booking.setPickupAddress("Seattle-Tacoma International Airport (SEA)");
////        booking.setDropoffAddress("Downtown Seattle, WA");
////        booking.setPickupTime(LocalDateTime.now().plusHours(2));
////
////        // Customer snapshot values (used in email templates)
////        booking.setCustomerFirstName("John");
////        booking.setCustomerLastName("Doe");
////        booking.setCustomerPhoneNumber("+12065550123");
////        booking.setCustomerEmail(testToEmail);
////
////        // Vehicle selection (optional but useful for templates/admin emails)
////        booking.setSelectedVehicleType(VehicleType.SEDAN_4);
////        booking.setFixedRoutePrice(50.00);
////
////        log.info("EmailStartupTestRunner: Sending test emails to {}", testToEmail);
////
////        // Trigger whichever emails you want to verify.
////        // Start with customer confirmation (most important).
////        emailService.sendCustomerBookingCreatedEmail(booking);
//
//        emailService.sendTestEmail();
//        // Optional: also test admin email if you want:
////        emailService.sendAdminNewBookingEmail(booking);
//
//        log.info("EmailStartupTestRunner: Test email(s) triggered. Check inbox/spam.");
//    }
//}
