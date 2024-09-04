package com.ssafy.moyeobang.settle.adapter.out;

import com.ssafy.moyeobang.settle.application.domain.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    Account mapToDomain(AccountEntity accountEntity) {

        return Account.of(
                new Account.AccountNo(accountEntity.getUuid()),
                new Account.Bank(accountEntity.getBankCode(), accountEntity.getBankName()),
                new Account.AccountInfo(
                        accountEntity.getTypeCode(),
                        accountEntity.getTypeName(),
                        accountEntity.getName(),
                        accountEntity.getDescription(),
                        accountEntity.getAccountType()
                )
        );
    }

    AccountEntity mapToEntity(Account account) {

        return AccountEntity.builder()
                .uuid(account.getNo().accountId())
                .bankCode(account.getBank().bankCode())
                .bankName(account.getBank().bankName())
                .typeCode(account.getInfo().typeCode())
                .accountType(account.getInfo().accountType())
                .typeName(account.getInfo().typeName())
                .name(account.getInfo().name())
                .description(account.getInfo().description())
                .accountType(account.getInfo().accountType())
                .build();
    }
}
