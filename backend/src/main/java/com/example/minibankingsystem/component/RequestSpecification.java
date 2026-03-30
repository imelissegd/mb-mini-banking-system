package com.example.minibankingsystem.component;

import com.example.minibankingsystem.model.Request;
import com.example.minibankingsystem.model.enums.RequestStatus;
import org.springframework.data.jpa.domain.Specification;

public class RequestSpecification {

    public static Specification<Request> withFilters(RequestStatus status) {
        return Specification.where(hasStatus(status));
    }

    private static Specification<Request> hasStatus(RequestStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }
}