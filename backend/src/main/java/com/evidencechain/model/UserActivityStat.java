package com.evidencechain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_activity_stats")
public class UserActivityStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "hour_bucket", nullable = false, length = 30)
    private String hourBucket;

    @Column(name = "action_count", nullable = false)
    private int actionCount = 0;

    public UserActivityStat() {
    }

    public UserActivityStat(Long userId, String hourBucket, int actionCount) {
        this.userId = userId;
        this.hourBucket = hourBucket;
        this.actionCount = actionCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getHourBucket() {
        return hourBucket;
    }

    public void setHourBucket(String hourBucket) {
        this.hourBucket = hourBucket;
    }

    public int getActionCount() {
        return actionCount;
    }

    public void setActionCount(int actionCount) {
        this.actionCount = actionCount;
    }
}
