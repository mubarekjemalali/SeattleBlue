package com.seattleblue.booking.config;


import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.Driver;

public class EmailTemplates {

    public static String customerBookingCreatedHtml(Booking b, String manageUrl) {
        return """
                    <h2>Your booking is confirmed</h2>
                    <p><b>Pickup:</b> %s</p>
                    <p><b>Drop-off:</b> %s</p>
                    <p><b>Pickup time:</b> %s</p>
                    <p>We will assign a driver shortly.</p>
                    <p>
                        <b>Manage your booking:</b><br/>
                        <a href="%s">View or cancel your booking</a>
                    </p>
                    <p style="font-size:12px;color:#666;">
                        If you need to cancel this booking, you can do so from the link above.
                    </p>
                """.formatted(b.getPickupAddress(), b.getDropoffAddress(), b.getPickupTime(), manageUrl);
    }

    public static String adminNewBookingHtml(Booking b) {
        return """
            <h2>New booking received</h2>
            <p><b>Booking ID:</b> %d</p>
            <p><b>Customer:</b> %s (%s)</p>
            <p><b>Pickup:</b> %s</p>
            <p><b>Drop-off:</b> %s</p>
            <p><b>Pickup time:</b> %s</p>
            <p><b>Vehicle type:</b> %s</p>
        """.formatted(
                b.getId(),
                b.getCustomer().getFullName(),
                b.getCustomer().getPhoneNumber(),
                b.getPickupAddress(),
                b.getDropoffAddress(),
                b.getPickupTime(),
                b.getSelectedVehicleType()
        );
    }

    public static String driverAssignedHtml(Driver d, Booking b) {
        return """
            <h2>New ride assigned</h2>
            <p><b>Booking ID:</b> %d</p>
            <p><b>Pickup:</b> %s</p>
            <p><b>Drop-off:</b> %s</p>
            <p><b>Pickup time:</b> %s</p>
            <p><b>Customer:</b> %s (%s)</p>
        """.formatted(
                b.getId(), b.getPickupAddress(), b.getDropoffAddress(), b.getPickupTime(),
                b.getCustomer().getFullName(), b.getCustomer().getPhoneNumber()
        );
    }

    public static String driverCancelledHtml(Driver d, Booking b) {
        return """
            <h2>Booking cancelled</h2>
            <p>This assigned booking has been cancelled by the customer.</p>
            <p><b>Booking ID:</b> %d</p>
            <p><b>Pickup:</b> %s</p>
            <p><b>Pickup time:</b> %s</p>
        """.formatted(b.getId(), b.getPickupAddress(), b.getPickupTime());
    }
    public static String customerCancelledHtml(Booking b) {
        return """
            <h2>Your booking has been cancelled</h2>
            <p><b>Booking ID:</b> %d</p>
            <p><b>Status:</b> %s</p>
            <p><b>Reason:</b> %s</p>
            <p>If you cancelled this by mistake, please contact us.</p>
        """.formatted(b.getId(), b.getStatus(), b.getCancellationReason());
    }

    public static String adminCancelledHtml(Booking b) {
        return """
            <h2>Booking cancelled by customer</h2>
            <p><b>Booking ID:</b> %d</p>
            <p><b>Status:</b> %s</p>
            <p><b>Reason:</b> %s</p>
        """.formatted(b.getId(), b.getStatus(), b.getCancellationReason());
    }

