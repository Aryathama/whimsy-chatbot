import json
import torch
from stable_baselines3 import PPO

model = PPO.load("sr_policy")

policy_net = model.policy.mlp_extractor.policy_net

weights = []

for layer in policy_net:
    if isinstance(layer, torch.nn.Linear):
        weights.append(layer.weight.detach().cpu().numpy().tolist())
        weights.append(layer.bias.detach().cpu().numpy().tolist())

with open("sr_policy_weights.json", "w") as f:
    json.dump(weights, f)

print("Weights exported.")