import flask
from flask import Flask, request
from matplotlib import pyplot as plt
import numpy as np
import io
from solver.z_array import ZArray, ZLabeledArray

app = Flask(__name__)

F = ["f(z)=2z+1", "f(z)=exp(z)", "f(z)=ln(z)"]


def get_f(xz, yz, input):
    z = xz + yz * 1j
    if input == F[0]:
        fz = 2 * z + 1
        return [[w.real, w.imag] for w in fz]
    if input == F[1]:
        fz = np.exp(z)
        return [[w.real, w.imag] for w in fz]
    fz = np.log(z)
    return [[w.real, w.imag] for w in fz]


@app.route("/strokes", methods=['GET', 'POST', 'OPTIONS'])
def main():
    data = request.get_json(force=True)['z']
    try:
        z_array = ZLabeledArray(data)
        f = request.args.get('f')
    except TypeError:
        return "Bad request", 400
    response = []
    for label, z in z_array.labeled_points:
        x1, y1 = z.get_x(), z.get_y()
        fz = get_f(x1, y1, f)
        response.append([label, fz])
    return response


if __name__=="__main__":
    app.run(debug=True)