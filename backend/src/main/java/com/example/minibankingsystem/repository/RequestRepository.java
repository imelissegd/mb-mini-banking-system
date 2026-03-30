package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.Request;
import com.example.minibankingsystem.model.enums.RequestStatus;
import com.example.minibankingsystem.model.enums.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RequestRepository extends
        JpaRepository<Request, Long>,
        JpaSpecificationExecutor<Request> {

    Page<Request> findByUserId(Long userId, Pageable pageable);
    Page<Request> findByStatus(RequestStatus status, Pageable pageable);
    Page<Request> findAll(Specification<Request> spec, Pageable pageable);
    boolean existsByUserIdAndTypeAndStatus(Long userId, RequestType type, RequestStatus status);
}