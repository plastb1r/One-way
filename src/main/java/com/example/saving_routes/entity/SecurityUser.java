package com.example.saving_routes.entity;

import java.util.Arrays;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SecurityUser extends User implements UserDetails {

	private static final long serialVersionUID = 1L;

	private List<Role> authorities = Arrays.asList(Role.USER);

	private boolean accountNonExpired = true;

	private boolean accountNonLocked = true;

	private boolean credentialsNonExpired = true;

	private boolean enabled = true;

	public SecurityUser(String name, String password) {
		this.setName(name);
		this.setPassword(password);
	}

	public SecurityUser(User user) {
		this.setName(user.getName());
		this.setPassword(user.getPassword());
	}

	@Override
	public String getUsername() {
		return this.getName();
	}

}
