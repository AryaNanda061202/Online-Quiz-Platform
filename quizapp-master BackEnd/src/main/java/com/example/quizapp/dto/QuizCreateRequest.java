package com.example.quizapp.dto;

import java.util.List;

public class QuizCreateRequest {
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private int timeLimit;
    private int passingScore;
    private boolean randomize;
    private boolean immediateResults;
    private String teacherEmail;
    private String teacherRole;
    private List<QuestionDTO> questions;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public int getTimeLimit() { return timeLimit; }
    public void setTimeLimit(int timeLimit) { this.timeLimit = timeLimit; }
    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }
    public boolean isRandomize() { return randomize; }
    public void setRandomize(boolean randomize) { this.randomize = randomize; }
    public boolean isImmediateResults() { return immediateResults; }
    public void setImmediateResults(boolean immediateResults) { this.immediateResults = immediateResults; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getTeacherRole() { return teacherRole; }
    public void setTeacherRole(String teacherRole) { this.teacherRole = teacherRole; }
    public List<QuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDTO> questions) { this.questions = questions; }

    public static class QuestionDTO {
        private String text;
        private int points;
        private String type;
        private List<String> options;
        private int correct;

        // Getters and setters
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public int getPoints() { return points; }
        public void setPoints(int points) { this.points = points; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
        public int getCorrect() { return correct; }
        public void setCorrect(int correct) { this.correct = correct; }
    }
}
