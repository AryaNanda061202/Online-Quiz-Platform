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
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;

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

    // ================= GET QUIZZES ASSIGNED TO STUDENT =================
    @GetMapping("/quiz/assigned")
    public List<Map<String, Object>> getQuizzesAssignedToStudent(@RequestParam("studentId") Long studentId) {
        return studentQuizRepo.findAll().stream()
                .filter(sq -> sq.getStudent() != null && sq.getStudent().getId().equals(studentId))
                .map(sq -> {
                    Map<String, Object> quizMap = new HashMap<>();
                    quizMap.put("quizId", sq.getQuiz() != null ? sq.getQuiz().getId() : null);
                    quizMap.put("title", sq.getQuiz() != null ? sq.getQuiz().getTitle() : "");
                    quizMap.put("assignedBy", (sq.getQuiz() != null && sq.getQuiz().getTeacher() != null) ? sq.getQuiz().getTeacher().getName() : "");
                    quizMap.put("coins", sq.getCoins());
                    quizMap.put("completed", sq.isCompleted());
                    quizMap.put("timeLimit", sq.getQuiz() != null ? sq.getQuiz().getTimeLimit() : null);
                    quizMap.put("questionsCount", (sq.getQuiz() != null && sq.getQuiz().getQuestions() != null) ? sq.getQuiz().getQuestions().size() : 0);
                    return quizMap;
                })
                .collect(Collectors.toList());
    }

    // ================= GET QUESTIONS FOR STUDENT'S ASSIGNED QUIZ =================
    @GetMapping("/student/quiz/questions")
    public List<Map<String, Object>> getQuestionsForStudentQuiz(
            @RequestParam("studentId") Long studentId,
            @RequestParam("quizId") Long quizId) {
        // Check if the student is assigned this quiz
        boolean assigned = studentQuizRepo.findAll().stream()
            .anyMatch(sq -> sq.getStudent() != null && sq.getStudent().getId().equals(studentId)
                         && sq.getQuiz() != null && sq.getQuiz().getId().equals(quizId));
        if (!assigned) {
            return List.of(); // or throw error if preferred
        }
        // Fetch quiz and its questions
        Optional<Quiz> quizOpt = quizRepo.findById(quizId);
        if (quizOpt.isEmpty() || quizOpt.get().getQuestions() == null) {
            return List.of();
        }
        return quizOpt.get().getQuestions().stream().map(q -> {
            Map<String, Object> questionMap = new HashMap<>();
            questionMap.put("id", q.getId());
            questionMap.put("text", q.getText());
            questionMap.put("points", q.getPoints());
            questionMap.put("type", q.getType());
            questionMap.put("options", q.getOptions());
            // Do NOT include correct answer
            return questionMap;
        }).collect(Collectors.toList());
    }

    // ================= SUBMIT QUIZ AND GET RESULT =================
@SuppressWarnings("unused")
@PostMapping("/student/quiz/submit")
public ResponseEntity<Map<String, Object>> submitQuiz(
        @RequestParam("studentId") Long studentId,
        @RequestParam("quizId") Long quizId,
        @RequestBody Map<String, Object> answers // questionId (as String) -> answer (String or List<String>)
) {
    // Validate student and quiz assignment
    Optional<User> studentOpt = userRepo.findById(studentId);
    if (studentOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Student not found"));
    }
    Optional<Quiz> quizOpt = quizRepo.findById(quizId);
    if (quizOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Quiz not found"));
    }
    Quiz quiz = quizOpt.get();
    User student = studentOpt.get();

    // Find StudentQuiz assignment
    Optional<StudentQuiz> studentQuizOpt = studentQuizRepo.findAll().stream()
        .filter(sq -> sq.getStudent() != null && sq.getStudent().getId().equals(studentId)
                   && sq.getQuiz() != null && sq.getQuiz().getId().equals(quizId))
        .findFirst();
    if (studentQuizOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Quiz not assigned to student"));
    }
    StudentQuiz studentQuiz = studentQuizOpt.get();
    if (studentQuiz.isCompleted()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Quiz already completed"));
    }

    // Evaluate answers and add coins for each correct answer
    int totalScore = 0;
    int totalPossible = 0;
    int correctCount = 0;
    int totalQuestions = quiz.getQuestions() != null ? quiz.getQuestions().size() : 0;
    List<Map<String, Object>> questionResults = new ArrayList<>();
    int coinsAdded = 0;

    if (quiz.getQuestions() != null) {
        for (Question q : quiz.getQuestions()) {
            totalPossible += q.getPoints();
            Object submitted = answers.get(String.valueOf(q.getId()));
            boolean correct = false;
            if (submitted != null) {
                try {
                    int correctIndex = q.getCorrect();
                    int submittedIndex = Integer.parseInt(submitted.toString());
                    if (correctIndex == submittedIndex) {
                        correct = true;
                    }
                } catch (Exception e) {
                    // ignore parse errors, treat as incorrect
                }
            }
            if (correct) {
                totalScore += q.getPoints();
                correctCount++;
                // Add coins for each correct answer
                student.setCoins(student.getCoins() + q.getPoints());
                coinsAdded += q.getPoints();
            }
            Map<String, Object> qResult = new HashMap<>();
            qResult.put("questionId", q.getId());
            qResult.put("correct", correct);
            qResult.put("points", q.getPoints());
            questionResults.add(qResult);
        }
    }

    // Save updated coins for student
    userRepo.save(student);

    // Check if passed
    boolean passed = totalScore >= quiz.getPassingScore();

    // Mark as completed
    studentQuiz.setCompleted(true);
    studentQuizRepo.save(studentQuiz);

    // Prepare result
    Map<String, Object> result = new HashMap<>();
    result.put("score", totalScore);
    result.put("totalPossible", totalPossible);
    result.put("correctCount", correctCount);
    result.put("totalQuestions", totalQuestions);
    result.put("passed", passed);
    result.put("coinsAdded", coinsAdded);
    result.put("questionResults", questionResults);
    result.put("totalCoins", student.getCoins());

    return ResponseEntity.ok(result);
}

    // ================= GET STUDENT COINS BY ID =================
    @GetMapping("/student/coins")
    public ResponseEntity<Map<String, Object>> getStudentCoins(@RequestParam("id") Long id) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        if (user.getRole() == null || !user.getRole().getName().equalsIgnoreCase("STUDENT")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User is not a student"));
        }
        return ResponseEntity.ok(Map.of("id", user.getId(), "coins", user.getCoins()));
    }
}

