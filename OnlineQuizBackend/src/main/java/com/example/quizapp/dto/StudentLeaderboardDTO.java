package com.example.quizapp.dto;

public class StudentLeaderboardDTO {
    private String firstname;
    private String lastname;
    private int coins;

    public StudentLeaderboardDTO(String firstname, String lastname, int coins) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.coins = coins;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public int getCoins() {
        return coins;
    }

    public void setCoins(int coins) {
        this.coins = coins;
    }
}
