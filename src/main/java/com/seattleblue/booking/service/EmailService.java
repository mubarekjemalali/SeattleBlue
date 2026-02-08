package com.seattleblue.booking.service;


import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.Driver;

public interface EmailService {
    void sendCustomerBookingCreatedEmail(Booking booking);
    void sendAdminNewBookingEmail(Booking booking);
    void sendCustomerDriverAssignedEmail(Driver driver, Booking booking);
    void sendDriverBookingCancelledEmail(Driver driver, Booking booking);
    void sendDriverAssignedEmail(Driver driver, Booking booking);
    void sendAdminBookingCancelledEmail(Booking booking);
    void sendDriverUnassignedEmail(Driver oldDriver, Booking booking);
    void sendAdminBookingCancelledByDispatcherEmail(Booking booking, String reason);
    void sendCustomerBookingCancelledByDispatcherEmail(Booking booking, String reason);
    void sendCustomerTripCompletedEmail(Booking booking);
    void sendAdminTripCompletedEmail(Booking booking);

    void sendTestEmail();
}
