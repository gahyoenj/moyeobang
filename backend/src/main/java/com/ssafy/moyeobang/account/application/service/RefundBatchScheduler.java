package com.ssafy.moyeobang.account.application.service;

import com.ssafy.moyeobang.account.application.port.out.LoadTravelPort;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

@Component
public class RefundBatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job refundJob;
    private final LoadTravelPort loadTravelPort;
    private final TaskScheduler taskScheduler;

    // 생성자 주입
    public RefundBatchScheduler(JobLauncher jobLauncher, Job refundJob,
                                LoadTravelPort loadTravelPort, TaskScheduler taskScheduler) {
        this.jobLauncher = jobLauncher;
        this.refundJob = refundJob;
        this.loadTravelPort = loadTravelPort;
        this.taskScheduler = taskScheduler;
    }

    // 여행 종료 시간에 맞춰 환불 스케줄링
    public void scheduleRefundJob(Long travelAccountId) {
        // LoadTravelPort로 종료 시간 가져오기
        LocalDate endTime = loadTravelPort.findById(travelAccountId).getEndTime().plusDays(1);

        // 종료 시간을 Date로 변환
        Date triggerTime = Date.from(endTime.atStartOfDay(ZoneId.of("Asia/Seoul")).toInstant());

        // 예약된 시간에 맞춰 배치 작업 실행
        taskScheduler.schedule(() -> {
            try {
                // Job Parameters 설정
                JobParameters jobParameters = new JobParametersBuilder()
                        .addLong("travelAccountId", travelAccountId)
                        .addDate("scheduledTime", new Date())
                        .toJobParameters();

                jobLauncher.run(refundJob, jobParameters);  // 배치 작업 실행
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, triggerTime);
    }
}
