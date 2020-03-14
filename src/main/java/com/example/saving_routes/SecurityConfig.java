package com.example.saving_routes;

import com.example.saving_routes.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers(new String[] { "/", "/not-restricted" }).permitAll()
            .anyRequest().authenticated()
            .and()
            .httpBasic()//oauth2Login()
            .and().logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).permitAll();
    }

    @Bean
    public PasswordEncoder bcryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(bcryptPasswordEncoder());
    }

}

// import com.example.saving_routes.entity.SecurityUser;
// import com.example.saving_routes.services.UserService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import
// org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.BeanIds;
// import
// org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import
// org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.provisioning.InMemoryUserDetailsManager;
// import
// org.springframework.security.web.authentication.www.DigestAuthenticationEntryPoint;
// import
// org.springframework.security.web.authentication.www.DigestAuthenticationFilter;


// @Configuration
// public class SecurityConfig extends WebSecurityConfigurerAdapter {

// @Autowired
// UserDetailsService userDetailsService;

// @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
// @Override
// public AuthenticationManager authenticationManagerBean() throws Exception {
// return super.authenticationManagerBean();
// }

// @Bean
// public PasswordEncoder encoder() {
// return new BCryptPasswordEncoder();
// }

// @Bean
// DaoAuthenticationProvider authenticationProvider(){
// DaoAuthenticationProvider daoAuthenticationProvider = new
// DaoAuthenticationProvider();
// daoAuthenticationProvider.setPasswordEncoder( encoder() );
// daoAuthenticationProvider.setUserDetailsService( userDetailsService );
// return daoAuthenticationProvider;
// }

// @Override
// protected void configure(AuthenticationManagerBuilder authManagerBuilder) {
// authManagerBuilder.authenticationProvider( authenticationProvider() );
// }

// @Override
// protected void configure(HttpSecurity http) throws Exception {
// http.addFilter(digestAuthenticationFilter()) // register digest entry point
// .exceptionHandling().authenticationEntryPoint(digestEntryPoint()) // on
// exception ask for digest authentication
// .and()
// .httpBasic() // it indicate basic authentication is requires
// .and()
// .authorizeRequests()
// .antMatchers( "/api/users").permitAll() // /home will be accessible directly,
// no need of any authentication
// .anyRequest().authenticated();

// }

// DigestAuthenticationFilter digestAuthenticationFilter() throws Exception {

// DigestAuthenticationFilter digestAuthenticationFilter = new
// DigestAuthenticationFilter();
// digestAuthenticationFilter.setUserDetailsService(userDetailsServiceBean());
// digestAuthenticationFilter.setAuthenticationEntryPoint(digestEntryPoint());
// return digestAuthenticationFilter;
// }

// @Override
// @Bean
// public UserDetailsService userDetailsServiceBean() {
// InMemoryUserDetailsManager inMemoryUserDetailsManager = new
// InMemoryUserDetailsManager();
// SecurityUser ud =new SecurityUser();
// ud.setName("name");
// ud.setEmail("email");
// ud.setPassword("password");
// inMemoryUserDetailsManager.createUser(ud);
// return inMemoryUserDetailsManager;

// }

// @Bean
// DigestAuthenticationEntryPoint digestEntryPoint() {
// DigestAuthenticationEntryPoint bauth = new DigestAuthenticationEntryPoint();
// bauth.setRealmName("Digest WF Realm");
// bauth.setKey("MySecureKey");
// return bauth;
// }

// @Bean
// public AuthenticationManager customAuthenticationManager() throws Exception {
// return authenticationManager();
// }
// }