package com.seattleblue.booking.service;

import com.seattleblue.booking.config.EmailProperties;
import com.seattleblue.booking.config.EmailTemplates;
import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.Driver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperties({
        @ConditionalOnProperty(prefix = "app.email", name = "enabled", havingValue = "true"),
        @ConditionalOnProperty(prefix = "app.email", name = "provider", havingValue = "brevo")
})
// NOTE: If your Spring version doesn’t support multiple values in havingValue,
// we can replace this with a small @Configuration that registers the bean conditionally.
public class BrevoEmailService implements EmailService {

    private final EmailProperties props;

    private RestClient brevoClient() {
       return RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .defaultHeader("api-key", props.getBrevo().getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    private void send(String toEmail, String toName, String subject, String htmlContent) {

        if (toEmail == null || toEmail.isBlank()) {
            log.warn("Skipping email: missing toEmail. Subject={}", subject);
            return;
        }

        Map<String, Object> payload = Map.of(
                "sender", Map.of("email", props.getFromEmail(), "name", props.getFromName()),
                "to", List.of(Map.of("email", toEmail, "name", toName)),
                "subject", subject,
                "htmlContent", htmlContent
        );

        brevoClient().post()
                .uri("/smtp/email")
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void sendCustomerBookingCreatedEmail(Booking booking) {
        send(
                booking.getCustomerEmail(),
                booking.getCustomer().getFullName(),
                "Booking Confirmation",
                EmailTemplates.customerBookingCreatedHtml(booking)
        );
    }

    @Override
    public void sendAdminNewBookingEmail(Booking booking) {
        send(
                props.getAdminEmail(),
                "Dispatcher",
                "New Booking Received",
                EmailTemplates.adminNewBookingHtml(booking)
        );
    }

    @Override
    public void sendCustomerDriverAssignedEmail(Driver driver, Booking booking) {
        send(
                booking.getCustomerEmail(),
                booking.getCustomer().getFullName(),
                "Your Driver Is Assigned",
                EmailTemplates.customerDriverAssignedHtml(driver, booking)
        );
    }

    @Override
    public void sendDriverBookingCancelledEmail(Driver driver, Booking booking) {
        send(
                driver.getEmail(),
                driver.getFirstName(),
                "Booking Cancelled",
                EmailTemplates.driverCancelledHtml(driver, booking)
        );
    }

    @Override
    public void sendDriverAssignedEmail(Driver driver, Booking booking) {
        send(
                driver.getEmail(),
                driver.getFirstName(),
                "New Ride Assigned",
                EmailTemplates.driverAssignedHtml(driver, booking)
        );
    }

    @Override
    public void sendAdminBookingCancelledEmail(Booking booking) {
        send(
                props.getAdminEmail(),
                "Dispatcher",
                "Booking Cancelled (Customer)",
                EmailTemplates.adminCancelledHtml(booking)
        );
    }

    @Override
    public void sendDriverUnassignedEmail(Driver oldDriver, Booking booking) {
        send(
                oldDriver.getEmail(),
                oldDriver.getFirstName(),
                "Ride Reassigned",
                EmailTemplates.driverUnassignedHtml(oldDriver, booking)
        );
    }

    @Override
    public void sendAdminBookingCancelledByDispatcherEmail(Booking booking, String reason) {
        send(
                props.getAdminEmail(),
                "Dispatcher",
                "Booking Cancelled (Dispatcher)",
                EmailTemplates.adminCancelledByDispatcherHtml(booking, reason)
        );
    }

    @Override
    public void sendCustomerBookingCancelledByDispatcherEmail(Booking booking, String reason) {
        send(
                booking.getCustomerEmail(),
                booking.getCustomer().getFullName(),
                "Booking Cancelled",
                EmailTemplates.customerCancelledByDispatcherHtml(booking, reason)
        );
    }

    @Override
    public void sendCustomerTripCompletedEmail(Booking booking) {
        send(
                booking.getCustomerEmail(),
                booking.getCustomer().getFullName(),
                "Trip Completed",
                EmailTemplates.customerTripCompletedHtml(booking)
        );
    }

    @Override
    public void sendAdminTripCompletedEmail(Booking booking) {
        send(
                props.getAdminEmail(),
                "Dispatcher",
                "Trip Completed",
                EmailTemplates.adminTripCompletedHtml(booking)
        );
    }



    @Override
    public void sendTestEmail(){
        send("tomyfriendmubi@gmail.com",
                "test",
                "Test Email",
                "This is just a test message, we want to confirm if the email functionality works and if it is reliable "
                );
    }
}
