# import torch

# # a simple CNN model using pytorch

# class NeuralNetwork(torch.nn.Module):
#     def __init__(self):
#         super(NeuralNetwork, self).__init__()
#         self.conv1 = torch.nn.Conv2d(1, 3, 3)
#         self.conv2 = torch.nn.Conv2d(3, 6, 3)
#         self.fc1 = torch.nn.Linear(150, 50)
#         self.fc2 = torch.nn.Linear(50, 10)

#     def forward(self, x):
#         x = torch.nn.functional.relu(self.conv1(x))
#         x = torch.nn.functional.max_pool2d(x, 2)
#         x = torch.nn.functional.relu(self.conv2(x))
#         x = torch.nn.functional.max_pool2d(x, 2)
#         x = x.view(-1, 150)
#         x = torch.nn.functional.relu(self.fc1(x))
#         x = self.fc2(x)
#         return x
