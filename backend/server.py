import flask
from flask import Flask
from matplotlib import pyplot as plt
import numpy as np
import io

app = Flask(__name__)

XY = ["x^2-y^2=0", "x^2+y^2=1"]
F = ["f(z)=2z+1", "f(z)=exp(z)", "f(z)=ln(z)"]


def get_xy(input):
    if input == XY[0]:
        x = np.arange(-1, 1, 0.01)
        return np.concatenate((x, x+0)), np.concatenate((x, -x))
    a = np.arange(-1 * np.pi, np.pi, 0.01)
    x = 1 * np.cos(a)
    y = 1 * np.sin(a)
    return x, y


def get_f(xz, yz, input):
    z = xz + yz * 1j
    if input == F[0]:
        fz = 2 * z + 1
        return fz.real, fz.imag
    if input == F[1]:
        fz = np.exp(z)
        return fz.real, fz.imag
    fz = np.log(z)
    return fz.real, fz.imag


@app.route("/image", methods=['GET', 'OPTIONS'])
def main():
    xy = flask.request.args.get('xy')
    f = flask.request.args.get('f')
    x1, y1 = get_xy(xy)
    fig, ax = plt.subplots()
    ax.plot(x1, y1, color='red', linewidth=1, linestyle='-')

    plot1 = plot2 = ""
    with io.StringIO() as buffer:
        fig.savefig(buffer, format='svg')
        plot1 = buffer.getvalue()

    ax.clear()
    x2, y2 = get_f(x1, y1, f)
    ax.plot(x2, y2, color='cyan', label='cos x', linewidth=3, linestyle='-')

    with io.StringIO() as buffer:
        fig.savefig(buffer, format='svg')
        plot2 = buffer.getvalue()
    return [plot1, plot2]


if __name__=="__main__":
    app.run(debug=True)