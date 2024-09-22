package com.ssafy.moyeobang.account.application.service;

import com.ssafy.moyeobang.account.adapter.in.web.response.GetAccountBalanceResponse;
import com.ssafy.moyeobang.account.application.domain.Account;
import com.ssafy.moyeobang.account.application.port.in.GetAccountBalanceQuery;
import com.ssafy.moyeobang.account.application.port.out.LoadAccountPort;
import com.ssafy.moyeobang.common.annotation.UseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetAccountBalanceService implements GetAccountBalanceQuery {

    private final LoadAccountPort loadAccountPort;

    @Override
    public GetAccountBalanceResponse getAccountBalance(String accountNumber) {
        Account account = loadAccountPort.loadTravelAccount(accountNumber);

        return new GetAccountBalanceResponse(
                account.getBalance(),
                account.getDepositAmount(),
                account.getWithdrawAmount()
        );
    }
}
