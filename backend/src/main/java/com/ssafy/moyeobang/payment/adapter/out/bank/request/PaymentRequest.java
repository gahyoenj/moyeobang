package com.ssafy.moyeobang.payment.adapter.out.bank.request;


import com.ssafy.moyeobang.payment.adapter.out.bank.Headers;

public record PaymentRequest(Headers Header,
                             String depositAccountNo,
                             String withdrawalAccountNo,
                             Long transactionBalance) {
}