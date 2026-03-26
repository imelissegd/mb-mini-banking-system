package com.example.minibankingsystem.config.security;

import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User dbUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username "  + username + " not found."));

        return new org.springframework.security.core.userdetails.User(
                dbUser.getUsername(),
                dbUser.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + dbUser.getRole()))
        );
    }
}
