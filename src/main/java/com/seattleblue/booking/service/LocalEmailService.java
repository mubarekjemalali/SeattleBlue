//package com.seattleblue.booking.service;
//
//import com.seattleblue.booking.config.EmailProperties;
//import com.seattleblue.booking.config.EmailTemplates;
//import com.seattleblue.booking.domain.Booking;
//import com.seattleblue.booking.domain.Driver;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Primary;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
////@Primary // default in dev
//@RequiredArgsConstructor
//public class LocalEmailService implements EmailService {
//
//    private final EmailProperties props;
//
//    @Override
//    public void sendCustomerBookingCreatedEmail(Booking booking) {
//        log.info("[EMAIL-LOCAL] To(customer): {} | {}", booking.getCustomerEmail(),
//                EmailTemplates.customerBookingCreated(booking));
//    }
//
//    @Override
//    public void sendAdminNewBookingEmail(Booking booking) {
//        log.info("[EMAIL-LOCAL] To(admin): {} | {}", props.getAdminEmail(),
//                EmailTemplates.adminNewBooking(booking));
//    }
//
//    @Override
//    public void sendCustomerDriverAssignedEmail(Driver driver, Booking booking) {
//        log.info("[EMAIL-LOCAL] To(driver): {} | {}", driver.getEmail(),
//                EmailTemplates.driverAssigned(driver, booking));
//    }
//
//    @Override
//    public void sendDriverBookingCancelledEmail(Driver driver, Booking booking) {
//        log.info("[EMAIL-LOCAL] To(driver): {} | {}", driver.getEmail(),
//                EmailTemplates.driverCancelled(driver, booking));
//    }
//
//    @Override
//    public void sendAdminBookingCancelledEmail(Booking booking) {
//        log.info("[EMAIL-LOCAL] To(admin): {} | {}", props.getAdminEmail(),
//                EmailTemplates.adminCancelled(booking));
//    }
//
//    @Override
//    public void sendTestEmail() {
//
//    }
//}
//
