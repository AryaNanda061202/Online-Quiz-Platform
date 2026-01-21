package com.example.quizapp.controller;

import com.example.quizapp.dto.SignupRequest;
import com.example.quizapp.dto.LoginRequest;
import com.example.quizapp.entity.Role;
import com.example.quizapp.entity.User;
import com.example.quizapp.repository.RoleRepository;
import com.example.quizapp.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;
import com.example.quizapp.dto.StudentLeaderboardDTO;
import com.example.quizapp.dto.QuizCreateRequest;
import com.example.quizapp.repository.QuizRepository;
import com.example.quizapp.repository.QuestionRepository;
import com.example.quizapp.entity.Quiz;
import com.example.quizapp.entity.Question;
import com.example.quizapp.dto.EventCreateRequest;
import com.example.quizapp.repository.EventRepository;
import com.example.quizapp.entity.Event;
import com.example.quizapp.dto.StudentQuizDTO;
import com.example.quizapp.entity.StudentQuiz;
import com.example.quizapp.repository.StudentQuizRepository;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final BCryptPasswordEncoder encoder;
    private final QuizRepository quizRepo;
    private final QuestionRepository questionRepo;
    private final EventRepository eventRepo;
    private final StudentQuizRepository studentQuizRepo;

    public AuthController(UserRepository userRepo,
                          RoleRepository roleRepo,
                          BCryptPasswordEncoder encoder,
                          QuizRepository quizRepo,
                          QuestionRepository questionRepo,
                          EventRepository eventRepo,
                          StudentQuizRepository studentQuizRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
        this.eventRepo = eventRepo;
        this.studentQuizRepo = studentQuizRepo;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public String register(@RequestBody SignupRequest signupRequest) {

        if (userRepo.findByEmail(signupRequest.getEmail()).isPresent()) {
            return "Email already registered";
        }

        // Get role from request, default to STUDENT if not provided or invalid
        String roleName = signupRequest.getRole();
        if (roleName == null || roleName.isEmpty()) {
            roleName = "STUDENT";
        }
        
        // Convert role to uppercase for consistency
        roleName = roleName.toUpperCase();
        
        Role role = roleRepo.findByName(roleName);
        if (role == null) {
            return "Invalid role: " + roleName;
        }

        // Create new user
        User user = new User();
        user.setFirstname(signupRequest.getFirstname());
        user.setLastname(signupRequest.getLastname());
        user.setName(signupRequest.getFirstname() + " " + signupRequest.getLastname());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(encoder.encode(signupRequest.getPassword()));
        user.setRole(role);

        userRepo.save(user);
        
        return "User registered successfully";
    }


    // ================= LOGIN =================
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepo.findByEmail(loginRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();
        // Match raw password with encrypted password
        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return null;
        }
        // Check role
        String requestedRole = loginRequest.getRole();
        if (requestedRole != null && !requestedRole.isEmpty()) {
            String userRole = user.getRole() != null ? user.getRole().getName() : null;
            if (userRole == null || !userRole.equalsIgnoreCase(requestedRole)) {
                return null;
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("firstname", user.getFirstname());
        response.put("lastname", user.getLastname());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().getName());
        response.put("coins", user.getCoins());
        response.put("id", user.getId());       
      return response;
    }

    // ================= STUDENT LEADERBOARD =================
    @GetMapping("/top10students")
    public List<StudentLeaderboardDTO> getTop10Students() {
        return userRepo.findTop10ByRoleOrderByCoinsDesc("STUDENT")
                .stream()
                .limit(10)
                .map(u -> new StudentLeaderboardDTO(u.getFirstname(), u.getLastname(), u.getCoins()))
                .collect(Collectors.toList());
    }

    // ================= CREATE QUIZ =================
    @PostMapping("/quiz")
    public String createQuiz(@RequestBody QuizCreateRequest request) {
        // Check teacher exists and has correct role
        if (request.getTeacherEmail() == null || request.getTeacherRole() == null) {
            return "Teacher email and role are required";
        }
        Optional<User> teacherOpt = userRepo.findByEmail(request.getTeacherEmail());
        if (teacherOpt.isEmpty()) {
            return "Teacher not found";
        }
        User teacher = teacherOpt.get();
        if (teacher.getRole() == null || !teacher.getRole().getName().equalsIgnoreCase(request.getTeacherRole()) || !teacher.getRole().getName().equalsIgnoreCase("TEACHER")) {
            return "User is not a teacher";
        }
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(request.getCategory());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setRandomize(request.isRandomize());
        quiz.setImmediateResults(request.isImmediateResults());
        quiz.setTeacher(teacher);
        List<Question> questions = request.getQuestions().stream().map(qdto -> {
            Question q = new Question();
            q.setQuiz(quiz);
            q.setText(qdto.getText());
            q.setPoints(qdto.getPoints());
            q.setType(qdto.getType());
            q.setOptions(qdto.getOptions());
            q.setCorrect(qdto.getCorrect());
            return q;
        }).collect(Collectors.toList());
        quiz.setQuestions(questions);
        int totalPoints = questions.stream().mapToInt(Question::getPoints).sum();
        quiz.setTotalPoints(totalPoints);
        quizRepo.save(quiz);
        // Assign to all students
        List<User> students = userRepo.findAll().stream()
            .filter(u -> u.getRole() != null && u.getRole().getName().equalsIgnoreCase("STUDENT"))
            .collect(Collectors.toList());
        for (User student : students) {
            StudentQuiz sq = new StudentQuiz();
            sq.setStudent(student);
            sq.setQuiz(quiz);
            sq.setCoins(totalPoints);
            sq.setCompleted(false);
            studentQuizRepo.save(sq);
        }
        return "Quiz created and assigned to all students";
    }

    // ================= GET QUIZZES BY TEACHER =================
    @GetMapping("/quiz/by-teacher")
    public List<Map<String, Object>> getQuizzesByTeacher(@RequestParam("teacherId") Long teacherId) {
        return quizRepo.findAll().stream()
            .filter(q -> q.getTeacher() != null && q.getTeacher().getId().equals(teacherId))
            .map(q -> {
                Map<String, Object> quizMap = new HashMap<>();
                quizMap.put("id", q.getId());
                quizMap.put("title", q.getTitle());
                quizMap.put("description", q.getDescription());
                quizMap.put("category", q.getCategory());
                quizMap.put("difficulty", q.getDifficulty());
                quizMap.put("timeLimit", q.getTimeLimit());
                quizMap.put("passingScore", q.getPassingScore());
                quizMap.put("randomize", q.isRandomize());
                quizMap.put("immediateResults", q.isImmediateResults());
                quizMap.put("totalPoints", q.getTotalPoints());
                // Optionally add teacher name or id if needed
                quizMap.put("teacherName", q.getTeacher() != null ? q.getTeacher().getName() : null);
                return quizMap;
            })
            .collect(Collectors.toList());
    }

    

    // ================= CREATE EVENT =================
    @PostMapping("/event")
    public String createEvent(@RequestBody EventCreateRequest request) {
        if (request.getTeacherEmail() == null || request.getTeacherRole() == null) {
            return "Teacher email and role are required";
        }
        Optional<User> teacherOpt = userRepo.findByEmail(request.getTeacherEmail());
        if (teacherOpt.isEmpty()) {
            return "Teacher not found";
        }
        User teacher = teacherOpt.get();
        if (teacher.getRole() == null || !teacher.getRole().getName().equalsIgnoreCase(request.getTeacherRole()) || !teacher.getRole().getName().equalsIgnoreCase("TEACHER")) {
            return "User is not a teacher";
        }
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setTime(request.getTime());
        event.setParticipants(request.getParticipants());
        event.setPrimary(request.isPrimary());
        event.setTeacher(teacher);
        eventRepo.save(event);
        return "Event created successfully";
    }

    // ================= VIEW ALL EVENTS =================
    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    // ================= VIEW QUIZZES FOR STUDENT =================
    @GetMapping("/student-quizzes")
    public List<StudentQuizDTO> getStudentQuizzes(@RequestParam("studentEmail") String studentEmail) {
        return studentQuizRepo.findByStudentEmail(studentEmail).stream()
                .map(sq -> new StudentQuizDTO(
                        sq.getQuiz().getTitle(),
                        sq.getQuiz().getTeacher() != null ? sq.getQuiz().getTeacher().getName() : "",
                        sq.getCoins(),
                        sq.isCompleted()
                ))
                .collect(Collectors.toList());
    }
}
