# import torch
# import numpy as np
# a = np.array([1.0,2.0,3.0])
# b = torch.from_numpy(a)
# print(a)
# print(b)

# import torch
# a = torch.tensor([[3,4,5],[6,7,8]])
# print(a)
# print(a.type())
#
# b = torch.FloatTensor([[3,4,5],[6,7,8]])
# print(b)
# print(b.type())

# import torch
# a = torch.full((2,3),5)
# print(a)
# print(a.type())

# import torch
# #torch.arange()创建
# a = torch.arange(0,10,2)
# print(a.type())
# print(a)

# import torch
# a = torch.rand(2,3)
# print(a)
# print(a.type())
# b = torch.randint(1,10,(2,3))
# print(b)
# print(b.type())
# x = torch.tensor([[1.0,2.0],[3.0,4.0]])
# c = torch.rand_like(x)
# print(c)
# print(c.type())

# import torch
# a = torch.randn(2,3)
# print(a)
# print(a.type())
# b = torch.normal(1,10,(2,3))
# print(b)
# print(b.type())

# import numpy as np
#
# # 1. 计算混淆矩阵 hist
# def fast_hist(a, b, n):
#     k = (a >= 0) & (a < n)
#     return np.bincount(n * a[k].astype(int) + b[k], minlength=n**2).reshape(n, n)
#
# # 2. 计算每一类的 IoU
# def per_class_iu(hist):
#     return np.diag(hist) / (hist.sum(1) + hist.sum(0) - np.diag(hist))
#
# # ======================
# # 下面开始真正运行
# # ======================
#
# # 假设有 2 类：0=背景，1=目标
# n_classes = 2
#
# # 真实标签（展平后的一维数组）
# a = np.array([0, 0, 0, 1, 1, 1])
#
# # 模型预测标签
# b = np.array([0, 0, 1, 1, 1, 0])
#
# # 1. 计算混淆矩阵 hist
# hist = fast_hist(a, b, n_classes)
# print("混淆矩阵 hist：")
# print(hist)
# print()
#
# # 2. 计算每一类 IoU
# iou_per_class = per_class_iu(hist)
# print("每一类 IoU：")
# print(iou_per_class)
# print()
#
# # 3. 计算平均 IoU（mIoU）
# mIoU = np.mean(iou_per_class)
# print("平均 IoU (mIoU) =", mIoU)

# import torch as t
# a = t.tensor([[1,2],[3,4]])
# b = t.tensor([[5,6],[7,8]])
# print("a加b==",t.add(a,b))
# print("a减b==",t.sub(a,b))
# print("a乘b==",t.mul(a,b))
# print("a除b==",t.div(a,b))
# print("a的2次幂==",t.pow(a,2))
# print("b的绝对值==",t.abs(b))

# import torch as t
# a = t.tensor([[1,2],[3,4]])
# b = t.tensor([[5,6],[7,8]])
# c = t.matmul(a,b)
# d = t.mul(a,b)
# print(c)
# print(d)

# import torch as t
# aa = t.randn(4,3)
# print(aa)
# print(aa[-1:])
# print(aa[-2:])
# print(aa[:2])
# print(aa[:-1])

# import torch
# if torch.cuda.is_available():
#     print("There is a gpu available.")
# else:
#     print("There is no gpu available.")
#
# import numpy
# import torch
# print(numpy.__version__)
# print(torch.cuda.is_available())

