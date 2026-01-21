package com.example.quizapp.dto;

public class StudentQuizDTO {
    private String title;
    private String assignedBy;
    private int coins;
    private boolean completed;

    public StudentQuizDTO(String title, String assignedBy, int coins, boolean completed) {
        this.title = title;
        this.assignedBy = assignedBy;
        this.coins = coins;
        this.completed = completed;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
