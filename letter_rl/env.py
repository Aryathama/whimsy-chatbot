import numpy as np
import gymnasium as gym
from gymnasium import spaces
import random


class LetterEnv(gym.Env):
    metadata = {"render_modes": []}

    def __init__(self):
        super().__init__()

        # Physics parameters
        self.dt = 1.0 / 60.0

        self.max_force = 6.0
        self.max_torque = 8.0

        self.linear_friction = 0.90
        self.angular_friction = 0.88

        self.max_steps = 300

        # Observation space (NORMALIZED)
        # [pos_err, vel, rot_err, ang_vel]
        self.observation_space = spaces.Box(
            low=-1.0,
            high=1.0,
            shape=(4,),
            dtype=np.float32
        )

        # Action space
        # [slide_strength, rotate_strength]
        self.action_space = spaces.Box(
            low=-1.0,
            high=1.0,
            shape=(2,),
            dtype=np.float32
        )

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        # Position
        self.x = random.uniform(-2.0, 2.0)
        self.v = 0.0
        self.target_x = random.uniform(-2.0, 2.0)

        # Rotation (FIXED TARGET)
        self.theta = random.uniform(-np.pi, np.pi)
        self.omega = 0.0
        self.target_theta = 0.0

        self.step_count = 0
        self.last_dist = abs(self.target_x - self.x)
        self.last_angle_dist = abs(self._angle_diff(self.target_theta, self.theta))

        return self._get_obs(), {}

    def step(self, action):
        self.step_count += 1

        pos_error = self.target_x - self.x
        slide_dir = np.sign(pos_error)
        force = slide_dir * abs(action[0]) * self.max_force

        rot_error = self._angle_diff(self.target_theta, self.theta)
        torque = action[1] * self.max_torque

        # safety clamp near target
        if abs(rot_error) < 0.1:
            torque *= abs(rot_error) / 0.1


        # Physics
        self.v += force * self.dt
        self.v *= self.linear_friction
        self.x += self.v * self.dt

        self.omega += torque * self.dt
        self.omega *= self.angular_friction
        self.theta += self.omega * self.dt

        dist = abs(pos_error)
        angle_dist = abs(rot_error)

        angle_progress = self.last_angle_dist - angle_dist
        self.last_angle_dist = angle_dist

        progress = self.last_dist - dist
        self.last_dist = dist

        # Reward (TIGHT CONVERGENCE)
        reward = (
            -dist
            -0.2 * dist**2
            -0.5 * angle_dist
            -0.1 * abs(self.v)
            -0.05 * abs(self.omega)
            + 2.0 * progress
            + 1.5 * angle_progress
        )

        terminated = (
            dist < 0.05
            and angle_dist < 0.02
            and abs(self.v) < 0.05
            and abs(self.omega) < 0.05
        )

        if terminated:
            reward += 10.0

        truncated = self.step_count >= self.max_steps

        return self._get_obs(), reward, terminated, truncated, {}

    def _get_obs(self):
        return np.array([
            np.clip((self.target_x - self.x) / 5.0, -1, 1),
            np.clip(self.v * 0.2, -1, 1),
            np.clip(self._angle_diff(self.target_theta, self.theta) / np.pi, -1, 1),
            np.clip(self.omega * 0.2, -1, 1)
        ], dtype=np.float32)

    def _angle_diff(self, target, current):
        diff = target - current
        return (diff + np.pi) % (2 * np.pi) - np.pi