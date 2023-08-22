package com.pwp.backend.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configures our application with Spring Security to restrict access to our API endpoints.
 * Used Auth0 Docs: https://auth0.com/docs/quickstart/backend/java-spring-security5/
 */
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Value("${auth0.audience}")
    private String audience;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuer;

    /**
     * Filters the http requests and matches the paths to see if authentication is needed or not
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeRequests()
                // PUBLIC ENDPOINTS
                .requestMatchers("/api/public").permitAll()
                .requestMatchers("/api/registerDeviceIDs").permitAll()
                .requestMatchers("/api/registerNetwork").permitAll()

                // PRIVATE ENDPOINTS
                .requestMatchers("/api/getDataDevice").authenticated()
                .requestMatchers("/api/postDataThermostat").authenticated()
                .requestMatchers("/api/private").authenticated()
                .requestMatchers("/api/getUserDevices").authenticated()
                .requestMatchers("/api/login").authenticated()
                .requestMatchers("/api/deleteDevice").authenticated()

                // MOCK ENDPOINTS
                .requestMatchers("/api/deviceList").authenticated()
                .requestMatchers("/api/deviceInfo").authenticated()
                .and().cors().and().csrf().disable().oauth2ResourceServer().jwt();
        return http.build();
    }

    /**
     * Decodes the JWT and ensures that this token is intended for this application and checks the audience claims
     */
    @Bean
    JwtDecoder jwtDecoder() {

        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder)
                JwtDecoders.fromOidcIssuerLocation(issuer);

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }
}