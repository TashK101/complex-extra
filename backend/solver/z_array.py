import numpy as np


class ZArray:
    def __init__(self, points: [[float, float]]):
        self.points = np.array(points)

    def get_x (self):
        return self.points[..., 0]

    def get_y (self):
        return self.points[..., 1]


class ZLabeledArray:
    def __init__(self, labeled_points):
        if labeled_points is [[int, ZArray]]:
            self.labeled_points = labeled_points
        else:
            try:
                self.labeled_points = []
                for labeled in labeled_points:
                    label = labeled[0]
                    points = labeled[1]
                    z = ZArray(points)
                    self.labeled_points.append([label, z])
            except TypeError:
                raise TypeError('Not a valid labeled array')