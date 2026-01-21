package com.example.quizapp.config;

import com.example.quizapp.entity.Role;
import com.example.quizapp.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer {

    private final RoleRepository roleRepo;

    public RoleInitializer(RoleRepository roleRepo) {
        this.roleRepo = roleRepo;
    }

    @PostConstruct
    public void initRoles() {

        if (roleRepo.findByName("USER") == null) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepo.save(userRole);
        }

        if (roleRepo.findByName("ADMIN") == null) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepo.save(adminRole);
        }
    }
}
