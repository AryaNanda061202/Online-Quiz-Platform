package com.example.quizapp.repository;

import com.example.quizapp.entity.StudentQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentQuizRepository extends JpaRepository<StudentQuiz, Long> {
    List<StudentQuiz> findByStudentEmail(String email);
}
