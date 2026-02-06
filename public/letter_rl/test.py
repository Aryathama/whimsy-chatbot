from stable_baselines3 import PPO
from env import LetterEnv

env = LetterEnv()
model = PPO.load("slide_policy", env=env)

obs = env.reset()[0]

for _ in range(300):
    action, _ = model.predict(obs, deterministic=True)

    obs, reward, terminated, truncated, info = env.step(action)
    done = terminated or truncated

    angle_err = abs(env._angle_diff(env.target_theta, env.theta))

    print(
        f"x={env.x:.2f}, "
        f"target={env.target_x:.2f}, "
        f"θ={env.theta:.2f}, "
        f"θ_err={angle_err:.4f} rad, "
        f"reward={reward:.2f}"
    )

    if done:
        print("SUCCESS")
        break