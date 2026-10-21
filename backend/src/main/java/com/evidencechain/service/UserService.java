package com.evidencechain.service;

import com.evidencechain.dto.UserDto;
import com.evidencechain.model.Role;
import com.evidencechain.model.User;
import com.evidencechain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
    }

    @Transactional
    public void lockUser(Long userId) {
        User user = getUserById(userId);
        user.setAccountLocked(true);
        userRepository.save(user);
    }

    @Transactional
    public void unlockUser(Long userId) {
        User user = getUserById(userId);
        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
    }

    @Transactional
    public void updateUserRole(Long userId, Role newRole) {
        User user = getUserById(userId);
        user.setRole(newRole);
        userRepository.save(user);
    }

    @Transactional
    public User createUser(String username, String rawPassword, String email, String fullName, Role role, String department, String agency, String badgeNumber) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        User user = new User(
                username,
                passwordEncoder.encode(rawPassword),
                email,
                fullName,
                role,
                department,
                agency,
                badgeNumber
        );
        return userRepository.save(user);
    }
}
