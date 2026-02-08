package com.seattleblue.booking.service;


import com.seattleblue.booking.domain.Customer;
import com.seattleblue.booking.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer findOrCreateCustomer(String firstName, String lastName,
                                         String phoneNumber, String email) {

        String normalizedPhone = normalizePhone(phoneNumber);

        Optional<Customer> existingOpt = customerRepository.findByPhoneNumber(normalizedPhone);

        if (existingOpt.isPresent()) {
            // Update name/email if necessary
            Customer existing = existingOpt.get();

            boolean changed = false;

            if (firstName != null && !firstName.equals(existing.getFirstName())) {
                existing.setFirstName(firstName);
                changed = true;
            }
            if (lastName != null && !lastName.equals(existing.getLastName())) {
                existing.setLastName(lastName);
                changed = true;
            }
            if (email != null && !email.equals(existing.getEmail())) {
                existing.setEmail(email);
                changed = true;
            }

            // Save only if changed
            if (changed) {
                customerRepository.save(existing);
            }

            return existing;
        }

        // Otherwise create new
        Customer newCustomer = new Customer();
        newCustomer.setFirstName(firstName);
        newCustomer.setLastName(lastName);
        newCustomer.setPhoneNumber(normalizedPhone);
        newCustomer.setEmail(email);

        return customerRepository.save(newCustomer);
    }

    private String normalizePhone(String phone) {
        return phone.replaceAll("[^0-9+]", "");
    }

}
