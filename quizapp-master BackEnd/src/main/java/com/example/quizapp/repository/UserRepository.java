package com.example.quizapp.repository;

import com.example.quizapp.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;



import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName ORDER BY u.coins DESC")
    List<User> findTop10ByRoleOrderByCoinsDesc(@Param("roleName") String roleName);
}
