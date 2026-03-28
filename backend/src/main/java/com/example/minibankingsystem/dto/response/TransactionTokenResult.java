package com.example.minibankingsystem.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonIgnoreType
public class TransactionTokenResult {
    private String token;
    private TransactionTokenResponse meta;
}
