from stable_baselines3.common.results_plotter import load_results, ts2xy
import matplotlib.pyplot as plt

log_dir = "./"

x, y = ts2xy(load_results(log_dir), "timesteps")

plt.plot(x, y)
plt.xlabel("Timesteps")
plt.ylabel("Episode Reward")
plt.title("PPO Reward Curve")
plt.show()