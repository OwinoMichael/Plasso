package com.mikeo.plasso.features.users;

import com.mikeo.plasso.features.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findUsersByEmail(String email);
}
