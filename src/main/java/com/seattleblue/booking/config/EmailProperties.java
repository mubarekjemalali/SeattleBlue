package com.seattleblue.booking.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {
    private boolean enabled;
    private String provider;      // "brevo" or "local"
    private String fromEmail;
    private String fromName;
    private String adminEmail;

    private Brevo brevo = new Brevo();

    @Data
    public static class Brevo {
        private String apiKey;
    }
}
