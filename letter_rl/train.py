from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import SubprocVecEnv
from env import LetterEnv

def make_env():
    return LetterEnv()

if __name__ == "__main__":
    env = SubprocVecEnv([make_env for _ in range(16)])

    model = PPO(
        "MlpPolicy",
        env,
        verbose=1,
        n_steps=2048,
        batch_size=64,
        gamma=0.99,
        learning_rate=3e-4,
    )

    model.learn(total_timesteps=1_000_000)
    model.save("sr_policy")

    print("Training complete.")