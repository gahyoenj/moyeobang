package com.ssafy.moyeobang.payment.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    TRAVEL_ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, 2001, "여행 계좌를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final int code;
    private final String message;
}
