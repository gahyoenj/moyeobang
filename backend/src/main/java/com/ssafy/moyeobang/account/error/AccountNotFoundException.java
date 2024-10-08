package com.ssafy.moyeobang.account.error;

public class AccountNotFoundException extends RuntimeException {

    public AccountNotFoundException() {
        super("계좌를 찾을 수 없습니다.");
    }
}
