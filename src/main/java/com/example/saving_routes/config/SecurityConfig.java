package com.example.saving_routes.config;

import com.example.saving_routes.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.DigestAuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.DigestAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserService userService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // http.csrf().disable().cors()
        //     .and()
        //     .addFilter(digestAuthenticationFilter()) 
        //     .exceptionHandling().authenticationEntryPoint(digestEntryPoint())
        //     .and()
        //     .authorizeRequests().antMatchers("/api/opentest").permitAll()
        //     .anyRequest().authenticated()
        //     .and()
        //     .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).permitAll();
        http.csrf().disable().cors()
        .and()
        .authorizeRequests().antMatchers("/**").permitAll()
        .anyRequest().authenticated();
    }

    DigestAuthenticationFilter digestAuthenticationFilter() throws Exception {
        DigestAuthenticationFilter digestAuthenticationFilter = new DigestAuthenticationFilter();
        digestAuthenticationFilter.setUserDetailsService(userDetailsServiceBean());
        digestAuthenticationFilter.setAuthenticationEntryPoint(digestEntryPoint());
        return digestAuthenticationFilter;
    }

    @Override
    @Bean
    public UserDetailsService userDetailsServiceBean() {
        return userService;
    }
    
    @Bean
    DigestAuthenticationEntryPoint digestEntryPoint() {
        DigestAuthenticationEntryPoint bauth = new DigestAuthenticationEntryPoint();
        bauth.setRealmName("DigestAuthRealm");
        bauth.setKey("MySecureKey");
        return bauth;
    }
    
    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(encoder());
        daoAuthenticationProvider.setUserDetailsService(userService);
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder encoder() {
        return new EmptyPasswordEncoderImpl();
    }
    
}