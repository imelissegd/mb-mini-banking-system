package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
