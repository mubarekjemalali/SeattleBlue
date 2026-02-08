package com.seattleblue.booking.domain;

public enum BookingStatus {
    CREATED,                // customer created booking, waiting for driver
    ASSIGNED,               // dispatcher assigned driver
    COMPLETED,              // trip finished
    CANCELLED_BY_CUSTOMER,
    CANCELLED_BY_DISPATCHER
}
