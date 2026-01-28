package com.example.quizapp.dto;

public class EventCreateRequest {
    private String title;
    private String time;
    private int participants;
    private boolean primary;
    private String teacherEmail;
    private String teacherRole;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public int getParticipants() { return participants; }
    public void setParticipants(int participants) { this.participants = participants; }
    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getTeacherRole() { return teacherRole; }
    public void setTeacherRole(String teacherRole) { this.teacherRole = teacherRole; }
}
