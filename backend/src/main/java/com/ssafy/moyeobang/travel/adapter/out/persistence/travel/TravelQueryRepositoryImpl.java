package com.ssafy.moyeobang.travel.adapter.out.persistence.travel;

import static com.ssafy.moyeobang.common.persistenceentity.member.QMemberJpaEntity.memberJpaEntity;
import static com.ssafy.moyeobang.common.persistenceentity.member.QMemberTravelJpaEntity.memberTravelJpaEntity;
import static com.ssafy.moyeobang.common.persistenceentity.travel.QQuizJpaEntity.quizJpaEntity;
import static com.ssafy.moyeobang.common.persistenceentity.travel.QTravelAccountJpaEntity.travelAccountJpaEntity;
import static com.ssafy.moyeobang.common.persistenceentity.travel.QTravelJpaEntity.travelJpaEntity;

import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TravelQueryRepositoryImpl implements TravelQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<TravelInfo> findTravelInfosBy(Long memberId) {
        return queryFactory.select(travelInfo())
                .from(travelJpaEntity)
                .join(memberTravelJpaEntity).on(memberTravelJpaEntity.travel.eq(travelJpaEntity))
                .join(travelAccountJpaEntity).on(travelAccountJpaEntity.travel.eq(travelJpaEntity))
                .join(quizJpaEntity).on(quizJpaEntity.travel.eq(travelJpaEntity))
                .join(memberTravelJpaEntity.member, memberJpaEntity)
                .where(memberTravelJpaEntity.member.id.eq(memberId))
                .fetch();
    }

    @Override
    public Optional<TravelInfo> findTravelInfoBy(Long id) {
        TravelInfo travelInfo = queryFactory.select(travelInfo())
                .from(travelJpaEntity)
                .join(memberTravelJpaEntity).on(memberTravelJpaEntity.travel.eq(travelJpaEntity))
                .join(memberTravelJpaEntity.member, memberJpaEntity)
                .join(quizJpaEntity).on(quizJpaEntity.travel.eq(travelJpaEntity))
                .join(travelAccountJpaEntity).on(travelAccountJpaEntity.travel.eq(travelJpaEntity))
                .where(travelJpaEntity.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(travelInfo);
    }

    private QTravelInfo travelInfo() {
        return new QTravelInfo(
                travelJpaEntity,
                travelAccountJpaEntity,
                quizJpaEntity
        );
    }
}