    public static String driverUnassignedHtml(Driver driver, Booking booking) {
        return """
        <div style="font-family: Arial, sans-serif;">
          <h2>Ride Reassigned</h2>
          <p>Hello %s,</p>
          <p>The ride below has been reassigned to another driver.</p>

          <h3>Trip</h3>
          <ul>
            <li><b>Pickup:</b> %s</li>
            <li><b>Drop-off:</b> %s</li>
            <li><b>Pickup time:</b> %s</li>
          </ul>

          <p>Thank you.</p>
        </div>
        """.formatted(
                safe(driver.getFirstName()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getPickupTime() != null ? booking.getPickupTime().toString() : "N/A"
        );
    }

    private static String safe(String input) { return input != null ? input.replaceAll("[<>&\"']", "") : ""; }

    public static String adminCancelledByDispatcherHtml(Booking booking, String reason) {
        return """
        <div style="font-family: Arial, sans-serif;">
          <h2>Booking Cancelled (Dispatcher)</h2>
          <p><b>Booking ID:</b> %s</p>
          <p><b>Customer:</b> %s (%s)</p>
          <p><b>Pickup:</b> %s</p>
          <p><b>Drop-off:</b> %s</p>
          <p><b>Pickup time:</b> %s</p>
          <p><b>Reason:</b> %s</p>
        </div>
        """.formatted(
                booking.getId(),
                safe(booking.getCustomer().getFullName()),
                safe(booking.getCustomerPhoneNumber()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getPickupTime() != null ? booking.getPickupTime().toString() : "N/A",
                safe(reason)
        );
    }

    public static String customerCancelledByDispatcherHtml(Booking booking, String reason, String manageUrl) {
        return """
        <div style="font-family: Arial, sans-serif;">
          <h2>Your booking has been cancelled</h2>
          <p>Hello %s,</p>
          <p>Your booking has been cancelled by the dispatcher.</p>

          <p><b>Pickup:</b> %s</p>
          <p><b>Drop-off:</b> %s</p>
          <p><b>Pickup time:</b> %s</p>

          <p><b>Reason:</b> %s</p>
          <p>If you believe this was a mistake, please contact us.</p>
              <p>
                        <b>Manage your booking:</b><br/>
                        <a href="%s">View or cancel your booking</a>
                    </p>
                    <p style="font-size:12px;color:#666;">
                        You can review the latest status of your booking using the link above.
                    </p>
          
        </div>
        """.formatted(
                safe(booking.getCustomer().getFullName()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getPickupTime() != null ? booking.getPickupTime().toString() : "N/A",
                safe(reason),
                manageUrl
        );
    }

    public static String customerDriverAssignedHtml(Driver driver, Booking booking, String manageUrl) {
        return """
                <div style="font-family: Arial, sans-serif;">
                  <h2>Your driver has been assigned</h2>
                  <p>Hello %s,</p>
                  <p>Your ride is now assigned to a driver.</p>
                  <ul>
                    <li><b>Driver:</b> %s</li>
                    <li><b>Pickup:</b> %s</li>
                    <li><b>Drop-off:</b> %s</li>
                    <li><b>Pickup time:</b> %s</li>
                  </ul>
                                      <p>
                                <b>Manage your booking:</b><br/>
                                <a href="%s">View or cancel your booking</a>
                            </p>
                            <p style="font-size:12px;color:#666;">
                                You can view your booking details using the link above.
                            </p>
                  <p>Thank you for choosing Seattle Blue Cab.</p>
                </div>
                """.formatted(
                safe(booking.getCustomer().getFullName()),
                safe(driver.getFullName()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getPickupTime() != null ? booking.getPickupTime().toString() : "N/A",
                manageUrl
        );
    }


    // Local service can use these too if you want text versions:
    public static String customerBookingCreated(Booking b, String manageUrl) { return strip(customerBookingCreatedHtml(b, manageUrl)); }
    public static String adminNewBooking(Booking b) { return strip(adminNewBookingHtml(b)); }
    public static String driverAssigned(Driver d, Booking b) { return strip(driverAssignedHtml(d, b)); }
    public static String driverCancelled(Driver d, Booking b) { return strip(driverCancelledHtml(d, b)); }
    public static String adminCancelled(Booking b) { return strip(adminCancelledHtml(b)); }

    private static String strip(String html) { return html.replaceAll("<[^>]+>", "").trim(); }

    public static String customerTripCompletedHtml(Booking booking,String manageUrl) {
        return """
        <div style="font-family: Arial, sans-serif;">
          <h2>Trip Completed</h2>
          <p>Hello %s,</p>
          <p>Your trip has been marked as completed.</p>
          <ul>
            <li><b>Pickup:</b> %s</li>
            <li><b>Drop-off:</b> %s</li>
            <li><b>Pickup time:</b> %s</li>
          </ul>
          <p>Thank you for riding with us.</p>
          <p>
            <b>Manage your booking:</b><br/>
            <a href="%s">View or cancel your booking</a>
          </p>
            <p style="font-size:12px;color:#666;">
              You can review your booking details using the link above.                   
          </p>
          
        </div>
        """.formatted(
                safe(booking.getCustomer().getFullName()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getPickupTime() != null ? booking.getPickupTime().toString() : "N/A",
                manageUrl
        );
    }

    public static String adminTripCompletedHtml(Booking booking) {
        return """
        <div style="font-family: Arial, sans-serif;">
          <h2>Trip Completed</h2>
          <p><b>Booking ID:</b> %s</p>
          <p><b>Customer:</b> %s (%s)</p>
          <p><b>Pickup:</b> %s</p>
          <p><b>Drop-off:</b> %s</p>
          <p><b>Completed At:</b> %s</p>
        </div>
        """.formatted(
                booking.getId(),
                safe(booking.getCustomer().getFullName()),
                safe(booking.getCustomerPhoneNumber()),
                safe(booking.getPickupAddress()),
                safe(booking.getDropoffAddress()),
                booking.getCompletedAt() != null ? booking.getCompletedAt().toString() : "N/A"
        );
    }

}

